<script setup>
    import { useClipboard } from "@vueuse/core";
    import { useBibleStore } from "@/stores/bible";
    import { DocumentDuplicateIcon } from "@heroicons/vue/24/solid";

    const bibleStore = useBibleStore();
    const { copy, isSupported } = useClipboard({ legacy: true });

    function copyVerses() {
        copy(bibleStore.getSelectedVerses());

        bibleStore.selectedVerses = [];
    }
</script>

<template>
    <button
        class="flex flex-col items-center justify-center"
        :disabled="!isSupported"
        :class="{ 'opacity-50 cursor-not-allowed': !isSupported }"
        @click="copyVerses"
    >
        <DocumentDuplicateIcon class="h-6 text-current" />
        Copy
    </button>
</template>
