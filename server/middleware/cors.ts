/**
 * CORS for the public questionnaire endpoints.
 *
 * WHY MIDDLEWARE AND NOT PER-ROUTE:
 * The previous attempt handled OPTIONS inside `[token].post.ts` with
 * `if (event.method === 'OPTIONS')`. That can never run — Nitro routes
 * `.post.ts` files to POST requests only, so the browser's preflight OPTIONS
 * matched no route and returned 404. The browser then reported a CORS error,
 * because a failed preflight blocks the real request.
 *
 * A GET from another origin worked fine (simple requests skip preflight),
 * which is why loading the questions succeeded and only submitting failed.
 *
 * Middleware runs for every request regardless of method, so the preflight is
 * answered before route matching becomes an issue.
 */

// Only the public, token-authenticated questionnaire routes are opened up.
// Everything else stays same-origin — a blanket '*' across the whole API
// would expose session-authenticated endpoints to any site.
const PUBLIC_PREFIXES = ['/api/qualify/']

export default defineEventHandler((event) => {
  const path = event.path || ''
  if (!PUBLIC_PREFIXES.some((p) => path.startsWith(p))) return

  setHeader(event, 'Access-Control-Allow-Origin', '*')
  setHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  setHeader(event, 'Access-Control-Allow-Headers', 'content-type')
  setHeader(event, 'Access-Control-Max-Age', '86400')

  // Answer the preflight here and stop. Returning a body ends the request,
  // so it never falls through to route matching (and the 404 that caused).
  if (event.method === 'OPTIONS') {
    setResponseStatus(event, 204)
    return ''
  }
})
