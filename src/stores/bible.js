import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import bible from "@/assets/translations/zh/chinese_union_version.json";
import { useStorage } from "@vueuse/core";

export const useBibleStore = defineStore("bible", () => {
    const currentBook = useStorage("currentBook", 1);
    const currentChapter = useStorage("currentChapter", 1);
    const highlights = useStorage("hightlights", {});
    const selectedVerses = ref([]);

    const currentBookName = computed(() => {
        return bible.books[currentBook.value - 1].name;
    });

    const currentChapters = computed(() => {
        return bible.books[currentBook.value - 1].chapters || [];
    });

    const currentVerses = computed(() => {
        return currentChapters.value[currentChapter.value - 1] || [];
    });

    /**
     * @param {number} verse
     * @param {?number} chapter
     * @param {?number} book
     * @returns {string}
     */
    function getVerse(verse, chapter = null, book = null) {
        chapter ??= currentChapter.value;
        book ??= currentBook.value;

        return bible.books[book - 1].chapters[chapter - 1][verse - 1];
    }

    /** @param {number} direction */
    function changeChapter(direction) {
        const newChapter = currentChapter.value + direction;

        if (newChapter >= 1 && newChapter <= currentChapters.value.length) {
            currentChapter.value = newChapter;
        }
    }

    /** @param {number} verse */
    function toggleSelectedVerse(verse) {
        if (selectedVerses.value.includes(verse)) {
            selectedVerses.value = selectedVerses.value.filter(
                (v) => v !== verse,
            );
        } else {
            selectedVerses.value.push(verse);
        }
    }

    /** @param {string} color */
    function highlightSelectedVerses(color) {
        selectedVerses.value.forEach((verse) => {
            highlights.value[currentBook.value] ??= {};
            highlights.value[currentBook.value][currentChapter.value] ??= {};
            highlights.value[currentBook.value][currentChapter.value][verse] =
                color;
        });

        selectedVerses.value = [];
    }

    function removeSelectedVerseHighlights() {
        selectedVerses.value.forEach((verse) => {
            delete highlights.value[currentBook.value]?.[
                currentChapter.value
            ]?.[verse];
        });

        selectedVerses.value = [];
    }

    /**
     * @param {number} verse
     * @returns {string}
     */
    function getVerseHighlight(verse) {
        return (
            highlights.value[currentBook.value]?.[currentChapter.value]?.[
                verse
            ] || ""
        );
    }

    /**
     * @param {number[]} verses
     * @returns {string}
     */
    function formatVerseNumbers(verses) {
        verses.sort((a, b) => a - b);

        return verses
            .reduce((acc, curr, i) => {
                if (i === 0 || curr !== verses[i - 1] + 1) {
                    acc.push([curr]);
                } else {
                    acc[acc.length - 1][1] = curr;
                }
                return acc;
            }, [])
            .map((range) => range.join("–"))
            .join(",");
    }

    function getReferenceString(verses) {
        return (
            currentBookName.value +
            ` ${currentChapter.value}:` +
            formatVerseNumbers(verses)
        );
    }

    /** @returns {string} */
    function getSelectedVerses() {
        return (
            `${getReferenceString(selectedVerses.value)}\n` +
            selectedVerses.value
                .map(
                    (verseNumber, idx) =>
                        (idx > 0 ? `[${verseNumber}] ` : "") +
                        getVerse(verseNumber),
                )
                .join(" ")
        );
    }

    watch([currentBook, currentChapter], () => {
        selectedVerses.value = [];
    });

    return {
        bible,
        currentBook,
        currentBookName,
        currentChapter,
        currentChapters,
        currentVerses,
        getVerse,
        changeChapter,
        highlights,
        selectedVerses,
        toggleSelectedVerse,
        highlightSelectedVerses,
        removeSelectedVerseHighlights,
        getVerseHighlight,
        formatVerseNumbers,
        getSelectedVerses,
    };
});
