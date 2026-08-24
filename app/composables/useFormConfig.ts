// COMPOSABLES/USEFORMCONFIG.TS
/**
 * Persists the form's configuration (which realtor, which question set, colors,
 * calendar link) so the form still works when opened WITHOUT query params —
 * which is exactly what happens offline, or when launched from a home-screen
 * icon.
 *
 * Why this is needed:
 * The form is configured entirely through the URL:
 *   /?category=realtor&id=...&company_name=<hash>&company_email=<hash>&...
 * A service worker can serve the cached page offline, but it cannot invent
 * those parameters. Without them the form doesn't know which realtor the lead
 * belongs to. So the first time the form loads WITH params, we save them; every
 * later load can rehydrate from that copy.
 *
 * Configs are stored per company id, so a device used for more than one
 * account doesn't silently misattribute leads.
 */

export interface FormConfig {
  category: string
  source: string
  id: string
  seen_at?: string;
  company_name: string
  company_email: string
  calendar?: string
  // background_color?: string
  // font_color?: string
  use_image_upload?: string
  /** display-only label so the realtor can confirm the right account is loaded */
  label?: string
  savedAt: number
}

const STORE_KEY = 'ghostform:configs'
const LAST_KEY = 'ghostform:lastConfigId'

function readStore(): Record<string, FormConfig> {
  if (!import.meta.client) return {}
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '{}')
  } catch {
    return {}
  }
}

function writeStore(store: Record<string, FormConfig>) {
  if (!import.meta.client) return
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store))
  } catch (err) {
    console.error('Could not persist form config:', err)
  }
}

/** Does this query object carry everything the form needs to submit a lead? */
export function isCompleteConfig(q: any): boolean {
  return Boolean(q?.id && q?.company_email && q?.category)
}

export function useFormConfig() {
  const store = readStore()

  /** Save a config from the URL so future offline loads can use it. */
  function saveConfig(query: any, label?: string) {
    if (!import.meta.client || !isCompleteConfig(query)) return

    const cfg: FormConfig = {
      category: String(query.category || 'realtor'),
      source: String(query.source || 'default'),
      id: String(query.id),
      company_name: String(query.company_name || ''),
      company_email: String(query.company_email || ''),
      seen_at: String(query.address || ''),
      calendar: query.calendar ? String(query.calendar) : undefined,
      // background_color: query.background_color ? String(query.background_color) : undefined,
      // font_color: query.font_color ? String(query.font_color) : undefined,
      use_image_upload: query.use_image_upload ? String(query.use_image_upload) : undefined,
      label,
      savedAt: Date.now()
    }

    const next = readStore()
    next[cfg.id] = cfg
    writeStore(next)
    try {
      localStorage.setItem(LAST_KEY, cfg.id)
    } catch { /* non-fatal */ }
  }

  /** All saved configs, most recently used first. */
  function listConfigs(): FormConfig[] {
    return Object.values(readStore()).sort((a, b) => b.savedAt - a.savedAt)
  }

  /** The config to fall back to when the URL has none. */
  function lastConfig(): FormConfig | null {
    if (!import.meta.client) return null
    const all = readStore()
    let id: string | null = null
    try { id = localStorage.getItem(LAST_KEY) } catch { /* ignore */ }
    if (id && all[id]) return all[id]
    const list = listConfigs()
    return list[0] ?? null
  }

  /**
   * Resolve the config to use: URL params win (so a fresh link always
   * re-configures), otherwise fall back to what we saved earlier.
   * Returns null only when there's nothing in the URL AND nothing saved.
   */
  function resolveConfig(query: any): { config: FormConfig | null; fromCache: boolean } {
    if (isCompleteConfig(query)) {
      saveConfig(query)
      console.log(query)
      return {
        config: {
          category: String(query.category || 'realtor'),
          source: String(query.source || 'default'),
          id: String(query.id),
          company_name: String(query.company_name || ''),
          company_email: String(query.company_email || ''),
          seen_at: query.address ? String(query.address) : '',
          calendar: query.calendar ? String(query.calendar) : undefined,
          // background_color: query.background_color ? String(query.background_color) : undefined,
          // font_color: query.font_color ? String(query.font_color) : undefined,
          use_image_upload: query.use_image_upload ? String(query.use_image_upload) : undefined,
          savedAt: Date.now()
        },
        fromCache: false
      }
    }

    const cached = lastConfig()
    return { config: cached, fromCache: Boolean(cached) }
  }

  /** Switch the active account (device shared across more than one login). */
  function useConfig(id: string) {
    const all = readStore()
    if (!all[id]) return null
    try { localStorage.setItem(LAST_KEY, id) } catch { /* ignore */ }
    return all[id]
  }

  function forgetConfig(id: string) {
    const all = readStore()
    delete all[id]
    writeStore(all)
  }

  return {
    saveConfig,
    listConfigs,
    lastConfig,
    resolveConfig,
    useConfig,
    forgetConfig,
    isCompleteConfig,
    hasSaved: computed(() => Object.keys(store).length > 0)
  }
}
