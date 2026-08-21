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
    <div class="flex gap-3 items-center w-full">
        <button class="flex-1 px-5 py-3.5 text-[11px] uppercase tracking-[0.12em] font-semibold transition-opacity hover:opacity-90" :style="{ background: 'var(--gf-accent)', color: 'var(--gf-bg)' }">
        {{ props.textOne }}
    </button>

    <span>|</span>

    <button class="flex-1 px-5 py-3.5 text-[11px] uppercase tracking-[0.12em] font-semibold transition-opacity hover:opacity-90" :style="{ background: 'var(--gf-accent)', color: 'var(--gf-bg)' }">
        {{ props.textTwo }}
    </button>

    </div>
</template>