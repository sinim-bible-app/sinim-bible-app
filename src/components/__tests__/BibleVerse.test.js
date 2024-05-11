import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import BibleVerse from "@/components/BibleVerse.vue";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/vue/24/outline";
import { useBibleStore } from "@/stores/bible";
import { useNotesStore } from "@/stores/notes";

vi.mock("vue-i18n", () => ({
    useI18n: () => ({
        n: (key) => key,
    }),
}));

describe("BibleVerse", () => {
    let wrapper;
    let bibleStore;
    let notesStore;
    const highlight = "bg-green-500";
    const verse = "And God said, Let there be light: and there was light.";
    const verseNumber = 3;

    beforeEach(() => {
        wrapper = mount(BibleVerse, {
            props: { verse, verseNumber },
            global: {
                plugins: [
                    createTestingPinia({
                        initialState: {
                            bible: {
                                currentBook: 1,
                                currentChapter: 1,
                            },
                            notes: {
                                notes: {
                                    1: {
                                        1: {
                                            3: {
                                                content: "Test note",
                                                reference: "Genesis 1:3",
                                            },
                                        },
                                    },
                                },
                            },
                            highlights: {
                                highlights: {
                                    1: { 1: { 3: highlight } },
                                },
                            },
                        },
                        stubActions: false,
                    }),
                ],
            },
        });
        bibleStore = useBibleStore();
        notesStore = useNotesStore();
    });

    it("conditionally renders the verse number", async () => {
        const number = wrapper.get('[data-test="verse-number"]');
        expect(number.text()).toBe(verseNumber.toString());

        await wrapper.setProps({ verseNumber: 1 });
        expect(wrapper.find('[data-test="verse-number"]').exists()).toBe(false);
    });

    it("toggles selected verse on click", async () => {
        const verse = wrapper.find('[data-test="verse-content"]');
        let classes = verse.classes();
        expect(classes).not.toContain("bg-gray-300");

        await wrapper.trigger("click");
        classes = verse.classes();
        expect(classes).not.toContain(highlight);
        expect(classes).toContain("bg-gray-300");
    });

    it("conditionally renders note icon", async () => {
        const noteIcon = wrapper.find("svg.text-blue-700");
        expect(noteIcon.exists()).toBe(true);

        await wrapper.setProps({ verseNumber: 1 });
        expect(noteIcon.exists()).toBe(true);
    });

    it("selects a note when the note icon is clicked", async () => {
        const noteIcon = wrapper.findComponent(ChatBubbleBottomCenterTextIcon);
        await noteIcon.trigger("click");
        expect(notesStore.select).toHaveBeenCalled();
        expect(notesStore.toggleModal).toHaveBeenCalled();
        expect(bibleStore.toggleSelectedVerse).not.toHaveBeenCalled();
    });

    it("applies correct user highlight", () => {
        const classes = wrapper.find('[data-test="verse-content"]').classes();
        expect(classes).toContain(highlight);
    });
});
