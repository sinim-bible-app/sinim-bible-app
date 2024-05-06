# Contributing to Sinim Bible App

We're excited that you're interested in contributing to Sinim Bible App.
This document provides guidelines and instructions to help you set up your development environment and submit contributions.

## Prerequisites

Before you can start working, you'll need to have [Node.js](https://nodejs.org) installed on your system.
Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It lets you run JavaScript code outside of a browser.
Please visit the official website and download the latest version for your operating system.

### Verifying Installation

After installing Node.js, you can verify by running:

```bash
node --version
npm --version
```

## Setting Up the Development Environment

After forking and cloning the repository, you'll need to set up your development environment.

### Managing Dependencies

You will use npm commands to manage project dependencies. Here's how to effectively use them:

- **`npm install`**: This command installs all the dependencies listed in your `package.json` and is generally used to set up the project after cloning or when manually adding new packages to your development environment. It installs the latest versions that satisfy the version ranges specified in `package.json` and updates `package-lock.json` accordingly.

- **`npm ci`** (Clean Install): Use this command for a clean, predictable installation, especially in continuous integration (CI) environments. It requires a `package-lock.json` file and does not modify the file. It removes the existing `node_modules` folder and reinstalls all dependencies from scratch, based on `package-lock.json`, ensuring that all developers and your deployment environments are using exactly the same dependency tree.

- **`npm update`**: This command updates all packages to the latest version that satisfies the version ranges specified in `package.json` and updates `package-lock.json` to reflect the changes. Use this command to upgrade dependencies deliberately.

### Install Dependencies

For initial setup and when not concerned with exact dependency versions, run the following command to install the project dependencies:

```bash
npm install
```

For a predictable and repeatable setup (recommended for production builds or continuous integration environments), use:

```bash
npm ci
```

These commands will set up your environment with the necessary dependencies to start developing.

## Tools and Libraries Used

Here's a brief overview of the main tools and libraries we use:

- [**Vite**](https://vitejs.dev/guide/): A modern frontend build tool that significantly improves the frontend development experience. It's especially suited for projects using Vue.js.
- [**Vue.js**](https://vuejs.org/v2/guide/): A progressive JavaScript framework for building user interfaces. The core library is focused on the view layer only.
- [**Vue Router**](https://router.vuejs.org/): The official router for Vue.js. It integrates deeply with Vue.js core to make building Single Page Applications with Vue.js a breeze.
- [**Pinia**](https://pinia.vuejs.org/): The Vue Store that you will enjoy using. It serves as the centralized store for all the components in an application.
- [**Vue I18n**](https://vue-i18n.intlify.dev/): Internationalization plugin for Vue.js. It integrates seamlessly into your app.
- [**Tailwind CSS**](https://tailwindcss.com/docs): A utility-first CSS framework for rapidly building custom user interfaces.
- [**Heroicons**](https://heroicons.com/): A set of free, MIT-licensed high-quality SVG icons, optimized for use with web projects. Perfect for enhancing UI/UX with clean and scalable graphics.
- [**ESLint**](https://eslint.org/): A pluggable and configurable linter tool for identifying and reporting on patterns in JavaScript. Maintain your code quality with ease.
- [**Prettier**](https://prettier.io/): An opinionated code formatter. It enforces a consistent style by parsing your code and re-printing it with its own rules that take the maximum line length into account, wrapping code when necessary.
- [**Vitest**](https://vitest.dev/): A Vite-native unit test framework. It's fast, performant, and works out of the box for Vite projects.

## Running/Building the Project

With [Vite](https://vitejs.dev), you can easily start the development server and build the project.
Here are some common commands:

- **Start the development server**:

  ```bash
  npm run dev
  ```

  This command starts a local development server.
  You can view your changes in real-time by visiting the outputted URL in the browser.
  Hot module reloading (HMR) is enabled, so you don't need to refresh the page to see your changes.

- **Build for production**:

  ```bash
  npm run build
  ```

  Use this command to build the project for production.
  The output will be stored in the `dist` directory as a single HTML file.

## Contributing

When you're ready to contribute, please submit a pull request with your changes.
Please ensure your code adheres to the project's coding standards and include any necessary tests to validate your changes.

## Getting Help

If you need help or have questions about contributing, feel free to open an issue.

Thank you for contributing to the Sinim Bible App! 🎉
