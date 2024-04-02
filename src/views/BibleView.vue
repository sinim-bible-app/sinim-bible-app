<script setup>
    import { ref, computed, watch, inject } from "vue";
    import BibleChapter from "@/components/BibleChapter.vue";

    const bibleData = inject("bibleData");

    const currentBook = ref(0);
    const currentChapter = ref(1);

    const currentChapters = computed(() => {
        return bibleData.books[currentBook.value].chapters || [];
    });

    const currentVerses = computed(() => {
        return currentChapters.value[currentChapter.value - 1] || [];
    });

    function changeChapter(direction) {
        const newChapter = currentChapter.value + direction;

        if (newChapter >= 1 && newChapter <= currentChapters.value.length) {
            currentChapter.value = newChapter;
        }
    }

    watch([currentBook, currentChapter], () => {
        // This function can be used to perform side effects whenever the current book or chapter changes.
        // For example, saving the current selection to localStorage or performing API calls.
    });

    function populateVerses() {
        // Logic to handle verse population or other necessary setup when the book or chapter changes
    }
</script>

<template>
    <div>
        <div class="text-gray-800 bg-gray-300 p-2">
            <select v-model.number="currentBook" @change="populateVerses">
                <option
                    v-for="(book, index) in bibleData.books"
                    :key="index"
                    :value="index"
                >
                    {{ book.name }}
                </option>
            </select>
            <button @click="changeChapter(-1)">◄</button>
            <select v-model.number="currentChapter">
                <option v-for="i in currentChapters.length" :key="i" :value="i">
                    Chapter {{ i }}
                </option>
            </select>
            <button @click="changeChapter(1)">►</button>
        </div>
        <BibleChapter :chapter="currentChapter" :verses="currentVerses" />

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
