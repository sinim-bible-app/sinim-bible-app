import { mount } from "@vue/test-utils";
import DarkMode from "@/components/DarkMode.vue";

describe("DarkMode", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(DarkMode);
    });

    it("should toggle icons and dark class when the button is clicked", async () => {
        expect(wrapper.find("svg.text-gray-500").exists()).toBe(true);
        expect(wrapper.find("svg.text-yellow-500").exists()).toBe(false);
        expect(document.documentElement.classList.contains("dark")).toBe(false);

        await wrapper.find("button").trigger("click");

        expect(wrapper.find("svg.text-gray-500").exists()).toBe(false);
        expect(wrapper.find("svg.text-yellow-500").exists()).toBe(true);
        expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
});
