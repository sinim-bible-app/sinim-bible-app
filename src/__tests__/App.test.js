import { nextTick } from "vue";
import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { RouterLink, RouterView } from "vue-router";
import App from "@/App.vue";
import DarkMode from "@/components/DarkMode.vue";
import i18n from "@/i18n";
import router from "@/router";
import { useNavStore } from "@/stores/nav";

vi.mock("@intlify/unplugin-vue-i18n/messages", () => ({
    default: {
        en: {
            app: { title: "App Title" },
            nav: { home: "Home", bible: "Bible", about: "About" },
        },
    },
}));

describe.concurrent("App", () => {
    let wrapper;
    let navStore;

    beforeEach(() => {
        wrapper = mount(App, {
            attachTo: document.body,
            global: {
                plugins: [
                    createTestingPinia({
                        stubActions: false,
                    }),
                    i18n,
                    router,
                ],
            },
        });

        navStore = useNavStore();
    });

    it("updates the document title based on the translation", async () => {
        await nextTick();
        expect(document.title).toBe("App Title");
    });

    it("renders the main content area with RouterView", () => {
        const routerView = wrapper.findComponent(RouterView);
        expect(routerView.exists()).toBe(true);
    });

    it("conditionally renders the nav in the footer", async () => {
        const nav = wrapper.find("nav");

        navStore.showNav = true;
        await nextTick();
        expect(nav.isVisible()).toBe(true);

        navStore.showNav = false;
        await nextTick();
        expect(nav.isVisible()).toBe(false);
    });

    it("renders navigation links correctly", async () => {
        const links = wrapper.findAllComponents(RouterLink);
        expect(links.length).toBe(3);

        const labels = links.map((link) => link.text());
        expect(labels).toContain("Home");
        expect(labels).toContain("Bible");
        expect(labels).toContain("About");
    });

    it("renders the DarkMode component in the footer", async () => {
        const darkModeComponent = wrapper.findComponent(DarkMode);
        expect(darkModeComponent.exists()).toBe(true);
    });
});
