<template>
    <div
        class="absolute inset-0 flex items-center justify-center z-20"
        :style="{ background: 'color-mix(in srgb, var(--gf-bg) 82%, transparent)' }"
    >
        <!-- A thin ring in the form's own accent, rather than a blue spinner -->
        <div
            class="w-7 h-7 rounded-full animate-spin"
            :style="{
                border: '2px solid var(--gf-hair)',
                borderTopColor: 'var(--gf-accent)'
            }"
        />
    </div>
</template>
