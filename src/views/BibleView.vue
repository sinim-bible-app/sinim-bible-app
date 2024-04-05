<script setup>
    import BibleChapter from "@/components/BibleChapter.vue";
    import ToolPanel from "@/components/ToolPanel.vue";
    import { useBibleStore } from "@/stores/bible";

    const bibleStore = useBibleStore();
</script>

<template>
    <div>
        <div class="bg-gray-100 dark:bg-gray-800 p-2">
            <select
                v-model.number="bibleStore.currentBook"
                class="bg-gray-200 dark:bg-gray-700"
            >
                <option
                    v-for="(book, index) in bibleStore.bible.books"
                    :key="index + 1"
                    :value="index + 1"
                >
                    {{ book.name }}
                </option>
            </select>
            <button @click="bibleStore.changeChapter(-1)">◄</button>
            <select
                v-model.number="bibleStore.currentChapter"
                class="bg-gray-200 dark:bg-gray-700"
            >
                <option
                    v-for="i in bibleStore.currentChapters.length"
                    :key="i"
                    :value="i"
                >
                    Chapter {{ i }}
                </option>
            </select>
            <button @click="bibleStore.changeChapter(1)">►</button>
        </div>
        <BibleChapter
            :chapter="bibleStore.currentChapter"
            :verses="bibleStore.currentVerses"
        />
        <ToolPanel v-if="bibleStore.selectedVerses.length" />

        <div
            id="notes-modal"
            class="hidden fixed inset-0 bg-black/70 z-10 transition-all duration-300"
        >
            <div class="absolute inset-0 bg-white p-5 overflow-y-auto">
                <div
                    class="bg-gray-800 text-white p-2 flex items-center justify-between"
                    id="toolbar"
                >
                    <button id="closeNotes">X</button>
                    Bible Notes
                </div>
                <!-- Your content goes here -->
                <br />
                I love this verse.
            </div>
        </div>
    </div>
</template>
