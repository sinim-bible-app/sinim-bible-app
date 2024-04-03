<script setup>
    import BibleChapter from "@/components/BibleChapter.vue";
    import { useBibleStore } from "@/stores/bible";

    const bibleStore = useBibleStore();
</script>

<template>
    <div>
        <div class="text-gray-800 bg-gray-300 p-2">
            <select v-model.number="bibleStore.currentBook">
                <option
                    v-for="(book, index) in bibleStore.bible.books"
                    :key="index + 1"
                    :value="index + 1"
                >
                    {{ book.name }}
                </option>
            </select>
            <button @click="bibleStore.changeChapter(-1)">◄</button>
            <select v-model.number="bibleStore.currentChapter">
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

        <div
            id="highlight-toolbar"
            class="hidden items-center justify-center gap-2 text-center p-2 bg-gray-300 text-gray-800"
        >
            <button
                class="bg-yellow-200 w-8 h-8 rounded-full border border-white"
            ></button>
            <button
                class="bg-green-200 w-8 h-8 rounded-full border border-white"
            ></button>
            <button
                class="bg-blue-200 w-8 h-8 rounded-full border border-white"
            ></button>
            <button
                class="bg-white w-8 h-8 rounded-full border border-white"
                data-highlight="bg-transparent"
            ></button>
            <button class="w-10 h-10" data-highlight="bg-transparent">
                <i>📝</i>
            </button>
        </div>

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
