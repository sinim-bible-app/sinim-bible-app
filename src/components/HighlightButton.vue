<script setup>
    import { useBibleStore } from "@/stores/bible";
    import { useHighlightsStore } from "@/stores/highlights";

    const props = defineProps({
        color: String,
    });

    const bibleStore = useBibleStore();
    const highlightsStore = useHighlightsStore();

    function action() {
        if (props.color) {
            highlightsStore.add(
                bibleStore.currentBook,
                bibleStore.currentChapter,
                bibleStore.selectedVerses,
                props.color,
            );
        } else {
            highlightsStore.remove(
                bibleStore.currentBook,
                bibleStore.currentChapter,
                bibleStore.selectedVerses,
            );
        }

        bibleStore.clearSelectedVerses();
    }
</script>

<template>
    <button :class="[color, 'w-8 h-8 rounded-full']" @click="action()">
        <slot />
    </button>
</template>
