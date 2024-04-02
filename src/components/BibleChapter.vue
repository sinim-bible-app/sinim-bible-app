<script setup>
    defineProps(["chapter", "verses"]);
</script>

<template>
    <div class="flex-grow overflow-y-auto">
        <span class="text-6xl leading-8 float-left fond-bold m-2">{{
            chapter
        }}</span>
        <div v-for="(verse, index) in verses" :key="index">
            <p>
                <sup v-if="index > 0" class="mx-2">{{ index + 1 }}</sup
                >{{ verse.trim() }}
            </p>
        </div>
    </div>
</template>
