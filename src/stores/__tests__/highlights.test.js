import { setActivePinia, createPinia } from "pinia";
import { useHighlightsStore } from "@/stores/highlights";

describe("Highlights Store", () => {
    let store;

    beforeEach(() => {
        setActivePinia(createPinia());
        store = useHighlightsStore();
    });

    it("adds highlights correctly and retrieves them", () => {
        store.add(1, 1, [1, 2], "red");
        expect(store.get(1, 1, 1)).toBe("red");
        expect(store.get(1, 1, 2)).toBe("red");
        expect(store.get(1, 1, 3)).toBe("");
    });

    it("removes specific verses from highlights", () => {
        store.add(1, 1, [1, 2, 3], "blue");
        expect(store.get(1, 1, 2)).toBe("blue");
        store.remove(1, 1, [2]);
        expect(store.get(1, 1, 1)).toBe("blue");
        expect(store.get(1, 1, 2)).toBe("");
        expect(store.get(1, 1, 3)).toBe("blue");
    });

    it("handles multiple chapters and books", () => {
        store.add(1, 1, [1], "yellow");
        store.add(1, 2, [1], "green");
        store.add(2, 1, [1], "purple");

        expect(store.get(1, 1, 1)).toBe("yellow");
        expect(store.get(1, 2, 1)).toBe("green");
        expect(store.get(2, 1, 1)).toBe("purple");
    });

    it("clears highlights correctly", () => {
        store.add(1, 1, [1, 2], "orange");
        store.remove(1, 1, [1, 2]);
        expect(store.get(1, 1, 1)).toBe("");
        expect(store.get(1, 1, 2)).toBe("");
    });

    it("does not affect other chapters when removing verses", () => {
        store.add(1, 1, [1, 2], "pink");
        store.add(1, 2, [1, 2], "pink");
        store.remove(1, 1, [1]);
        expect(store.get(1, 1, 1)).toBe("");
        expect(store.get(1, 1, 2)).toBe("pink");
        expect(store.get(1, 2, 1)).toBe("pink");
    });
});
