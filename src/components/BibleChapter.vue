<script setup>
    import BibleVerse from "@/components/BibleVerse.vue";
    import { useI18n } from "vue-i18n";

    defineProps({
        chapter: Number,
        verses: Array,
    });

    const { n } = useI18n();
</script>

<template>
    <div class="flex-grow overflow-y-auto p-3">
        <span
            class="text-6xl leading-8 float-left fond-bold m-2 mb-3"
            data-test="chapter-number"
        >
            {{ n(chapter) }}
        </span>
        <BibleVerse
            v-for="(verse, index) in verses"
            :key="index"
            :verse
            :verseNumber="index + 1"
        />
    </div>
</template>
