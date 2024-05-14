<script setup>
    import { onMounted, onUnmounted } from "vue";
    import HighlightButton from "@/components/HighlightButton.vue";
    import IconButton from "@/components/IconButton.vue";
    import {
        DocumentDuplicateIcon,
        NoSymbolIcon,
        PencilSquareIcon,
        ShareIcon,
    } from "@heroicons/vue/24/outline";
    import { useClipboard, useShare } from "@vueuse/core";
    import { useBibleStore } from "@/stores/bible";
    import { useNavStore } from "@/stores/nav";
    import { useNotesStore } from "@/stores/notes";
    import { useI18n } from "vue-i18n";

    const bibleStore = useBibleStore();
    const navStore = useNavStore();
    const notesStore = useNotesStore();
    const { t } = useI18n();

    const { copy, isSupported: isCopySupported } = useClipboard({
        legacy: true,
    });

    /** @returns {void} */
    function copyVerses() {
        copy(bibleStore.getFormattedVerses());

        bibleStore.clearSelectedVerses();
    }

    const { share, isSupported: isShareSupported } = useShare();

    /** @returns {void} */
    function shareVerses() {
        share({ text: bibleStore.getFormattedVerses() });

        bibleStore.clearSelectedVerses();
    }

    /** @returns {void} */
    function addNote() {
        notesStore.select(
            bibleStore.currentBook,
            bibleStore.currentChapter,
            Math.min(...bibleStore.selectedVerses),
            bibleStore.getReferenceString(bibleStore.selectedVerses),
        );

        notesStore.toggleModal();
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
                :label="t('actions.copy')"
                data-testid="copy-button"
            />
            <IconButton
                :icon="PencilSquareIcon()"
                :action="addNote"
                :label="t('actions.note')"
                data-testid="note-button"
            />
            <IconButton
                :icon="ShareIcon()"
                :action="shareVerses"
                :disabled="!isShareSupported"
                :label="t('actions.share')"
                data-testid="share-button"
            />
        </div>
    </Teleport>
</template>
