import { beforeEach, describe, it, expect, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { nextTick } from "vue";
import { useBibleStore } from "@/stores/bible";

vi.mock("vue-i18n", () => {
    const useI18n = () => ({
        t: vi.fn((key, value) => {
            if (key === "bible.references.verse_range") {
                return `${value.start}-${value.end}`;
            }

            if (key === "bible.references.full") {
                return `${value.book} ${value.chapter}:${value.verse}`;
            }

            return `${key} ${JSON.stringify(value)}`;
        }),
        n: vi.fn((value) => value.toString()),
    });
    return { useI18n };
});

vi.mock("@/assets/translations/zh/chinese_union_version.json", () => ({
    default: {
        books: [
            {
                name: "Genesis",
                chapters: [
                    [
                        "In the beginning God created the heaven and the earth.",
                        "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
                        "And God said, Let there be light: and there was light.",
                    ],
                    [
                        "Thus the heavens and the earth were finished, and all the host of them.",
                        "And on the seventh day God ended his work which he had made; and he rested on the seventh day from all his work which he had made.",
                    ],
                ],
            },
            {
                name: "Exodus",
                chapters: [
                    [
                        "Now these are the names of the children of Israel, which came into Egypt;",
                    ],
                    ["And Moses stretched out his hand over the sea;"],
                ],
            },
            {
                name: "Psalms",
                chapters: [
                    [
                        "Blessed is the man that walketh not in the counsel of the ungodly, nor standeth in the way of sinners, nor sitteth in the seat of the scornful.",
                        "But his delight is in the law of the LORD; and in his law doth he meditate day and night.",
                    ],
                    [
                        "The LORD is my shepherd; I shall not want.",
                        "He maketh me to lie down in green pastures; he leadeth me beside the still waters.",
                    ],
                    [
                        "God is our refuge and strength, a very present help in trouble.",
                        "Therefore will not we fear, though the earth be removed, and though the mountains be carried into the midst of the sea.",
                    ],
                ],
            },
        ],
    },
}));

describe("Bible Store", () => {
    let store;

    beforeEach(() => {
        setActivePinia(createPinia());
        store = useBibleStore();
    });

    it("returns an empty array if the specified book/chapter does not exist", () => {
        store.currentBook = null;
        expect(store.currentChapters).toEqual([]);

        store.currentBook = 1;
        store.currentChapter = 10;
        expect(store.currentVerses).toEqual([]);
    });

    it.each([
        [1, 1, 1, "In the beginning God created the heaven and the earth."],
        [1, 1, 3, "And God said, Let there be light: and there was light."],
        [1, 1, 4, undefined],
        [3, 2, 1, "The LORD is my shepherd; I shall not want."],
        [2, 3, 1, undefined],
    ])(
        "gets verse correctly for book %i, chapter %i, verse %i",
        (book, chapter, verse, expected) => {
            expect(store.getVerse(verse, chapter, book)).toBe(expected);
        },
    );

    it.each([
        [1, 1, 1, 1, 2], // Normal chapter increment within Genesis
        [1, 1, -1, 1, 1], // Trying to decrement chapters below the first chapter of Genesis, stays at 1
        [1, 2, 1, 2, 1], // Attempt to go beyond the last chapter of Genesis, should move to first chapter of Exodus
        [2, 1, 1, 2, 2], // Normal chapter increment within Exodus
        [2, 2, -2, 1, 2], // Large decrement going back to the last chapter of Genesis
        [3, 1, -1, 2, 2], // Decrement from first chapter of Psalms to the last chapter of Exodus
        [3, 3, 1, 3, 3], // Attempt to increment beyond the last chapter of Psalms, should stay at last
        [1, 1, 10, 3, 3], // Large increment spanning multiple books from Genesis, ends in Psalms
    ])(
        "changes chapter from initialBook %i and initialChapter %i with direction %i expecting finalBook %i and finalChapter %i",
        (
            initialBook,
            initialChapter,
            direction,
            expectedBook,
            expectedChapter,
        ) => {
            store.currentBook = initialBook; // Set the initial book
            store.currentChapter = initialChapter; // Set the initial chapter
            store.changeChapter(direction); // Apply the direction change
            expect(store.currentBook).toBe(expectedBook);
            expect(store.currentChapter).toBe(expectedChapter);
        },
    );

    it.each([
        [[1, 2, 3, 5, 7, 8], "1-3,5,7-8"],
        [[1, 2, 2, 3, 5], "1-3,5"], // Duplicate verse
        [[], ""], // No verses
        [[10, 20, 30], "10,20,30"], // Non-consecutive verses
        [[10], "10"], // Single verse
    ])('formats verse numbers %s into string "%s"', (input, expected) => {
        expect(store.formatVerseNumbers(input)).toBe(expected);
    });

    it.each([
        [[1], "Genesis 1:1"],
        [[1, 2], "Genesis 1:1-2"],
        [[1, 2, 5], "Genesis 1:1-2,5"],
    ])("generates reference string from verses %s", (verses, expected) => {
        store.currentBook = 1; // Genesis
        store.currentChapter = 1;
        expect(store.getReferenceString(verses)).toBe(expected);
    });

    it("toggles verse selection correctly", () => {
        store.toggleSelectedVerse(1);
        expect(store.selectedVerses.includes(1)).toBe(true);
        store.toggleSelectedVerse(1);
        expect(store.selectedVerses.includes(1)).toBe(false);
    });

    it("does not toggle invalid verse selections", () => {
        store.toggleSelectedVerse(0);
        store.toggleSelectedVerse(100);
        expect(store.selectedVerses.length).toBe(0);
    });

    it("clears all selected verses", () => {
        store.toggleSelectedVerse(1);
        store.toggleSelectedVerse(2);
        store.clearSelectedVerses();
        expect(store.selectedVerses.length).toBe(0);
    });

    it("generates formatted text output from selected verses", () => {
        store.currentBook = 1; // Genesis
        store.currentChapter = 1;
        store.selectedVerses = [1, 2];
        const formattedText = store.getFormattedVerses();
        expect(formattedText).toBe(
            "Genesis 1:1-2\nIn the beginning God created the heaven and the earth. [2] And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
        );
    });

    it("clears selected verses when the book/chapter changes", async () => {
        store.toggleSelectedVerse(1);
        store.toggleSelectedVerse(2);
        expect(store.selectedVerses.length).toBe(2);

        store.changeChapter(1);

        await nextTick();
        expect(store.selectedVerses.length).toBe(0);

        store.toggleSelectedVerse(1);
        store.toggleSelectedVerse(2);
        expect(store.selectedVerses.length).toBe(2);

        store.currentBook = 2;

        await nextTick();
        expect(store.selectedVerses.length).toBe(0);
    });

    it("resets an out of bounds chapter if the book changes", async () => {
        store.currentBook = 3;
        store.currentChapter = 3;
        await nextTick();

        store.currentBook = 1;

        await nextTick();
        expect(store.currentChapter).toBe(1);
    });
});
