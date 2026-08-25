// COMPOSABLES/USEOFFLINE.TS
import Dexie, { type Table } from 'dexie'

/**
 * ============================================================================
 * OFFLINE QUEUE
 * ============================================================================
 * Leads captured without signal are staged in IndexedDB and flushed later.
 *
 * WHY THIS WAS REWRITTEN — the iOS problem:
 *
 * The previous version listened for the `online` event and trusted
 * `navigator.onLine`. Both are unreliable on iOS:
 *
 *   - Safari fires `online` inconsistently, and often NOT AT ALL for a page
 *     that has been sitting idle when airplane mode is switched off. That's
 *     why nothing sent until the form was closed and reopened — reopening
 *     re-ran onMounted, which was the only other flush trigger.
 *   - `navigator.onLine === true` only means "there is a network interface".
 *     It can be true with no working connection, so gating on it both misses
 *     real reconnections and wastes attempts on fake ones.
 *
 * So this version:
 *   1. Never trusts navigator.onLine to decide whether to TRY. The upload
 *      attempt itself is the connectivity test.
 *   2. Retries on a backoff timer while anything is queued, so a missed
 *      `online` event costs seconds, not a reopen.
 *   3. Flushes on visibilitychange / pageshow / focus — on iOS, returning to
 *      the app is a far more reliable signal than `online`.
 *   4. Tracks attempts per record so one poison payload can't block the queue
 *      behind it forever.
 * ============================================================================
 */

export interface OfflineFormPayload {
  id?: number
  category: string
  answersJson: string
  companyJson: string
  imageBlob: Blob | null
  createdAt: number
  attempts?: number
  lastError?: string
}

class GhostFormQueueDB extends Dexie {
  queue!: Table<OfflineFormPayload>

  constructor() {
    super('GhostFormQueueDB')
    this.version(1).stores({ queue: '++id, createdAt' })
    // v2 adds retry bookkeeping. Existing rows migrate with attempts = 0.
    this.version(2).stores({ queue: '++id, createdAt' }).upgrade((tx) =>
      tx.table('queue').toCollection().modify((r: any) => { r.attempts = r.attempts ?? 0 })
    )
  }
}

const db = new GhostFormQueueDB()

// Give up on a single record after this many failures so it stops blocking
// everything behind it. It stays in the DB for inspection rather than deleted.
const MAX_ATTEMPTS = 8

// Module-level so every component shares one queue state and one timer.
const pendingCount = ref(0)
const isSyncing = ref(false)
let retryTimer: ReturnType<typeof setTimeout> | null = null
let retryDelay = 3000
let listenersBound = false

export function useFormOffline() {

  async function refreshCount() {
    try { pendingCount.value = await db.queue.count() } catch { /* non-fatal */ }
  }

  async function stageFormOffline(category: string, answers: any, company: any, imageFile: File | null) {
    try {
      await db.queue.add({
        category,
        answersJson: JSON.stringify({ ...answers, category }),
        companyJson: JSON.stringify(company),
        imageBlob: imageFile ? new Blob([imageFile], { type: imageFile.type }) : null,
        createdAt: Date.now(),
        attempts: 0
      })
      await refreshCount()
      // Start trying straight away — the connection may already be back.
      scheduleRetry(1500)
      return true
    } catch (err) {
      console.error('[offline] Could not stage lead:', err)
      return false
    }
  }

  /**
   * Attempt to send everything queued.
   *
   * Deliberately does NOT check navigator.onLine first — the request is the
   * connectivity test, and on iOS that flag is not trustworthy enough to gate
   * on. A failed attempt costs one round trip and reschedules.
   */
  async function processOfflineQueue(): Promise<void> {
    if (isSyncing.value) return

    let items: OfflineFormPayload[]
    try {
      items = await db.queue.orderBy('createdAt').toArray()
    } catch (err) {
      console.error('[offline] Could not read queue:', err)
      return
    }

    const sendable = items.filter((i) => (i.attempts ?? 0) < MAX_ATTEMPTS)
    pendingCount.value = items.length
    if (sendable.length === 0) { stopRetry(); return }

    isSyncing.value = true
    let sentAny = false
    let hitNetworkError = false

    for (const record of sendable) {
      try {
        const fd = new FormData()
        fd.append('answers', new Blob([record.answersJson], { type: 'application/json' }))
        fd.append('company', new Blob([record.companyJson], { type: 'application/json' }))
        if (record.imageBlob) fd.append('image', record.imageBlob, 'offline_capture.jpg')

        await $fetch('/api/lead', { method: 'POST', body: fd })

        await db.queue.delete(record.id!)
        sentAny = true
      } catch (err: any) {
        const status = err?.statusCode ?? err?.response?.status

        // 4xx means the server understood and rejected it — retrying an
        // identical payload will fail identically. Count it hard so it can't
        // block the queue forever.
        const permanent = typeof status === 'number' && status >= 400 && status < 500

        await db.queue.update(record.id!, {
          attempts: (record.attempts ?? 0) + (permanent ? MAX_ATTEMPTS : 1),
          lastError: String(err?.message || status || err).slice(0, 200)
        })

        if (!permanent) {
          // Almost certainly still offline. Stop the pass and back off rather
          // than hammering every remaining record against a dead connection.
          hitNetworkError = true
          break
        }
        // Permanent failure: move on to the next record.
      }
    }

    isSyncing.value = false
    await refreshCount()

    if (pendingCount.value > 0) {
      // Reset the backoff after any success — the connection clearly works now.
      if (sentAny) retryDelay = 3000
      scheduleRetry(hitNetworkError ? undefined : 2000)
    } else {
      stopRetry()
    }
  }

  /** Retry with backoff, capped, and only while something is queued. */
  function scheduleRetry(delay?: number) {
    if (!import.meta.client) return
    if (retryTimer) clearTimeout(retryTimer)
    const wait = delay ?? retryDelay
    retryTimer = setTimeout(() => {
      retryTimer = null
      retryDelay = Math.min(retryDelay * 1.6, 60000)
      processOfflineQueue()
    }, wait)
  }

  function stopRetry() {
    if (retryTimer) { clearTimeout(retryTimer); retryTimer = null }
    retryDelay = 3000
  }

  /**
   * Bind every signal that a connection might be back. On iOS, returning to
   * the app (visibilitychange / pageshow) is a much more reliable trigger than
   * the `online` event, which frequently never fires for an idle page.
   */
  function bindTriggers() {
    if (!import.meta.client || listenersBound) return
    listenersBound = true

    const kick = () => { scheduleRetry(400) }

    window.addEventListener('online', kick)
    window.addEventListener('focus', kick)
    // Fires when the tab/app is brought back to the foreground.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') kick()
    })
    // iOS restores pages from the back/forward cache without firing focus.
    window.addEventListener('pageshow', kick)

    refreshCount().then(() => {
      if (pendingCount.value > 0) scheduleRetry(1000)
    })
  }

  return {
    stageFormOffline,
    processOfflineQueue,
    bindTriggers,
    isSyncing,
    pendingCount
  }
}
