import "./app.css";
import bibleData from "./assets/translations/zh/chinese_union_version.json";

document.getElementById("app").innerHTML = `
    <div class="text-gray-800 bg-gray-300 p-2" id="toolbar">
        <select id="book-dropdown"></select>
        <button id="prev-button">◄</button>
        <input value="1" class="w-14" type="text" inputmode="numeric" pattern="[0-9]*"
            id="chapter-input" />
        <button id="next-button" justify-content="right">►</button>
        <button>ℹ️</button>
        <button>🖨️</button>
    </div>
    <div id="bible-content" class="flex-grow overflow-y-auto"></div>

    <div id="highlight-toolbar" class="hidden items-center justify-center gap-2 text-center p-2 bg-gray-300 text-gray-800">
        <button class="bg-yellow-200 w-8 h-8 rounded-full border border-white"></button>
        <button class="bg-green-200 w-8 h-8 rounded-full border border-white"></button>
        <button class="bg-blue-200 w-8 h-8 rounded-full border border-white"></button>
        <button class="bg-white w-8 h-8 rounded-full border border-white" data-highlight="bg-transparent"></button>
        <button class="w-10 h-10" data-highlight="bg-transparent" id="notes-button">
            <i>📝</i>
        </button>
    </div>

    <div id="notes-modal" class="hidden fixed inset-0 bg-black/70 z-10 transition-all duration-300">
        <div class="absolute inset-0 bg-white p-5 overflow-y-auto">
            <div class="bg-gray-800 text-white p-2 flex items-center justify-between" id="toolbar">
                <button id="closeNotes">X</button>
                Bible Notes
            </div>
            <!-- Your content goes here -->
            <br>
            I love this verse.
        </div>
    </div>
`;

// Sample Bible data (replace with actual data)
// Initialize your object or class with a default currentChapter value
const myBibleApp = {
    currentChapter: 0, // Initialize to the first chapter or the appropriate default value
    currentBook: 0,
    selectedVerseNumbers: [],
    // Other properties and methods...
};

const bookDropdown = document.getElementById("book-dropdown");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");

// Define a function to be called when the page loads
function onPageLoad() {
    // Check if the parentDict is stored in localStorage
    const storedParentDict = localStorage.getItem("parentDict");

    if (storedParentDict) {
        // Parse the parentDict from JSON
        const parentDict = JSON.parse(storedParentDict);

        // Set the current book and chapter
        myBibleApp.currentBook = parentDict["currentBook"];
        myBibleApp.currentChapter = parentDict["currentChapter"];

        populateBibleText(myBibleApp.currentBook, myBibleApp.currentChapter);

        // Loop through the parentDict to apply highlights to verses
        for (const verseId in parentDict) {
            if (verseId !== "currentBook" && verseId !== "currentChapter") {
                const childDict = parentDict[verseId];
                const verseElement = document.getElementById(verseId);

                if (verseElement && childDict.key === "highlight") {
                    // Apply the highlight color
                    verseElement.classList.add(childDict.value);
                    verseElement.setAttribute(
                        "data-highlight",
                        childDict.value,
                    );
                }
            }
        }
    }

    // Set the current book and chapter dropdowns
    const bookDropdown = document.getElementById("book-dropdown");
    const chapterDropdown = document.getElementById("chapter-input");

    bookDropdown.value = myBibleApp.currentBook;
    chapterDropdown.value = myBibleApp.currentChapter + 1;

    // Call the updateCookies method or any other method you want to run
    updateCookies();
}

// Attach the onPageLoad function to the DOMContentLoaded event
document.addEventListener("DOMContentLoaded", onPageLoad);

// Function to set the currently selected verse
function setSelectedVerse(verseNumber) {
    myBibleApp.selectedVerseNumbers.push(verseNumber);
}

function updateCookies() {
    const book = bibleData.books[myBibleApp.currentBook];
    const chapter = book.chapters[myBibleApp.currentChapter];

    // Get the number of verses in the current chapter
    const numberOfVerses = chapter.length;

    console.log("update cookies");
    console.log("we have " + numberOfVerses + " verses in this chapter");

    // Load the parent dictionary from localStorage if it exists
    const storedParentDict = localStorage.getItem("parentDict");
    const parentDict = storedParentDict ? JSON.parse(storedParentDict) : {};

    // Loop through each verse and get its color by ID
    for (let verseIndex = 0; verseIndex < numberOfVerses; verseIndex++) {
        const verseId = `verseid${myBibleApp.currentBook}-${myBibleApp.currentChapter}-${verseIndex}`;
        const verseElement = document.getElementById(verseId);
        if (verseElement !== null) {
            const highlight = verseElement.getAttribute("data-highlight");
            console.log(verseId + ": " + highlight);
            // Store the highlight color in the parent dictionary
            parentDict[verseId] = { key: "highlight", value: highlight };
        }
    }

    // Store the current book and chapter in the parent dictionary
    parentDict["currentBook"] = myBibleApp.currentBook;
    parentDict["currentChapter"] = myBibleApp.currentChapter;

    // Serialize the parent dictionary to JSON and store it in localStorage
    const serializedParentDict = JSON.stringify(parentDict);
    localStorage.setItem("parentDict", serializedParentDict);

    console.log(parentDict);
}

function removeSpaces(inputString) {
    return inputString.replace(/\s/g, "");
}

// Function to populate the Bible text for a given book and chapter
// force page breaks https://stackoverflow.com/questions/1664049/can-i-force-a-page-break-in-html-printing
function populateBibleText(bookIndex, chapterIndex) {
    const book = bibleData.books[bookIndex];
    const chapter = book.chapters[chapterIndex];
    const bibleVersesDiv = document.getElementById("bible-content");
    const highlightToolbar = document.getElementById("highlight-toolbar");

    if (bibleVersesDiv && highlightToolbar) {
        // Clear any existing content in the bibleVersesDiv
        bibleVersesDiv.innerHTML = "";

        const chapterNumber = document.createElement("span");
        chapterNumber.innerHTML = `${chapterIndex + 1}`;
        chapterNumber.classList.add(
            "text-6xl",
            "leading-8",
            "float-left",
            "font-bold",
            "m-2",
        );
        bibleVersesDiv.appendChild(chapterNumber);

        // Populate the bibleVersesDiv with the verses from the selected chapter
        chapter.forEach((verse, index) => {
            const verseElement = document.createElement("p");

            // Embed book, chapter, and verse data as data attributes
            verseElement.setAttribute("data-book", book.name);
            verseElement.setAttribute("data-chapter", chapterIndex + 1);
            verseElement.setAttribute("data-verse", index + 1);
            verseElement.classList.add("mt-2");
            verseElement.id =
                "verseid" +
                myBibleApp.currentBook +
                "-" +
                myBibleApp.currentChapter +
                "-" +
                index;

            // Add padding to the verse element to increase clickable area
            const trimmedString = removeSpaces(verse);
            if (index > 0) {
                verseElement.innerHTML = `<sup class="mx-1">${index + 1}</sup>`;
            }
            verseElement.innerHTML += trimmedString;

            // Add a click event listener to each verse
            verseElement.addEventListener("click", (event) => {
                // Extract book, chapter, and verse data from data attributes
                const bookName = event.target.getAttribute("data-book");
                const chapterNumber = event.target.getAttribute("data-chapter");
                const verseNumber = event.target.getAttribute("data-verse");

                // Log the book, chapter, and verse data
                console.log(
                    `Book: ${bookName}, Chapter: ${chapterNumber}, Verse: ${verseNumber}`,
                );

                // Add the .highlighted class to the clicked verse
                verseElement.style.textDecoration = "underline";

                // Set the currently selected verse
                setSelectedVerse(verseNumber - 1);

                const highlightToolbar =
                    document.getElementById("highlight-toolbar");
                highlightToolbar.classList.remove("hidden");
                highlightToolbar.classList.add("flex");
            });

            bibleVersesDiv.appendChild(verseElement);
        });
    } else {
        console.error("bibleVerses div or highlight toolbar not found.");
    }
}

// Populate the book dropdown
function populateBookDropdown() {
    bibleData.books.forEach((book, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.text = book.name;
        bookDropdown.appendChild(option);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    document
        .querySelectorAll("#highlight-toolbar > button")
        .forEach((button) => {
            const bgClass = Array.from(button.classList).find((className) =>
                className.startsWith("bg-"),
            );

            if (bgClass && !button.hasAttribute("data-highlight")) {
                button.setAttribute("data-highlight", bgClass);
            }

            button.addEventListener("click", () => {
                const selectedColor = button.getAttribute("data-highlight");

                myBibleApp.selectedVerseNumbers.forEach((verseNumber) => {
                    const element = document.getElementById(
                        `verseid${myBibleApp.currentBook}-${myBibleApp.currentChapter}-${verseNumber}`,
                    );

                    if (element) {
                        const bgClasses = Array.from(element.classList).filter(
                            (className) => className.startsWith("bg-"),
                        );
                        element.classList.remove(...bgClasses);

                        if (selectedColor !== "bg-transparent") {
                            element.classList.add(selectedColor);
                        }

                        element.style.textDecoration = "none";
                        element.setAttribute("data-highlight", selectedColor);
                    }
                });

                const highlightToolbar =
                    document.getElementById("highlight-toolbar");
                highlightToolbar.classList.add("hidden");
                myBibleApp.selectedVerseNumbers = [];

                // You can update cookies or perform other actions here
                updateCookies();
            });
        });
});

// Event listener for previous button
prevButton.addEventListener("click", () => {
    if (myBibleApp.currentChapter > 0) {
        myBibleApp.currentChapter--;
        const chapterTextbox = document.getElementById("chapter-input");
        chapterTextbox.value = myBibleApp.currentChapter + 1;
        // Handle updating the content for the previous chapter here
        // You might want to call a function to load and display the new chapter content
        updateCookies();
        populateBibleText(myBibleApp.currentBook, myBibleApp.currentChapter);
        onPageLoad();
    }
});

// Event listener for next button
nextButton.addEventListener("click", () => {
    const totalChapters =
        bibleData.books[myBibleApp.currentBook].chapters.length;
    if (myBibleApp.currentChapter < totalChapters - 1) {
        myBibleApp.currentChapter++;
        const chapterTextbox = document.getElementById("chapter-input");
        chapterTextbox.value = myBibleApp.currentChapter + 1;
        // Handle updating the content for the next chapter here
        // You might want to call a function to load and display the new chapter content
        updateCookies();
        populateBibleText(myBibleApp.currentBook, myBibleApp.currentChapter);
        onPageLoad();
    }
});

// Add event listener to the dropdown menu
const dropdown = document.getElementById("book-dropdown"); // Replace "book-dropdown" with the ID of your dropdown menu element
dropdown.addEventListener("change", function () {
    const selectedBookIndex = dropdown.selectedIndex;
    myBibleApp.currentBook = dropdown.selectedIndex;
    myBibleApp.currentChapter = 0;
    // Populate the content based on the selected book and chapter
    populateBibleText(selectedBookIndex, myBibleApp.currentChapter);
});

// Initialize the book dropdown
populateBookDropdown();
populateBibleText(myBibleApp.currentBook, myBibleApp.currentChapter);

// Function to request full screen mode
function enterFullScreen() {
    const element = document.documentElement; // Get the root HTML element

    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen(); // For Firefox
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen(); // For Chrome and Safari
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen(); // For Internet Explorer
    }
}

// Call the function to enter full screen when needed, e.g., on a button click
// You might want to trigger it based on user interaction, like a button click
document
    .getElementById("fullscreen-button")
    ?.addEventListener("click", enterFullScreen);

// Add an event listener to the notes button
const notesButton = document.getElementById("notes-button");
if (notesButton) {
    notesButton.addEventListener("click", () => {
        console.log("Notes button clicked"); // Log a message to the console
        const verseNumber = myBibleApp.selectedVerseNumbers[0];
        const selectedVerseId =
            "verseid" +
            myBibleApp.currentBook +
            "-" +
            myBibleApp.currentChapter +
            "-" +
            verseNumber;
        const element = document.getElementById(selectedVerseId);
        if (element) {
            element.style.textDecoration = "none";
        }

        const highlightToolbar = document.getElementById("highlight-toolbar");
        highlightToolbar.classList.add("hidden");
        // Display the modal
        const modal = document.getElementById("notes-modal");
        if (modal) {
            modal.style.display = "block";
        }
    });
}

const notesCloseButton = document.getElementById("closeNotes");
if (notesCloseButton) {
    notesCloseButton.addEventListener("click", () => {
        console.log("close the modal");
        const modal = document.getElementById("notes-modal");
        if (modal) {
            modal.style.display = "none";
        }
    });
}
