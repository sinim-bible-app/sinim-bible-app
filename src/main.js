import './app.css';
import bibleData from './assets/translations/zh/chinese_union_version.json';

// Sample Bible data (replace with actual data)
// Initialize your object or class with a default currentChapter value
const myBibleApp = {
    currentChapter: 0, // Initialize to the first chapter or the appropriate default value
    currentBook: 0,
    selectedVerseNumbers: []
    // Other properties and methods...
};

const bookDropdown = document.getElementById("book-dropdown");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const bibleContent = document.getElementById("bible-content");
// Define a global variable to store the currently selected verse numbers
let selectedVerseNumbers = [];

// Define a function to be called when the page loads
function onPageLoad() {
    // Check if the parentDict is stored in localStorage
    const storedParentDict = localStorage.getItem('parentDict');

    if (storedParentDict) {
        // Parse the parentDict from JSON
        const parentDict = JSON.parse(storedParentDict);

        // Set the current book and chapter
        myBibleApp.currentBook = parentDict["currentBook"];
        myBibleApp.currentChapter = parentDict["currentChapter"];

        // Loop through the parentDict to apply highlights to verses
        for (const verseId in parentDict) {
            if (verseId !== "currentBook" && verseId !== "currentChapter") {
                const childDict = parentDict[verseId];
                const verseElement = document.getElementById(verseId);

                if (verseElement && childDict.key === "highlight") {
                    // Apply the highlight color
                    verseElement.classList.add(childDict.value);
                    verseElement.setAttribute('data-highlight', childDict.value);
                }
            }
        }
    }

    // Set the current book and chapter dropdowns
    const bookDropdown = document.getElementById('book-dropdown');
    const chapterDropdown = document.getElementById('chapter-input');

    bookDropdown.value = myBibleApp.currentBook;
    chapterDropdown.value = myBibleApp.currentChapter + 1;

    // Call the updateCookies method or any other method you want to run
    updateCookies();
}

// Attach the onPageLoad function to the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', onPageLoad);

// Function to handle color selection and apply it to the selected verse
function selectColor(color) {
    if (myBibleApp.selectedVerseNumbers !== null) {
        myBibleApp.selectedVerseNumbers.forEach((verseNumber) => {
            const selectedVerse = document.querySelector(`[data-verse="${verseNumber}"]`);
            if (selectedVerse) {
                selectedVerse.style.backgroundColor = color;
            }
        });
    }

    // Hide the toolbar
    const highlightToolbar = document.getElementById("highlight-toolbar");
    if (highlightToolbar) {
        highlightToolbar.style.display = "none"; // Use style.display to hide the toolbar
    }
}

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
    const storedParentDict = localStorage.getItem('parentDict');
    const parentDict = storedParentDict ? JSON.parse(storedParentDict) : {};

    // Loop through each verse and get its color by ID
    for (let verseIndex = 0; verseIndex < numberOfVerses; verseIndex++) {
        const verseId = `verseid${myBibleApp.currentBook}-${myBibleApp.currentChapter}-${verseIndex}`;
        const verseElement = document.getElementById(verseId);
        if (verseElement !== null) {
            const highlight = verseElement.getAttribute('data-highlight');
            console.log(verseId + ": " + highlight);
            // Store the highlight color in the parent dictionary
            parentDict[verseId] = { key: 'highlight', value: highlight };
        }
    }

    // Store the current book and chapter in the parent dictionary
    parentDict["currentBook"] = myBibleApp.currentBook;
    parentDict["currentChapter"] = myBibleApp.currentChapter;

    // Serialize the parent dictionary to JSON and store it in localStorage
    const serializedParentDict = JSON.stringify(parentDict);
    localStorage.setItem('parentDict', serializedParentDict);

    console.log(parentDict);
}

// Function to retrieve the color name from the mapping
function getColorNameFromMap(colorValue, colorMap) {
    for (const key in colorMap) {
        if (colorMap.hasOwnProperty(key) && colorMap[key] === colorValue) {
            return key; // Return the color name if a match is found
        }
    }
    return colorValue; // Return the original value if not found in the mapping
}


function removeSpaces(inputString) {
    return inputString.replace(/\s/g, '');
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

        // Populate the bibleVersesDiv with the verses from the selected chapter
        chapter.forEach((verse, index) => {
            const verseElement = document.createElement("span"); // Create a <span> element for each verse

            // Embed book, chapter, and verse data as data attributes
            verseElement.setAttribute("data-book", book.name);
            verseElement.setAttribute("data-chapter", chapterIndex + 1);
            verseElement.setAttribute("data-verse", index + 1);
            verseElement.id = "verseid" + myBibleApp.currentBook + "-" + myBibleApp.currentChapter + "-" + index

            // Add padding to the verse element to increase clickable area
            const trimmedString = removeSpaces(verse);
            verseElement.innerHTML = `<sup>${index + 1}</sup> ${trimmedString}`;


            // Add a click event listener to each verse
            verseElement.addEventListener("click", (event) => {
                // Extract book, chapter, and verse data from data attributes
                const bookName = event.target.getAttribute("data-book");
                const chapterNumber = event.target.getAttribute("data-chapter");
                const verseNumber = event.target.getAttribute("data-verse");

                // Log the book, chapter, and verse data
                console.log(`Book: ${bookName}, Chapter: ${chapterNumber}, Verse: ${verseNumber}`);

                // Add the .highlighted class to the clicked verse
                verseElement.style.textDecoration = "underline";

                // Set the currently selected verse
                setSelectedVerse(verseNumber - 1);

                // Show the toolbar
                const highlightToolbar = document.getElementById("highlight-toolbar");
                highlightToolbar.style.display = "block";
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

// Get the number of chapters for a book
function getNumberOfChaptersForBook(bookNumber) {
    if (bookNumber >= 0 && bookNumber < bibleData.length) {
        return bibleData[bookNumber].chapters.length;
    }
    return 0;
}

// Get the number of verses for a chapter
function getNumberOfVersesFor(bookNumber, chapterNumber) {
    if (bookNumber >= 0 && bookNumber < bibleData.length && chapterNumber >= 0 && chapterNumber < bibleData[bookNumber].chapters.length) {
        return bibleData[bookNumber].chapters[chapterNumber].verses;
    }
    return 0;
}

// Get a specific verse
function getVerse(bookNumber, chapterNumber, verseNumber) {
    if (bookNumber >= 0 && bookNumber < bibleData.length && chapterNumber >= 0 && chapterNumber < bibleData[bookNumber].chapters.length && verseNumber >= 0 && verseNumber < bibleData[bookNumber].chapters[chapterNumber].verses) {
        const book = bibleData[bookNumber].name;
        const chapter = chapterNumber + 1;
        const verse = verseNumber + 1;
        return `${book} ${chapter}:${verse} - Sample verse text`; // Replace with actual verse data
    }
    return "Verse not found";
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".highlight-button").forEach(button => {
        const bgClass = Array.from(button.classList).find(className => className.startsWith('bg-'));

        if (bgClass && ! button.hasAttribute('data-highlight')) {
            button.setAttribute('data-highlight', bgClass);
        }

        button.addEventListener("click", () => {
            const selectedColor = button.getAttribute("data-highlight");

            myBibleApp.selectedVerseNumbers.forEach((verseNumber) => {
                const element = document.getElementById(
                    `verseid${myBibleApp.currentBook}-${myBibleApp.currentChapter}-${verseNumber}`,
                );

                if (element) {
                    const bgClasses = Array.from(element.classList).filter(className => className.startsWith('bg-'));
                    element.classList.remove(...bgClasses);

                    if (selectedColor !== "bg-transparent") {
                        element.classList.add(selectedColor);
                    }

                    element.style.textDecoration = "none";
                    element.setAttribute('data-highlight', selectedColor);
                }
            });

            // Hide the highlight toolbar
            const highlightToolbar = document.getElementById("highlight-toolbar");
            highlightToolbar.style.display = "none";
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
        const chapterTextbox = document.getElementById('chapter-input');
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
    const totalChapters = bibleData.books[myBibleApp.currentBook].chapters.length
    if (myBibleApp.currentChapter < totalChapters - 1) {
        myBibleApp.currentChapter++;
        const chapterTextbox = document.getElementById('chapter-input');
        chapterTextbox.value = myBibleApp.currentChapter + 1;
        // Handle updating the content for the next chapter here
        // You might want to call a function to load and display the new chapter content
        updateCookies();
        populateBibleText(myBibleApp.currentBook, myBibleApp.currentChapter);
        onPageLoad();
    }
});

// Function to update the input field with the current chapter value
function updateChapterInput() {
    const chapterInput = document.getElementById("chapter-input");
    if (chapterInput) {
        chapterInput.value = String(myBibleApp.currentChapter + 1);
    }
}

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
document.getElementById("fullscreen-button").addEventListener("click", enterFullScreen);

// Add an event listener to the notes button
const notesButton = document.getElementById("notes-button");
if (notesButton) {
    notesButton.addEventListener("click", () => {
        console.log("Notes button clicked"); // Log a message to the console
        const verseNumber = myBibleApp.selectedVerseNumbers[0];
        const selectedVerseId = "verseid" + myBibleApp.currentBook + "-" + myBibleApp.currentChapter + "-" + verseNumber;
        const element = document.getElementById(selectedVerseId);
        if (element) {
            element.style.textDecoration = "none";
        }

        // Add your modal display logic here
        const highlightToolbar = document.getElementById("highlight-toolbar")
        highlightToolbar.style.display = "none";
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
        console.log("close the modal")
        const modal = document.getElementById("notes-modal");
        if (modal) {
            modal.style.display = "none";
        }
    })
}
