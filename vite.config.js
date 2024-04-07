import { resolve, dirname } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import vue from "@vitejs/plugin-vue";
import VueDevTools from "vite-plugin-vue-devtools";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        viteSingleFile(),
        vue(),
        VueDevTools(),
        VueI18nPlugin({
            include: resolve(
                dirname(fileURLToPath(import.meta.url)),
                "./src/locales/**",
            ),
        }),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
});
