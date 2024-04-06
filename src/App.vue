<script setup>
    import { RouterLink, RouterView } from "vue-router";
    import DarkMode from "@/components/DarkMode.vue";
    import IconButton from "@/components/IconButton.vue";
    import { useNavStore } from "@/stores/nav";
    import {
        HomeIcon,
        BookOpenIcon,
        InformationCircleIcon,
    } from "@heroicons/vue/24/outline";

    const navStore = useNavStore();
</script>

<template>
    <div
        class="relative flex flex-col h-screen max-w-3xl mx-auto dark:text-gray-50 dark:bg-gray-900"
    >
        <main class="flex-grow">
            <RouterView />
        </main>
        <footer
            class="sticky bottom-0 inset-x-0 bg-gray-100 dark:bg-gray-800 rounded-t-lg"
        >
            <nav
                v-show="navStore.showNav"
                class="flex items-center justify-around pt-1 text-xs"
            >
                <RouterLink :to="{ name: 'home' }" activeClass="text-blue-500">
                    <IconButton label="Home" :icon="HomeIcon()" />
                </RouterLink>
                <RouterLink :to="{ name: 'bible' }" activeClass="text-blue-500">
                    <IconButton label="Bible" :icon="BookOpenIcon()" />
                </RouterLink>
                <RouterLink :to="{ name: 'about' }" activeClass="text-blue-500">
                    <IconButton label="About" :icon="InformationCircleIcon()" />
                </RouterLink>
                <DarkMode />
            </nav>
        </footer>
    </div>
</template>
