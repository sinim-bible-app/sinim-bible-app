<script setup>
    import { RouterLink, RouterView } from "vue-router";
    import DarkMode from "@/components/DarkMode.vue";
    import {
        HomeIcon,
        BookOpenIcon,
        InformationCircleIcon,
    } from "@heroicons/vue/24/outline";
</script>

<template>
    <div
        class="relative flex flex-col h-screen max-w-3xl mx-auto dark:text-gray-50 dark:bg-gray-900"
    >
        <div class="flex-grow">
            <RouterView />
        </div>
        <footer class="sticky bottom-0 inset-x-0 bg-gray-100 dark:bg-gray-800">
            <nav class="flex items-center justify-around pt-1">
                <RouterLink
                    :to="{ name: 'home' }"
                    class="flex flex-col xitems-center xjustify-center"
                    activeClass="text-blue-500"
                >
                    <HomeIcon class="h-6 text-current" />
                    Home
                </RouterLink>
                <RouterLink
                    :to="{ name: 'bible' }"
                    class="flex flex-col items-center justify-center"
                    activeClass="text-blue-500"
                >
                    <BookOpenIcon class="h-6 text-current" />
                    Bible
                </RouterLink>
                <RouterLink
                    :to="{ name: 'about' }"
                    class="flex flex-col items-center justify-center"
                    activeClass="text-blue-500"
                >
                    <InformationCircleIcon class="h-6 text-current" />
                    About
                </RouterLink>
                <DarkMode />
            </nav>
        </footer>
    </div>
</template>
