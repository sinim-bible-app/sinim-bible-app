#!/bin/bash

# Function to check and install a tool
check_and_install() {
    tool=$1
    install_cmd=$2
    echo "Checking for $tool..."
    if ! command -v $tool &> /dev/null; then
        echo "$tool could not be found, installing..."
        $install_cmd $tool
    else
        echo "$tool is already installed."
    fi
}

# Determine OS and set installation command accordingly
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "Linux OS detected. Checking for apt..."
    if command -v apt &> /dev/null; then
        install_cmd="sudo apt-get install -y"
    else
        echo "apt not found, please install apt or modify the script to support your package manager."
        exit 1
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "macOS detected. Checking for Homebrew..."
    if ! command -v brew &> /dev/null; then
        echo "Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    install_cmd="brew install"
else
    echo "Unsupported OS. This script supports only Linux and macOS."
    exit 1
fi

# List of general tools required (add your own tools here)
tools=("git" "make" "node" "npm")

# Install tools using the determined command
for tool in "${tools[@]}"; do
    check_and_install $tool "$install_cmd"
done

# Install Node Version Manager (nvm) if not installed, and use it to manage Node.js version
if ! command -v nvm &> /dev/null; then
    echo "nvm not found, installing..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
fi

# Use nvm to install and use the correct Node.js version
nvm install --lts
nvm use --lts

# Check if Vite and Vue CLI are installed globally, and install via npm if not
npm_tools=("vite" "@vue/cli")
for tool in "${npm_tools[@]}"; do
    echo "Checking for $tool..."
    if ! npm list -g $tool &> /dev/null; then
        echo "$tool could not be found, installing globally with npm..."
        npm install -g $tool
    else
        echo "$tool is already installed."
    fi
done

# Install project dependencies
if [ -f "package.json" ]; then
    echo "Installing project dependencies using npm..."
    npm install
else
    echo "package.json not found. Make sure you are in the correct project directory."
    exit 1
fi

# Start the build process
echo "Starting the build process..."
npm run build

# Add any additional build commands below
# Example: make install

