import { beforeEach, describe, it, expect } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useNavStore } from "@/stores/nav";

describe("Nav Store", () => {
    let store;

    beforeEach(() => {
        setActivePinia(createPinia());
        store = useNavStore();
    });

    it("toggles nav", () => {
        store.showNav = true;
        store.toggleNav();
        expect(store.showNav).toBe(false);
    });
});
