<script setup>
    import { ref, onMounted, onUnmounted } from "vue";
    import HighlightButton from "@/components/HighlightButton.vue";
    import IconButton from "@/components/IconButton.vue";
    import ModalTemplate from "@/components/ModalTemplate.vue";
    import {
        DocumentDuplicateIcon,
        NoSymbolIcon,
        PencilSquareIcon,
        ShareIcon,
    } from "@heroicons/vue/24/outline";
    import { useClipboard, useShare } from "@vueuse/core";
    import { useBibleStore } from "@/stores/bible";
    import { useNavStore } from "@/stores/nav";

    const bibleStore = useBibleStore();
    const navStore = useNavStore();

    const showNoteModal = ref(false);

    function toggleNoteModal() {
        showNoteModal.value = !showNoteModal.value;
    }

    const { copy, isSupported: isCopySupported } = useClipboard({
        legacy: true,
    });

    function copyVerses() {
        copy(bibleStore.getFormattedVerses());

        bibleStore.clearSelectedVerses();
    }

    const { share, isSupported: isShareSupported } = useShare();

    function shareVerses() {
        share({ text: bibleStore.getFormattedVerses() });

        bibleStore.clearSelectedVerses();
    }

    onMounted(() => {
        navStore.showNav = false;
    });

    onUnmounted(() => {
        navStore.showNav = true;
    });
</script>

<template>
    <Teleport to="footer">
        <div class="flex items-center justify-center gap-2 text-center p-2">
            <HighlightButton>
                <NoSymbolIcon class="scale-125" />
            </HighlightButton>
            <HighlightButton color="bg-yellow-200 dark:bg-yellow-600" />
            <HighlightButton color="bg-green-200 dark:bg-green-700" />
            <HighlightButton color="bg-blue-200 dark:bg-blue-700" />
            <HighlightButton color="bg-purple-200 dark:bg-purple-700" />
            <HighlightButton color="bg-pink-200 dark:bg-pink-700" />
            <HighlightButton color="bg-orange-200 dark:bg-orange-700" />
        </div>
        <div class="flex items-center justify-center gap-4 text-center p-2">
            <IconButton
                :icon="DocumentDuplicateIcon()"
                :action="copyVerses"
                :disabled="!isCopySupported"
                label="Copy"
            />
            <IconButton
                :icon="PencilSquareIcon()"
                :action="toggleNoteModal"
                label="Notes"
            />
            <IconButton
                :icon="ShareIcon()"
                :action="shareVerses"
                :disabled="!isShareSupported"
                label="Share"
            />
            <ModalTemplate
                :show="showNoteModal"
                @toggleModal="toggleNoteModal"
            />
        </div>
    </Teleport>
</template>
