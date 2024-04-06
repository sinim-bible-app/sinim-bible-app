<script setup>
    import { defineEmits, watch, nextTick } from "vue";
    import { XMarkIcon } from "@heroicons/vue/24/solid";

    const props = defineProps({
        show: Boolean,
    });

    const emits = defineEmits(["toggleModal"]);

    function toggle() {
        emits("toggleModal");
    }

    watch(
        () => props.show,
        (show) => {
            if (!show) return;

            nextTick(() => {
                document.querySelector("#modal-close")?.focus();
            });
        },
    );
</script>

<template>
    <Teleport v-if="show" to="body">
        <div
            class="relative z-10"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            <div class="fixed inset-0 bg-black/75 transition-opacity"></div>
            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div
                    class="flex min-h-full items-center justify-center p-4 text-center sm:p-0"
                    @click.self="toggle"
                >
                    <div
                        class="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
                        @keyup.esc="toggle"
                    >
                        <div
                            class="bg-gray-300 dark:bg-gray-800 p-2 text-center"
                        >
                            <slot name="header">
                                <h3
                                    class="text-base font-semibold leading-6"
                                    id="modal-title"
                                >
                                    <slot name="title">&nbsp;</slot>
                                </h3>
                            </slot>
                            <button
                                type="button"
                                class="absolute top-0 right-0 p-1 m-0 rounded-md hover:bg-gray-400 dark:hover:bg-gray-700"
                                @click="toggle"
                                id="modal-close"
                            >
                                <span class="sr-only">Close</span>
                                <XMarkIcon class="h-6 w-6" />
                            </button>
                        </div>
                        <div class="bg-gray-100 dark:bg-gray-600 p-4 min-w-96">
                            <slot />
                        </div>
                        <div
                            v-if="$slots.footer"
                            class="bg-gray-200 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"
                        >
                            <slot name="footer" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>
