import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import bible from "@/assets/translations/zh/chinese_union_version.json";
import { useStorage } from "@vueuse/core";

export const useBibleStore = defineStore("bible", () => {
    const currentBook = useStorage("currentBook", 1);
    const currentChapter = useStorage("currentChapter", 1);
    const highlights = useStorage("hightlights", {});
    const selectedVerses = ref([]);

    const currentChapters = computed(() => {
        return bible.books[currentBook.value - 1].chapters || [];
    });

    const currentVerses = computed(() => {
        return currentChapters.value[currentChapter.value - 1] || [];
    });

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
            highlights.value[currentBook][currentChapter][verse] = color;
        });
    }

    function removeSelectedVerseHighlights() {
        selectedVerses.value.forEach((verse) => {
            delete highlights.value[currentBook][currentChapter][verse];
        });
    }

    /** @param {number} verse */
    function getVerseHighlight(verse) {
        return (
            highlights.value[currentBook.value]?.[currentChapter.value]?.[
                verse
            ] || ""
        );
    }

    watch([currentBook, currentChapter], () => {
        selectedVerses.value = [];
    });

    return {
        bible,
        currentBook,
        currentChapter,
        currentChapters,
        currentVerses,
        changeChapter,
        highlights,
        selectedVerses,
        toggleSelectedVerse,
        highlightSelectedVerses,
        removeSelectedVerseHighlights,
        getVerseHighlight,
    };
});
