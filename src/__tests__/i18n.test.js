import { getNavigatorLanguage } from "@/i18n";

vi.mock("@intlify/unplugin-vue-i18n/messages", () => ({
    default: {
        en: { message: "hello" },
        fr: { message: "bonjour" },
    },
}));

describe("i18n", () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it("should return the first language from navigator.languages", () => {
        vi.stubGlobal("navigator", { languages: ["fr", "en"] });

        expect(getNavigatorLanguage()).toBe("fr");
    });

    it("should return navigator.language if navigator.languages is not defined", () => {
        vi.stubGlobal("navigator", { language: "es" });

        expect(getNavigatorLanguage()).toBe("es");
    });

    it('should return "en" if no navigator languages are defined', () => {
        vi.stubGlobal("navigator", {});

        expect(getNavigatorLanguage()).toBe("en");
    });

    it("should set document.documentElement.lang to the navigator language", async () => {
        const mockLanguages = ["de", "en"];
        vi.stubGlobal("navigator", { languages: mockLanguages });

        await import("@/i18n");
        expect(document.documentElement.lang).toBe("de");
    });

    it("should create an i18n instance with the correct locale", async () => {
        vi.stubGlobal("navigator", { languages: ["it", "en"] });

        const i18n = await import("@/i18n");

        expect(i18n.default.global.locale.value).toBe("it");
        expect(i18n.default.global.fallbackLocale.value).toBe("en");
    });
});
