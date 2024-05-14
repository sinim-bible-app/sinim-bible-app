<script setup>
    import ModalTemplate from "@/components/ModalTemplate.vue";
    import { useNotesStore } from "@/stores/notes";
    import { useI18n } from "vue-i18n";

    const notesStore = useNotesStore();
    const { t } = useI18n();
</script>

<template>
    <ModalTemplate
        :show="notesStore.showModal"
        @toggleModal="notesStore.toggleModal"
    >
        <template #title>
            {{ t("bible.note", { ref: notesStore.selected.note.reference }) }}
        </template>
        <textarea
            class="w-full h-32 p-2 rounded-md dark:bg-gray-500"
            placeholder="Write your notes here..."
            v-model="notesStore.selected.note.content"
            data-testid="note-content"
        ></textarea>
    </ModalTemplate>
</template>
