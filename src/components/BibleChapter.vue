<script setup>
    import BibleVerse from "@/components/BibleVerse.vue";
    defineProps(["chapter", "verses"]);
</script>

<template>
    <div class="flex-grow overflow-y-auto">
        <span class="text-6xl leading-8 float-left fond-bold m-2">
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
