<script setup>
    import { useBibleStore } from "@/stores/bible";

    const props = defineProps({
        color: String,
    });

    const bibleStore = useBibleStore();

    function action() {
        if (props.color) {
            bibleStore.highlightSelectedVerses(props.color);
        }

        bibleStore.removeSelectedVerseHighlights();
    }
</script>

<template>
    <button :class="[color, 'w-8 h-8 rounded-full']" @click="action()">
        <slot />
    </button>
</template>
