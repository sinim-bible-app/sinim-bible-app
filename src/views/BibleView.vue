<script setup>
    import BibleChapter from "@/components/BibleChapter.vue";
    import ToolPanel from "@/components/ToolPanel.vue";
    import NotesModal from "@/components/NotesModal.vue";
    import { useBibleStore } from "@/stores/bible";
    import { useI18n } from "vue-i18n";

    const bibleStore = useBibleStore();
    const { t, n } = useI18n();
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
                    {{ t("bible.chapter", { n: n(i) }) }}
                </option>
            </select>
            <button @click="bibleStore.changeChapter(1)">►</button>
        </div>
        <BibleChapter
            :chapter="bibleStore.currentChapter"
            :verses="bibleStore.currentVerses"
        />
        <ToolPanel v-if="bibleStore.selectedVerses.length" />
        <NotesModal />
    </div>
</template>
