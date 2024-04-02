import "@/app.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "@/App.vue";
import router from "@/router";

import bibleData from "@/assets/translations/zh/chinese_union_version.json";

import favicon from "@/assets/favicon.png";

const faviconLink = document.createElement("link");
faviconLink.rel = "icon";
faviconLink.href = favicon;
document.head.appendChild(faviconLink);

createApp(App)
    .use(createPinia())
    .use(router)
    .provide("bibleData", bibleData)
    .mount("#app");
