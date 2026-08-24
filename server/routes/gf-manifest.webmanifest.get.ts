/**
 * ============================================================================
 * PER-REALTOR WEB APP MANIFEST
 * ============================================================================
 * Why this exists:
 *
 * When a realtor taps "Add to Home Screen", iOS reads the manifest's
 * `start_url` and uses THAT — not the URL currently in the address bar. With a
 * static `start_url: '/'`, every configured query param is thrown away at
 * install time, and the icon opens an unconfigured form.
 *
 * The localStorage fallback in useFormConfig doesn't rescue this on iOS
 * either: a home-screen web app gets its OWN storage partition, separate from
 * Safari. Anything saved while browsing is invisible to the installed app.
 *
 * So the params have to be inside the manifest itself. This route echoes the
 * incoming query string back into `start_url`, so the installed icon launches
 * fully configured.
 *
 * Usage — link it with the SAME query the page was opened with:
 *   <link rel="manifest" href="/gf-manifest.webmanifest?category=realtor&id=...">
 * ============================================================================
 */

// Only these are worth carrying into the installed app.
const ALLOWED = [
  'category', 'source', 'id',
  'company_name', 'company_email',
  'calendar', 'background_color', 'font_color', 'accent_color',
  'use_image_upload', 'address'
]

function hex(v: unknown, fallback: string): string {
  const raw = String(v ?? '').replace(/^#/, '')
  return /^[0-9A-Fa-f]{6}$/.test(raw) ? `#${raw}` : fallback
}

export default defineEventHandler((event) => {
  const q = getQuery(event)

  // Rebuild the query string from allowed keys only, properly encoded.
  const params = new URLSearchParams()
  for (const key of ALLOWED) {
    const val = q[key]
    if (val !== undefined && String(val).length) params.set(key, String(val))
  }

  const qs = params.toString()
  const startUrl = qs ? `/?${qs}` : '/'

  // Match the installed app's chrome to the realtor's own colours so the
  // splash screen and status bar don't flash a colour they never chose.
  const background = hex(q.background_color, '#F7F4EF')
  const theme = hex(q.accent_color, background)

  // A distinct name per company helps when an agent installs more than one.
  const label = String(q.company_label || '').trim()

  setHeader(event, 'Content-Type', 'application/manifest+json')
  // Vary on the query so a CDN can't hand one realtor another's manifest.
  setHeader(event, 'Cache-Control', 'public, max-age=300')
  setHeader(event, 'Vary', 'Accept-Encoding')

  return {
    name: label ? `${label} — Lead Capture` : 'GhostForm Lead Capture',
    short_name: label || 'GhostForm',
    description: 'Offline-capable lead capture',
    display: 'standalone',
    orientation: 'portrait',
    start_url: startUrl,
    scope: '/',
    theme_color: theme,
    background_color: background,
    icons: [
      { src: '/images/maskable-icon.png', sizes: '445x445', type: 'image/png', purpose: 'any' },
      { src: '/images/maskable-icon.png', sizes: '445x445', type: 'image/png', purpose: 'maskable' }
    ]
  }
})
