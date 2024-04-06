<script setup>
    import { computed } from "vue";
    import { useBibleStore } from "@/stores/bible";
    import { useHighlightsStore } from "@/stores/highlights";

    const props = defineProps({
        verse: String,
        verseNumber: Number,
    });

    const bibleStore = useBibleStore();
    const highlightsStore = useHighlightsStore();

    const isSelected = computed(() =>
        bibleStore.selectedVerses.includes(props.verseNumber),
    );

    const classes = computed(() => [
        !isSelected.value
            ? highlightsStore.get(
                  bibleStore.currentBook,
                  bibleStore.currentChapter,
                  props.verseNumber,
              )
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
