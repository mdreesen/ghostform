<script setup lang="ts">
const props = defineProps({
    textOne: {
        type: String,
        required: true,
        default: 'One'
    },
    textTwo: {
        type: String,
        required: true,
        default: 'Two'
    },
})
</script>

<template>
    <div class="bg-blue-600 px-6 py-2 rounded-lg flex gap-2 items-center">
        <button class="hover:bg-blue-500 transition">
        {{ props.textOne }}
    </button>

    <span>|</span>

    <button class="hover:bg-blue-500 transition">
        {{ props.textTwo }}
    </button>

    </div>
</template>