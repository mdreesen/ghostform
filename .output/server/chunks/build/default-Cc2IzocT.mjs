import { defineComponent, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot } from 'vue/server-renderer';
import { u as useRoute, a as useHead } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@iconify/utils';
import 'consola';
import 'ipx';
import 'vue-router';
import 'tailwindcss/colors';
import '@iconify/vue';
import 'framesync';
import 'popmotion';
import 'style-value-types';
import 'reka-ui';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import 'perfect-debounce';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { background_color, font_color, accent_color } = route.query;
    const hex = (v, fallback) => {
      const raw = (v ?? "").toString().replace(/^#/, "");
      return /^[0-9A-Fa-f]{6}$/.test(raw) ? `#${raw}` : fallback;
    };
    const bg = computed(() => hex(background_color, "#F7F4EF"));
    const fg = computed(() => hex(font_color, "#1F1B16"));
    const accent = computed(() => hex(accent_color, "#B5563A"));
    const isDark = computed(() => {
      const c = bg.value.slice(1);
      const r = parseInt(c.slice(0, 2), 16);
      const g = parseInt(c.slice(2, 4), 16);
      const b = parseInt(c.slice(4, 6), 16);
      return 0.299 * r + 0.587 * g + 0.114 * b < 140;
    });
    const muted = computed(() => isDark.value ? "rgba(255,255,255,0.62)" : "#8A847C");
    const hair = computed(() => isDark.value ? "rgba(255,255,255,0.16)" : "#DDD6C9");
    const manifestHref = computed(() => {
      const keep = [
        "category",
        "source",
        "id",
        "company_name",
        "company_email",
        "calendar",
        "address"
      ];
      const p = new URLSearchParams();
      for (const k of keep) {
        const v = route.query[k];
        if (v !== void 0 && String(v).length) p.set(k, String(v));
      }
      const qs = p.toString();
      return qs ? `/gf-manifest.webmanifest?${qs}` : "/gf-manifest.webmanifest";
    });
    useHead({
      meta: [
        // iOS reads these rather than the manifest for standalone behaviour.
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "default" },
        { name: "apple-mobile-web-app-title", content: "GhostForm" },
        { name: "mobile-web-app-capable", content: "yes" }
      ],
      htmlAttrs: {
        style: `--gf-bg:${bg.value}; --gf-fg:${fg.value}; --gf-accent:${accent.value}; --gf-muted:${muted.value}; --gf-hair:${hair.value};`
      },
      link: [
        // Must come before other links so Safari picks it up reliably.
        { rel: "manifest", href: manifestHref.value },
        { rel: "apple-touch-icon", href: "/images/maskable-icon.png" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500;600&display=swap"
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex justify-center items-center min-h-full w-full" }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-Cc2IzocT.mjs.map
