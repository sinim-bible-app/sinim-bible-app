import "@/app.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import messages from "@intlify/unplugin-vue-i18n/messages";

import App from "@/App.vue";
import router from "@/router";

import favicon from "@/assets/favicon.png";

const faviconLink = document.createElement("link");
faviconLink.rel = "icon";
faviconLink.href = favicon;
document.head.appendChild(faviconLink);

const i18n = createI18n({
    legacy: false,
    allowComposition: true,
    // locale: "en",
    locale: "zh",
    fallbackLocale: "en",
    messages,
});

createApp(App).use(createPinia()).use(router).use(i18n).mount("#app");
