import { nextTick } from "vue";
import { mount } from "@vue/test-utils";
import ModalTemplate from "@/components/ModalTemplate.vue";

/**
 * @param {boolean} show
 * @param {Record<string, import("vue").VNode>} slots
 * @returns {import("@vue/test-utils").VueWrapper}
 */
function createModalTemplate(show, slots = {}) {
    return mount(ModalTemplate, {
        attachTo: document.body,
        props: { show },
        slots,
        global: {
            stubs: { teleport: true },
        },
    });
}

describe.concurrent("ModalTemplate", () => {
    let wrapper;

    it("does not render the modal when show is false", async () => {
        wrapper = createModalTemplate(false);
        expect(wrapper.find('[data-testid="modal"]').exists()).toBe(false);
    });

    it("renders the modal when show is true", async () => {
        wrapper = createModalTemplate(true);
        expect(wrapper.find('[data-testid="modal"]').exists()).toBe(true);
    });

    it("emits toggleModal when the close button is clicked", async () => {
        wrapper = createModalTemplate(true);
        await wrapper.find("#modal-close").trigger("click");
        expect(wrapper.emitted("toggleModal")).toBeTruthy();
    });

    it("emits toggleModal when clicking outside the modal content", async () => {
        wrapper = createModalTemplate(true);
        await wrapper
            .find('[data-testid="modal-container"]')
            .trigger("click.self");
        expect(wrapper.emitted("toggleModal")).toBeTruthy();
    });

    it("emits toggleModal when pressing the Esc key", async () => {
        wrapper = createModalTemplate(true);
        await wrapper
            .find('[data-testid="modal-content"]')
            .trigger("keyup.esc");
        expect(wrapper.emitted("toggleModal")).toBeTruthy();
    });

    it("focuses the close button when the modal is shown", async () => {
        wrapper = createModalTemplate(false);
        await wrapper.setProps({ show: true });
        await nextTick();
        expect(document.activeElement.id).toBe("modal-close");

        await wrapper.setProps({ show: false });
        expect(document.activeElement.id).toBe("");
    });

    it("renders slots", async () => {
        wrapper = createModalTemplate(true, {
            default: "<div data-testid='slot'>Slot</div>",
            title: "<div data-testid='title'>Title</div>",
            footer: "<div data-testid='footer'>Footer</div>",
        });

        const slot = wrapper.find('[data-testid="slot"]');
        const title = wrapper.find('[data-testid="title"]');
        const footer = wrapper.find('[data-testid="footer"]');

        expect(slot.exists()).toBe(true);
        expect(title.exists()).toBe(true);
        expect(footer.exists()).toBe(true);
        expect(slot.text()).toBe("Slot");
        expect(title.text()).toBe("Title");
        expect(footer.text()).toBe("Footer");
    });

    it("does not render footer if missing", async () => {
        wrapper = createModalTemplate(true, {
            default: "<div data-testid='slot'>Slot</div>",
            title: "<div data-testid='title'>Title</div>",
        });
        expect(wrapper.find('[data-testid="modal-footer"]').exists()).toBe(
            false,
        );
    });
});
