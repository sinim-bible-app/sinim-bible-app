import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import bible from "@/assets/translations/zh/chinese_union_version.json";

export const useBibleStore = defineStore("bible", () => {
    const currentBook = ref(1);
    const currentChapter = ref(1);

    const currentChapters = computed(() => {
        return bible.books[currentBook.value - 1].chapters || [];
    });

    const currentVerses = computed(() => {
        return currentChapters.value[currentChapter.value - 1] || [];
    });

    function changeChapter(direction) {
        const newChapter = currentChapter.value + direction;

        if (newChapter >= 1 && newChapter <= currentChapters.value.length) {
            currentChapter.value = newChapter;
        }
    }

    watch([currentBook, currentChapter], () => {
        // This function can be used to perform side effects whenever the current book or chapter changes.
        // For example, saving the current selection to localStorage or performing API calls.
    });

    return {
        bible,
        currentBook,
        currentChapter,
        currentChapters,
        currentVerses,
        changeChapter,
    };
});
