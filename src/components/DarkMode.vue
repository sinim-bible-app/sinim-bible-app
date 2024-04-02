<script setup>
    import { useDark, useToggle } from "@vueuse/core";
    import { MoonIcon, SunIcon } from "@heroicons/vue/24/solid";

    const isDark = useDark();
    const toggleDark = useToggle(isDark);
</script>

<template>
    <button @click="toggleDark()">
        <SunIcon v-if="isDark" class="h-6 text-yellow-500" />
        <MoonIcon v-else class="h-6 text-gray-500" />
    </button>
</template>
