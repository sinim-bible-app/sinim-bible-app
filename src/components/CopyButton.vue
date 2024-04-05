<script setup>
    import { useClipboard } from "@vueuse/core";
    import { useBibleStore } from "@/stores/bible";
    import { DocumentDuplicateIcon } from "@heroicons/vue/24/solid";

    const bibleStore = useBibleStore();
    const { copy } = useClipboard({ legacy: true });

    function copyVerses() {
        const text =
            bibleStore.currentBookName +
            ` ${bibleStore.currentChapter}:` +
            `${bibleStore.formatVerseNumbers(bibleStore.selectedVerses)}\n` +
            bibleStore.selectedVerses
                .map(
                    (verseNumber, idx) =>
                        (idx > 0 ? `[${verseNumber}] ` : "") +
                        bibleStore.getVerse(verseNumber),
                )
                .join(" ");

        copy(text);

        bibleStore.selectedVerses = [];
    }
</script>

<template>
    <button
        class="flex flex-col items-center justify-center"
        @click="copyVerses"
    >
        <DocumentDuplicateIcon class="h-6 text-current" />
        Copy
    </button>
</template>
