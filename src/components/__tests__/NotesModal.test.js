import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import NotesModal from "@/components/NotesModal.vue";
import ModalTemplate from "@/components/ModalTemplate.vue";
import { useNotesStore } from "@/stores/notes";

vi.mock("vue-i18n", () => ({
    useI18n: () => ({
        t: vi.fn((key, value) => {
            return `${key} ${JSON.stringify(value)}`;
        }),
    }),
}));

describe.concurrent("ModalTemplate", () => {
    let wrapper;
    let notesStore;
    const content = "Note content.";
    const reference = "John 3:16";

    beforeEach(() => {
        wrapper = mount(NotesModal, {
            attachTo: document.body,
            global: {
                plugins: [
                    createTestingPinia({
                        initialState: {
                            notes: {
                                selected: { note: { content, reference } },
                                showModal: true,
                            },
                        },
                    }),
                ],
                stubs: { teleport: true },
            },
        });

        notesStore = useNotesStore();
    });

    it("conditionally renders the modal", async () => {
        const modal = wrapper.findComponent(ModalTemplate);

        notesStore.showModal = true;
        await wrapper.vm.$nextTick();
        expect(modal.props("show")).toBe(true);

        notesStore.showModal = false;
        await wrapper.vm.$nextTick();
        expect(modal.props("show")).toBe(false);
    });

    it("renders the correct title with reference", async () => {
        notesStore.showModal = true;
        await wrapper.vm.$nextTick();
        const titleSlot = wrapper
            .findComponent(ModalTemplate)
            .find("#modal-title");
        expect(titleSlot.text()).toBe('bible.note {"ref":"John 3:16"}');
    });

    it("binds editor to note content", async () => {
        const editor = wrapper.find('[data-testid="note-content"]');
        expect(editor.element.value).toBe(content);

        await editor.setValue("Updated note content");
        expect(notesStore.selected.note.content).toBe("Updated note content");
    });

    it("toggles the modal when toggleModal event is emitted", async () => {
        expect(notesStore.toggleModal).not.toHaveBeenCalled();
        await wrapper.findComponent(ModalTemplate).vm.$emit("toggleModal");
        expect(notesStore.toggleModal).toHaveBeenCalled();
    });
});
