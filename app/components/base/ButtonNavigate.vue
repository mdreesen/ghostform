<script setup lang="ts">
const props = defineProps({
    text: { type: String, required: true, default: '' },
    href: { type: String, required: true }
})
</script>

<template>
    <a
        :href="props.href"
        target="_blank"
        rel="noopener"
        class="inline-block px-6 py-3.5 text-[11px] uppercase tracking-[0.12em] font-semibold transition-colors"
        style="border: 1px solid var(--gf-accent); color: var(--gf-accent)"
    >
        {{ props.text }}
    </a>
</template>
