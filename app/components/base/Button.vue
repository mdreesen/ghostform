<script setup lang="ts">
const props = defineProps({
    text: { type: String, required: true, default: 'Submit' },
    variant: { type: String, default: 'primary' } // primary | quiet
})
</script>

<template>
    <button
        v-if="props.variant === 'primary'"
        class="px-6 py-3.5 text-[11px] uppercase tracking-[0.12em] font-semibold transition-opacity hover:opacity-90"
        :style="{ background: 'var(--gf-accent)', color: 'var(--gf-bg)' }"
    >
        {{ props.text }}
    </button>

    <button
        v-else
        class="px-6 py-3.5 text-[11px] uppercase tracking-[0.12em] font-semibold transition-colors"
        style="border: 1px solid var(--gf-hair); color: var(--gf-muted)"
    >
        {{ props.text }}
    </button>
</template>
