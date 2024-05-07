import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import bible from "@/assets/translations/zh/chinese_union_version.json";
import { useStorageAsync } from "@vueuse/core";
import { useI18n } from "vue-i18n";

export const useBibleStore = defineStore("bible", () => {
    const { t, n } = useI18n();
    const currentBook = useStorageAsync("currentBook", 1);
    const currentChapter = useStorageAsync("currentChapter", 1);
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

    /**
     * @param {number} direction
     * @returns {void}
     */
    function changeChapter(direction) {
        let newChapter = currentChapter.value + direction;
        let chapterCount = currentChapters.value.length;

        while (newChapter < 1 || newChapter > chapterCount) {
            if (newChapter < 1 && currentBook.value > 1) {
                currentBook.value -= 1;
                chapterCount = currentChapters.value.length;
                newChapter += chapterCount;
            } else if (
                newChapter > chapterCount &&
                currentBook.value < bible.books.length
            ) {
                currentBook.value += 1;
                newChapter -= chapterCount;
                chapterCount = currentChapters.value.length;
            } else {
                newChapter = newChapter < 1 ? 1 : chapterCount;
                break;
            }
        }

        currentChapter.value = newChapter;
    }

    /**
     * @param {number} verse
     * @returns {void}
     */
    function toggleSelectedVerse(verse) {
        if (!selectedVerses.value.includes(verse)) {
            selectedVerses.value.push(verse);
            return;
        }

        selectedVerses.value = selectedVerses.value.filter((v) => v !== verse);
    }

    /** @returns {void} */
    function clearSelectedVerses() {
        selectedVerses.value = [];
    }

    /**
     * This formats an array of verse numbers into ranges separated by commas.
     * For example, [1, 2, 3, 5, 7, 8] would return "1-3,5,7-8".
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
            .map((range) => range.map((v) => n(v)))
            .map((range) => {
                if (range.length === 1) {
                    return range[0];
                }

                return t("bible.references.verse_range", {
                    start: range[0],
                    end: range[1],
                });
            })
            .join(",");
    }

    /** @returns {string} */
    function getReferenceString(verses) {
        return t("bible.references.full", {
            book: currentBookName.value,
            chapter: currentChapter.value,
            verse: formatVerseNumbers(verses),
        });
    }

    /** @returns {string} */
    function getFormattedVerses() {
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

    watch([currentBook, currentChapter], (newValues, oldValues) => {
        selectedVerses.value = [];

        // Reset chapter if book has changed and current chapter is out of bounds
        if (
            newValues[0] !== oldValues[0] &&
            currentChapter.value > currentChapters.value.length
        ) {
            currentChapter.value = 1;
        }
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
        selectedVerses,
        toggleSelectedVerse,
        clearSelectedVerses,
        formatVerseNumbers,
        getReferenceString,
        getFormattedVerses,
    };
});
