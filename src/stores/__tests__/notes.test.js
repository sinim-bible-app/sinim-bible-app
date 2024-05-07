import { beforeEach, describe, it, expect } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useNotesStore } from "../notes";
import { nextTick } from "vue";

describe("Notes Store", () => {
    let store;

    beforeEach(() => {
        setActivePinia(createPinia());
        store = useNotesStore();
    });

    it("adds a note and checks its existence", () => {
        expect(store.has(1, 1, 1)).toBe(false);
        store.add(1, 1, 1, {
            content: "Test note.",
            reference: "Genesis 1:1-3",
        });
        expect(store.has(1, 1, 1)).toBe(true);
    });

    it("gets a note correctly", () => {
        store.add(1, 1, 1, {
            content: "Test note.",
            reference: "Genesis 1:1-3",
        });
        const note = store.get(1, 1, 1);
        expect(note).toEqual({
            content: "Test note.",
            reference: "Genesis 1:1-3",
        });
    });

    it("removes a note correctly", () => {
        store.add(1, 1, 1, {
            content: "Test note.",
            reference: "Genesis 1:1-3",
        });
        expect(store.has(1, 1, 1)).toBe(true);
        store.remove(1, 1, 1);
        expect(store.has(1, 1, 1)).toBe(false);
    });

    it("populates a new note", () => {
        expect(store.selected.book).toBeNull();
        expect(store.selected.chapter).toBeNull();
        expect(store.selected.verse).toBeNull();
        expect(store.has(1, 1, 1)).toBe(false);

        store.select(1, 1, 1, "Genesis 1:1-3");

        expect(store.selected.book).toBe(1);
        expect(store.selected.chapter).toBe(1);
        expect(store.selected.verse).toBe(1);
        expect(store.selected.note).toEqual({
            content: "",
            reference: "Genesis 1:1-3",
        });
    });

    it("selects saved note", () => {
        store.add(1, 1, 1, {
            content: "Test note.",
            reference: "Genesis 1:1-3",
        });

        store.select(1, 1, 1);

        expect(store.selected.book).toBe(1);
        expect(store.selected.chapter).toBe(1);
        expect(store.selected.verse).toBe(1);
        expect(store.selected.note).toEqual({
            content: "Test note.",
            reference: "Genesis 1:1-3",
        });
    });

    it("toggles the modal visibility", () => {
        store.showModal = false;
        store.toggleModal();
        expect(store.showModal).toBe(true);
        store.toggleModal();
        expect(store.showModal).toBe(false);
    });

    it("adds/removes note when content becomes non-empty/empty", async () => {
        store.select(1, 1, 2, "Romans 1:1-3");
        await nextTick();
        expect(store.has(1, 1, 2)).toBe(false);

        store.selected.note.content = "New content";
        await nextTick();
        expect(store.has(1, 1, 2)).toBe(true);

        store.selected.note.content = "";
        await nextTick();
        expect(store.has(1, 1, 2)).toBe(false);
    });

    it("does not remove a note when selecting a different note", async () => {
        store.add(1, 1, 2, {
            content: "Test note.",
            reference: "Genesis 1:1-3",
        });

        store.select(1, 1, 2);
        await nextTick();
        expect(store.has(1, 1, 2)).toBe(true);

        store.select(1, 1, 3, "Romans 1:1-3");
        await nextTick();

        expect(store.has(1, 1, 2)).toBe(true);
        expect(store.selected.note.content).toBe("");
    });
});
