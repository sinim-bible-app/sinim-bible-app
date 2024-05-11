import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import BibleChapter from "@/components/BibleChapter.vue";
import BibleVerse from "@/components/BibleVerse.vue";

vi.mock("vue-i18n", () => ({
    useI18n: () => ({
        n: (key) => key,
    }),
}));

describe.concurrent("BibleChapter", () => {
    let wrapper;

    const verses = [
        "In the beginning God created the heaven and the earth.",
        "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
        "And God said, Let there be light: and there was light.",
    ];

    beforeEach(() => {
        wrapper = mount(BibleChapter, {
            props: { chapter: 1, verses },
            global: {
                plugins: [createTestingPinia()],
            },
        });
    });

    it("displays the chapter number correctly", () => {
        const chapterDisplay = wrapper.get('[data-test="chapter-number"]');
        expect(chapterDisplay.text()).toBe("1");
    });

    it("renders the correct number of BibleVerse components", () => {
        const bibleVerseComponents = wrapper.findAllComponents(BibleVerse);
        expect(bibleVerseComponents.length).toBe(verses.length);

        bibleVerseComponents.forEach((component, index) => {
            expect(component.props().verse).toBe(verses[index]);
            expect(component.props().verseNumber).toBe(index + 1);
        });
    });
});
