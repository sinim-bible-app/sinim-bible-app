import { markRaw } from "vue";
import { mount } from "@vue/test-utils";
import IconButton from "@/components/IconButton.vue";

describe.concurrent("IconButton", () => {
    let wrapper;
    const iconStub = markRaw({ template: "<span>Icon</span>" });

    function createWrapper(props = {}) {
        return mount(IconButton, {
            props,
        });
    }

    it("renders the icon and label correctly", () => {
        wrapper = createWrapper({
            label: "Click Me",
            icon: iconStub,
        });

        expect(wrapper.findComponent(iconStub).exists()).toBe(true);
        expect(wrapper.text()).toContain("Click Me");
    });

    it("handles the disabled state correctly", async () => {
        const actionSpy = vi.fn();

        wrapper = createWrapper({
            label: "Disabled Button",
            icon: iconStub,
            action: actionSpy,
            disabled: true,
        });

        expect(wrapper.attributes("disabled")).toBe("");
        expect(wrapper.classes()).toContain("opacity-50");
        expect(wrapper.classes()).toContain("cursor-not-allowed");

        await wrapper.trigger("click");
        expect(actionSpy).not.toHaveBeenCalled();
    });

    it("calls the action function when clicked", async () => {
        const actionSpy = vi.fn();

        wrapper = createWrapper({
            label: "Active Button",
            icon: iconStub,
            action: actionSpy,
            disabled: false,
        });

        expect(wrapper.classes()).not.toContain("opacity-50");
        expect(wrapper.classes()).not.toContain("cursor-not-allowed");

        await wrapper.trigger("click");
        expect(actionSpy).toHaveBeenCalledTimes(1);
    });
});
