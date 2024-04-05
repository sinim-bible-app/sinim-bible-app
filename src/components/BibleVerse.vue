<script setup>
    import { computed } from "vue";
    import { useBibleStore } from "@/stores/bible";

    const props = defineProps(["verseNumber", "verse"]);
    const bibleStore = useBibleStore();

    const isSelected = computed(() =>
        bibleStore.selectedVerses.includes(props.verseNumber),
    );

    const classes = computed(() => [
        !isSelected.value
            ? bibleStore.getVerseHighlight(props.verseNumber)
            : "bg-gray-300 dark:bg-gray-700",
    ]);
</script>

<template>
    <div @click="bibleStore.toggleSelectedVerse(verseNumber)">
        <sup v-if="verseNumber > 1" class="mr-2 text-red-700 dark:text-red-500">
            {{ verseNumber }}
        </sup>
        <span :class="classes">
            {{ verse.trim() }}
        </span>
    </div>
</template>
