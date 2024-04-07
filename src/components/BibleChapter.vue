<script setup>
    import BibleVerse from "@/components/BibleVerse.vue";
    defineProps({
        chapter: Number,
        verses: Array,
    });
</script>

<template>
    <div class="flex-grow overflow-y-auto p-3">
        <span class="text-6xl leading-8 float-left fond-bold m-2 mb-3">
            {{ chapter }}
        </span>
        <BibleVerse
            v-for="(verse, index) in verses"
            :key="index"
            :verse
            :verseNumber="index + 1"
        />
    </div>
</template>
