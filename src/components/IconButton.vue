<script setup>
    defineProps({
        label: String,
        icon: {
            type: Object,
            required: true,
        },
        action: Function,
        disabled: {
            type: Boolean,
            default: false,
        },
    });
</script>

<template>
    <button
        class="flex flex-col items-center justify-center text-xs"
        :disabled
        :class="{ 'opacity-50 cursor-not-allowed': disabled }"
        @click="action"
        type="button"
    >
        <Component :is="icon" class="h-6 text-current" />
        {{ label }}
    </button>
</template>
