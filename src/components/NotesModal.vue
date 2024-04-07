<script setup>
    import ModalTemplate from "@/components/ModalTemplate.vue";
    import { useNotesStore } from "@/stores/notes";

    const notesStore = useNotesStore();
</script>

<template>
    <ModalTemplate
        :show="notesStore.showModal"
        @toggleModal="notesStore.toggleModal"
    >
        <template #title>
            Note on {{ notesStore.selected.note.reference }}
        </template>
        <textarea
            class="w-full h-32 p-2 rounded-md dark:bg-gray-500"
            placeholder="Write your notes here..."
            v-model="notesStore.selected.note.content"
        ></textarea>
    </ModalTemplate>
</template>
