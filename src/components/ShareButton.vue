<script setup>
    import { useShare } from "@vueuse/core";
    import { useBibleStore } from "@/stores/bible";
    import { ShareIcon } from "@heroicons/vue/24/solid";

    const bibleStore = useBibleStore();
    const { share } = useShare();

    function shareVerses() {
        share({ text: bibleStore.getSelectedVerses() });

        bibleStore.selectedVerses = [];
    }
</script>

<template>
    <button
        class="flex flex-col items-center justify-center"
        @click="shareVerses"
    >
        <ShareIcon class="h-6 text-current" />
        Share
    </button>
</template>
