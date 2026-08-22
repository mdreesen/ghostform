<script setup lang="ts">
const route = useRoute();
const { background_color, font_color, accent_color } = route.query;

const hex = (v: unknown, fallback: string) => {
  const raw = (v ?? '').toString().replace(/^#/, '');
  return /^[0-9A-Fa-f]{6}$/.test(raw) ? `#${raw}` : fallback;
};

const bg = computed(() => hex(background_color, '#F7F4EF'));
const fg = computed(() => hex(font_color, '#1F1B16'));
const accent = computed(() => hex(accent_color, '#B5563A'));

const isDark = computed(() => {
  const c = bg.value.slice(1);
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  // Perceived luminance
  return (0.299 * r + 0.587 * g + 0.114 * b) < 140;
});

const muted = computed(() => isDark.value ? 'rgba(255,255,255,0.62)' : '#8A847C');
const hair = computed(() => isDark.value ? 'rgba(255,255,255,0.16)' : '#DDD6C9');

useHead({
  htmlAttrs: {
    style: `--gf-bg:${bg.value}; --gf-fg:${fg.value}; --gf-accent:${accent.value}; --gf-muted:${muted.value}; --gf-hair:${hair.value};`
  },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500;600&display=swap'
    }
  ]
});
</script>

<template>
  <div class="flex justify-center items-center min-h-full w-full">
    <slot />
  </div>
</template>

<style>
html {
  --ui-bg: var(--gf-bg);
  --ui-text: var(--gf-fg);
}
</style>
