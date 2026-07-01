// COMPOSABLES/USEFORMOFFLINE.TS
import Dexie, { type Table } from 'dexie'

export interface OfflineFormPayload {
  id?: number
  category: string
  answersJson: string       // Plain stringified answers tree
  companyJson: string       // Plain stringified company tokens
  imageBlob: Blob | null    // Preserves binary compressed imagery safely
  createdAt: number
}

class GhostFormQueueDB extends Dexie {
  queue!: Table<OfflineFormPayload>

  constructor() {
    super('GhostFormQueueDB')
    this.version(1).stores({
      queue: '++id, createdAt'
    })
  }
}

const db = new GhostFormQueueDB()

export function useFormOffline() {
  const isSyncing = ref(false)

  // 💾 CACHE ENTIRE FORM DATA FOR DEFERRED ROUTING
  async function stageFormOffline(category: string, answers: any, company: any, imageFile: File | null) {
    try {
      await db.queue.add({
        category,
        answersJson: JSON.stringify({ ...answers, category }),
        companyJson: JSON.stringify(company),
        imageBlob: imageFile ? new Blob([imageFile], { type: imageFile.type }) : null,
        createdAt: Date.now()
      })
      return true
    } catch (err) {
      console.error('❌ IndexedDB staging pipeline broken:', err)
      return false
    }
  }

  // 🛰️ FLUSH QUEUE AND DISPATCH BACK TO MONGODB VIA FORM_DATA
  async function processOfflineQueue() {
    if (isSyncing.value || !navigator.onLine) return
    
    const items = await db.queue.orderBy('createdAt').toArray()
    if (items.length === 0) return

    isSyncing.value = true
    console.log(`🔄 Flushing local storage: ${items.length} items staged for delivery...`)

    for (const record of items) {
      try {
        const fd = new FormData()
        
        // Reconstruct the exact Blob parameters your backend handles
        fd.append('answers', new Blob([record.answersJson], { type: 'application/json' }))
        fd.append('company', new Blob([record.companyJson], { type: 'application/json' }))
        
        if (record.imageBlob) {
          fd.append('image', record.imageBlob, 'offline_capture.jpg')
        }

        await $fetch('/api/lead', {
          method: 'POST',
          body: fd
        })

        // Purge successfully resolved payloads from the browser storage matrix
        await db.queue.delete(record.id!)
        console.log(`✅ Cached entry index #${record.id} securely transferred to database.`)
      } catch (err) {
        console.error(`❌ Dispatch block failed for record #${record.id}:`, err)
        break // Halt loop sequence if connection goes spotty again midway
      }
    }
    isSyncing.value = false
  }

  return {
    stageFormOffline,
    processOfflineQueue,
    isSyncing
  }
}