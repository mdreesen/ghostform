<script setup lang="ts">
const route = useRoute();
const { background_color, font_color, accent_color } = route.query;

/**
 * Colour resolution.
 *
 * Defaults are the GhostForm Danish palette (warm cream, warm ink, terracotta)
 * so an unconfigured form already looks right. A realtor can still override any
 * of the three via query params to match their own branding.
 *
 * Params arrive WITHOUT a leading '#', because a raw '#' in a URL starts the
 * fragment and everything after it never reaches the server.
 */
const hex = (v: unknown, fallback: string) => {
  const raw = (v ?? '').toString().replace(/^#/, '');
  return /^[0-9A-Fa-f]{6}$/.test(raw) ? `#${raw}` : fallback;
};

const bg = computed(() => hex(background_color, '#F7F4EF'));
const fg = computed(() => hex(font_color, '#1F1B16'));
const accent = computed(() => hex(accent_color, '#B5563A'));

/**
 * Derive muted/hairline tones from the chosen text colour so the design holds
 * together on ANY background a realtor picks — hardcoding greys would look
 * wrong on a dark theme.
 */
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


/**
 * Point at a manifest that carries this page's query params.
 *
 * iOS uses the manifest's start_url when adding to the home screen — with a
 * static '/', the realtor's configuration is dropped at install time and the
 * icon opens a blank form. This rebuilds the manifest URL from whatever
 * params the page was opened with.
 */
const manifestHref = computed(() => {
  const keep = ['category','source','id','company_name','company_email',
                'calendar','address'];
  const p = new URLSearchParams();
  for (const k of keep) {
    const v = route.query[k];
    if (v !== undefined && String(v).length) p.set(k, String(v));
  }
  const qs = p.toString();
  return qs ? `/gf-manifest.webmanifest?${qs}` : '/gf-manifest.webmanifest';
});

useHead({
  meta: [
    // iOS reads these rather than the manifest for standalone behaviour.
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
    { name: 'apple-mobile-web-app-title', content: 'GhostForm' },
    { name: 'mobile-web-app-capable', content: 'yes' },
  ],
  htmlAttrs: {
    style: `--gf-bg:${bg.value}; --gf-fg:${fg.value}; --gf-accent:${accent.value}; --gf-muted:${muted.value}; --gf-hair:${hair.value};`
  },
  link: [
    // Must come before other links so Safari picks it up reliably.
    { rel: 'manifest', href: manifestHref.value },
    { rel: 'apple-touch-icon', href: '/images/maskable-icon.png' },
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
