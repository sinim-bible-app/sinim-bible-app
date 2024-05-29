<script setup>
    import { computed } from "vue";
    import { useBibleStore } from "@/stores/bible";
    import { useHighlightsStore } from "@/stores/highlights";
    import { useNotesStore } from "@/stores/notes";
    import { ChatBubbleBottomCenterTextIcon } from "@heroicons/vue/24/outline";
    import { useI18n } from "vue-i18n";

    const props = defineProps({
        verse: String,
        verseNumber: Number,
    });

    const { n } = useI18n();
    const bibleStore = useBibleStore();
    const highlightsStore = useHighlightsStore();
    const notesStore = useNotesStore();

    const isSelected = computed(() =>
        bibleStore.selectedVerses.includes(props.verseNumber),
    );

    const hasNote = computed(() =>
        notesStore.has(
            bibleStore.currentBook,
            bibleStore.currentChapter,
            props.verseNumber,
        ),
    );

    /** @return {void} */
    function setNote() {
        notesStore.select(
            bibleStore.currentBook,
            bibleStore.currentChapter,
            props.verseNumber,
        );

        notesStore.toggleModal();
    }

    const classes = computed(() => [
        !isSelected.value
            ? highlightsStore.get(
                  bibleStore.currentBook,
                  bibleStore.currentChapter,
                  props.verseNumber,
              )
            : "bg-gray-300 dark:bg-gray-700",
        "ml-1",
    ]);
</script>

<template>
    <div @click="bibleStore.toggleSelectedVerse(verseNumber)">
        <sup
            v-if="verseNumber > 1"
            class="mr-1 text-red-700 dark:text-red-500"
            data-testid="verse-number"
        >
            {{ n(verseNumber) }}
        </sup>
        <ChatBubbleBottomCenterTextIcon
            v-if="hasNote"
            class="inline h-4 mx-1 text-blue-700 dark:text-blue-500"
            @click.stop="setNote"
        />
        <span :class="classes" data-testid="verse-content">
            {{ verse }}
        </span>
    </div>
</template>
