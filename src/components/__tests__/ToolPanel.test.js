import { vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import ToolPanel from "@/components/ToolPanel.vue";
import HighlightButton from "@/components/HighlightButton.vue";
import IconButton from "@/components/IconButton.vue";
import { useClipboard, useShare } from "@vueuse/core";
import { useBibleStore } from "@/stores/bible";
import { useNavStore } from "@/stores/nav";
import { useNotesStore } from "@/stores/notes";

vi.mock("vue-i18n", () => ({
    useI18n: () => ({
        t: (key) => key,
    }),
}));

vi.mock("@vueuse/core", async (importOriginal) => {
    let _clipboard;
    let _share;
    const actual = await importOriginal();
    return {
        ...actual,
        useClipboard: () => {
            if (!_clipboard) {
                _clipboard = {
                    copy: vi.fn(),
                    isSupported: true,
                };
            }
            return _clipboard;
        },
        useShare: () => {
            if (!_share) {
                _share = {
                    share: vi.fn(),
                    isSupported: true,
                };
            }
            return _share;
        },
    };
});

describe.concurrent("ToolPanel", () => {
    let wrapper;
    let bibleStore;
    let navStore;
    let notesStore;

    beforeEach(async () => {
        const footer = document.createElement("footer");
        document.body.appendChild(footer);

        wrapper = mount(ToolPanel, {
            global: {
                plugins: [
                    createTestingPinia({
                        initialState: {
                            bible: {
                                currentBook: 1,
                                currentChapter: 1,
                                selectedVerses: [1, 3],
                            },
                        },
                    }),
                ],
            },
        });
        bibleStore = useBibleStore();
        navStore = useNavStore();
        notesStore = useNotesStore();

        bibleStore.getFormattedVerses = vi
            .fn()
            .mockReturnValue("Formatted Verses");
    });

    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("should toggle nav visibility on mount and unmount", async () => {
        expect(navStore.showNav).toBe(false);
        await wrapper.unmount();
        expect(navStore.showNav).toBe(true);
    });

    it("renders all highlight buttons", async () => {
        const highlightButtons = wrapper.findAllComponents(HighlightButton);
        expect(highlightButtons.length).toBe(7);
    });

    it("renders all icon buttons", async () => {
        const iconButtons = wrapper.findAllComponents(IconButton);
        expect(iconButtons.length).toBe(3);
    });

    it("copies verses when copy button is clicked", async () => {
        const button = wrapper
            .findAllComponents(IconButton)
            .find(
                (button) =>
                    button.element.getAttribute("data-testid") ===
                    "copy-button",
            );

        await button.trigger("click");
        expect(useClipboard().copy).toHaveBeenCalledWith("Formatted Verses");
        expect(bibleStore.clearSelectedVerses).toHaveBeenCalled();
    });

    it("shares verses when share button is clicked", async () => {
        const button = wrapper
            .findAllComponents(IconButton)
            .find(
                (button) =>
                    button.element.getAttribute("data-testid") ===
                    "share-button",
            );

        await button.trigger("click");
        expect(useShare().share).toHaveBeenCalledWith({
            text: "Formatted Verses",
        });
        expect(bibleStore.clearSelectedVerses).toHaveBeenCalled();
    });

    it("adds note when note button is clicked", async () => {
        const button = wrapper
            .findAllComponents(IconButton)
            .find(
                (button) =>
                    button.element.getAttribute("data-testid") ===
                    "note-button",
            );

        await button.trigger("click");
        expect(notesStore.select).toHaveBeenCalled();
        expect(notesStore.toggleModal).toHaveBeenCalled();
        expect(bibleStore.clearSelectedVerses).toHaveBeenCalled();
    });
});
