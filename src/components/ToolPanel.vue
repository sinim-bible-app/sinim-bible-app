<script setup>
    import HighlightButton from "@/components/HighlightButton.vue";
    import { NoSymbolIcon } from "@heroicons/vue/24/solid";
</script>

<template>
    <div
        class="flex items-center justify-center gap-2 text-center p-2 bg-gray-100 dark:bg-gray-800"
    >
        <HighlightButton>
            <NoSymbolIcon />
        </HighlightButton>
        <HighlightButton color="bg-yellow-200 dark:bg-yellow-600" />
        <HighlightButton color="bg-green-200 dark:bg-green-700" />
        <HighlightButton color="bg-blue-200 dark:bg-blue-700" />
        <button class="w-10 h-10">
            <i>📝</i>
        </button>
    </div>
</template>
