import { defineStore } from "pinia";
import { useStorageAsync } from "@vueuse/core";

export const useHighlightsStore = defineStore("highlights", () => {
    const highlights = useStorageAsync("hightlights", {});

    /**
     * @param {number} book
     * @param {number} chapter
     * @param {number[]} verses
     * @param {string} color
     */
    function add(book, chapter, verses, color) {
        verses.forEach((verse) => {
            highlights.value[book] ??= {};
            highlights.value[book][chapter] ??= {};
            highlights.value[book][chapter][verse] = color;
        });
    }

    /**
     * @param {number} book
     * @param {number} chapter
     * @param {number[]} verses
     */
    function remove(book, chapter, verses) {
        verses.forEach((verse) => {
            delete highlights.value[book]?.[chapter]?.[verse];
        });
    }

    /**
     * @param {number} book
     * @param {number} chapter
     * @param {number} verse
     * @returns {string}
     */
    function get(book, chapter, verse) {
        return highlights.value[book]?.[chapter]?.[verse] || "";
    }

    return { highlights, add, remove, get };
});
