import { createI18n } from "vue-i18n";
import messages from "@intlify/unplugin-vue-i18n/messages";

// https://stackoverflow.com/a/52112155
const getNavigatorLanguage = () => {
    if (navigator.languages && navigator.languages.length) {
        return navigator.languages[0];
    } else {
        return (
            navigator.userLanguage ||
            navigator.language ||
            navigator.browserLanguage ||
            "en"
        );
    }
};

const locale = getNavigatorLanguage();

document.documentElement.lang = locale;

const i18n = createI18n({
    legacy: false,
    allowComposition: true,
    locale,
    fallbackLocale: "en",
    messages,
    missingWarn: false,
    fallbackWarn: false,
});

export default i18n;
