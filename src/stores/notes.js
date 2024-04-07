import { ref, watch } from "vue";
import { defineStore } from "pinia";
import { useStorageAsync } from "@vueuse/core";

/**
 * @typedef {Object} Note
 * @property {string} content
 * @property {string} reference
 */

export const useNotesStore = defineStore("notes", () => {
    const notes = useStorageAsync("notes", {});
    const showModal = ref(false);
    const selected = ref({
        book: null,
        chapter: null,
        verse: null,
        note: { content: "", reference: "" },
    });

    /**
     * @param {number} book
     * @param {number} chapter
     * @param {number} verse
     * @param {Note} note
     */
    function add(book, chapter, verse, note) {
        notes.value[book] ??= {};
        notes.value[book][chapter] ??= {};
        notes.value[book][chapter][verse] = note;
    }

    /**
     * @param {number} book
     * @param {number} chapter
     * @param {number} verse
     * @returns {boolean}
     */
    function has(book, chapter, verse) {
        return notes.value[book]?.[chapter]?.[verse] !== undefined;
    }

    /**
     * @param {number} book
     * @param {number} chapter
     * @param {number} verse
     * @returns {void}
     */
    function remove(book, chapter, verse) {
        delete notes.value[book]?.[chapter]?.[verse];
    }

    /**
     * @param {number} book
     * @param {number} chapter
     * @param {number} verse
     * @returns {?Note}
     */
    function get(book, chapter, verse) {
        return notes.value[book]?.[chapter]?.[verse] || null;
    }

    /**
     * @param {number} book
     * @param {number} chapter
     * @param {number} verse
     * @param {string} reference
     * @returns {void}
     */
    function select(book, chapter, verse, reference = "") {
        selected.value.book = book;
        selected.value.chapter = chapter;
        selected.value.verse = verse;
        selected.value.note = get(book, chapter, verse) ?? {
            content: "",
            reference: reference,
        };
    }

    /** @returns {void} */
    function toggleModal() {
        showModal.value = !showModal.value;
    }

    watch(
        () => [selected.value.note.content, selected.value.note.reference],
        (newValue, oldValue) => {
            // Return early if different note selected
            if (oldValue[1] !== newValue[1]) {
                return;
            }

            // Remove note if becomes empty
            if (newValue[0] === "" && oldValue[0] !== "") {
                remove(
                    selected.value.book,
                    selected.value.chapter,
                    selected.value.verse,
                );

                return;
            }

            // Add note if becomes non-empty
            if (oldValue[0] === "" && newValue[0] !== "") {
                add(
                    selected.value.book,
                    selected.value.chapter,
                    selected.value.verse,
                    selected.value.note,
                );
            }
        },
    );

    return {
        notes,
        showModal,
        selected,
        add,
        has,
        remove,
        get,
        select,
        toggleModal,
    };
});
