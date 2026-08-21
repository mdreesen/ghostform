<script setup lang="ts">
import confetti from 'canvas-confetti';

const props = defineProps({
    show: { type: Boolean, required: true },
    email: { type: String, default: '' },
    calendar: { type: String },
})

/**
 * Confetti recoloured to the form's own palette. Reading the CSS variables at
 * runtime means it matches whatever colours the realtor configured, rather than
 * firing cyan and purple over a warm cream form.
 */
function paletteColors(): string[] {
    if (!import.meta.client) return ['#B5563A']
    const styles = getComputedStyle(document.documentElement)
    const accent = styles.getPropertyValue('--gf-accent').trim() || '#B5563A'
    const fg = styles.getPropertyValue('--gf-fg').trim() || '#1F1B16'
    return [accent, fg, '#C9866F']
}

watch(() => props.show, (newVal) => {
    if (!newVal) return
    confetti({
        particleCount: 90,
        spread: 62,
        startVelocity: 34,
        gravity: 0.9,
        scalar: 0.9,
        origin: { y: 0.55 },
        colors: paletteColors()
    })
})
</script>

<template>
    <Transition name="ghost-modal">
        <div class="w-full text-center py-6">

            <!-- A simple rule and a tick, rather than a glowing gradient tile -->
            <div
                class="w-14 h-14 mx-auto mb-7 flex items-center justify-center rounded-full"
                :style="{ background: 'var(--gf-accent)' }"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"
                    fill="none" stroke="var(--gf-bg)" stroke-width="3"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                </svg>
            </div>

            <h3 class="gf-display text-[28px] mb-3">Thank you</h3>

            <p class="text-[14.5px] leading-relaxed mb-9 max-w-[34ch] mx-auto" style="color: var(--gf-muted)">
                We've sent a confirmation to
                <span :style="{ color: 'var(--gf-fg)' }">{{ email }}</span>.
                You'll hear back shortly.
            </p>

            <div v-if="calendar" class="pt-7" style="border-top: 1px solid var(--gf-hair)">
                <p class="gf-eyebrow mb-4" style="color: var(--gf-muted)">Rather not wait?</p>
                <baseButtonNavigate :href="calendar" text="Book a time directly" />
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.ghost-modal-enter-active,
.ghost-modal-leave-active {
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.ghost-modal-enter-from,
.ghost-modal-leave-to {
    opacity: 0;
    transform: translateY(12px);
}
</style>
