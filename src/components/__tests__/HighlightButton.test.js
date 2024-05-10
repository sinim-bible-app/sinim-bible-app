import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import HighlightButton from "@/components/HighlightButton.vue";
import { useBibleStore } from "@/stores/bible";
import { useHighlightsStore } from "@/stores/highlights";

vi.mock("vue-i18n", () => ({ useI18n: () => ({}) }));

describe("HighlightButton", () => {
    let wrapper;
    let bibleStore;
    let highlightsStore;
    const color = "bg-green-500";
    const slotContent = "<span>Test Content</span>";

    beforeEach(() => {
        wrapper = mount(HighlightButton, {
            props: { color },
            slots: { default: slotContent },
            global: {
                plugins: [
                    createTestingPinia({
                        initialState: {
                            bible: {
                                currentBook: 1,
                                currentChapter: 1,
                                selectedVerses: [1, 2],
                            },
                        },
                    }),
                ],
            },
        });
        bibleStore = useBibleStore();
        highlightsStore = useHighlightsStore();
    });

    it("renders slot content correctly", () => {
        expect(wrapper.html()).toContain(slotContent);
    });

    it("calls add on highlightsStore with color", async () => {
        await wrapper.find("button").trigger("click");
        expect(highlightsStore.add).toHaveBeenCalledWith(1, 1, [1, 2], color);
        expect(highlightsStore.remove).not.toHaveBeenCalled();
        expect(bibleStore.clearSelectedVerses).toHaveBeenCalled();
    });

    it("calls remove on highlightsStore without color", async () => {
        await wrapper.setProps({ color: "" });
        await wrapper.find("button").trigger("click");
        expect(highlightsStore.remove).toHaveBeenCalledWith(1, 1, [1, 2]);
        expect(highlightsStore.add).not.toHaveBeenCalled();
        expect(bibleStore.clearSelectedVerses).toHaveBeenCalled();
    });

    it("adds color class to button", () => {
        expect(wrapper.find("button").classes()).toContain(color);
    });
});
