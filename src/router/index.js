import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import BibleView from "@/views/BibleView.vue";
import SearchView from "@/views/SearchView.vue";

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        { path: "/", name: "home", component: HomeView },
        { path: "/bible", name: "bible", component: BibleView },
        { path: "/search", name: "search", component: SearchView },
        {
            path: "/about",
            name: "about",
            component: () => import("@/views/AboutView.vue"),
        },
    ],
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || { top: 0 };
    },
});

export default router;
