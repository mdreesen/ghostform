<script setup lang="ts">
const props = defineProps({
    text: {
        type: String,
        required: true,
        default: 'Delete'
    },
})
</script>

<template>
    <button class="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-500 transition">
        {{ props.text }}
    </button>
</template>