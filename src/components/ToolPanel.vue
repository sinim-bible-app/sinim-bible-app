<script setup>
    import HighlightButton from "@/components/HighlightButton.vue";
    import CopyButton from "@/components/CopyButton.vue";
    import { NoSymbolIcon } from "@heroicons/vue/24/solid";
</script>

<template>
    <div
        class="sticky bottom-0 inset-x-0 z-10 gap-2 p-2 bg-gray-100 dark:bg-gray-800"
    >
        <div class="flex items-center justify-center gap-2 text-center p-2">
            <HighlightButton>
                <NoSymbolIcon class="scale-125" />
            </HighlightButton>
            <HighlightButton color="bg-yellow-200 dark:bg-yellow-600" />
            <HighlightButton color="bg-green-200 dark:bg-green-700" />
            <HighlightButton color="bg-blue-200 dark:bg-blue-700" />
            <HighlightButton color="bg-purple-200 dark:bg-purple-700" />
            <HighlightButton color="bg-pink-200 dark:bg-pink-700" />
            <HighlightButton color="bg-orange-200 dark:bg-orange-700" />
        </div>
        <div class="flex items-center justify-center gap-2 text-center p-2">
            <CopyButton />
        </div>
    </div>
</template>
