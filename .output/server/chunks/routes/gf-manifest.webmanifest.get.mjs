import { d as defineEventHandler, g as getQuery, s as setHeader } from '../nitro/nitro.mjs';
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

const ALLOWED = [
  "category",
  "source",
  "id",
  "company_name",
  "company_email",
  "calendar",
  "background_color",
  "font_color",
  "accent_color",
  "use_image_upload",
  "address"
];
function hex(v, fallback) {
  const raw = String(v != null ? v : "").replace(/^#/, "");
  return /^[0-9A-Fa-f]{6}$/.test(raw) ? `#${raw}` : fallback;
}
const gfManifest_webmanifest_get = defineEventHandler((event) => {
  const q = getQuery(event);
  const params = new URLSearchParams();
  for (const key of ALLOWED) {
    const val = q[key];
    if (val !== void 0 && String(val).length) params.set(key, String(val));
  }
  const qs = params.toString();
  const startUrl = qs ? `/?${qs}` : "/";
  const background = hex(q.background_color, "#F7F4EF");
  const theme = hex(q.accent_color, background);
  const label = String(q.company_label || "").trim();
  setHeader(event, "Content-Type", "application/manifest+json");
  setHeader(event, "Cache-Control", "public, max-age=300");
  setHeader(event, "Vary", "Accept-Encoding");
  return {
    name: label ? `${label} \u2014 Lead Capture` : "GhostForm Lead Capture",
    short_name: label || "GhostForm",
    description: "Offline-capable lead capture",
    display: "standalone",
    orientation: "portrait",
    start_url: startUrl,
    scope: "/",
    theme_color: theme,
    background_color: background,
    icons: [
      { src: "/images/maskable-icon.png", sizes: "445x445", type: "image/png", purpose: "any" },
      { src: "/images/maskable-icon.png", sizes: "445x445", type: "image/png", purpose: "maskable" }
    ]
  };
});

export { gfManifest_webmanifest_get as default };
//# sourceMappingURL=gf-manifest.webmanifest.get.mjs.map
