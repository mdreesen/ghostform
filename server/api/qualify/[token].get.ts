import type { Model } from 'mongoose'
import LeadModelImport from '../../../lib/database/models/Lead'
import { connectDB } from '../../../lib/database/mongodb'

const LeadModel = LeadModelImport as Model<any>

/**
 * GET /api/qualify/:token   (PUBLIC — no session)
 *
 * Called by the capture app to load a questionnaire. Returns the question set
 * plus just enough context to greet the lead by name.
 *
 * The capture app fetches these questions rather than holding its own copy —
 * two apps with diverging copies of the same definitions is a problem this
 * project has already hit once with the Lead model.
 */
export default defineEventHandler(async (event) => {
  // CORS (including the OPTIONS preflight) is handled in server/middleware/cors.ts

  const token = event.context.params?.token || ''
  const parsed = readQualifyToken(token)
  if (!parsed) {
    throw createError({ statusCode: 401, message: 'This link is not valid or has expired.' })
  }

  await connectDB()
  const lead = await LeadModel.findById(parsed.leadId).lean() as any
  if (!lead) throw createError({ statusCode: 404, message: 'We could not find that record.' })

  const intent = lead?.qualification?.intent || lead?.buy_sell_both || 'buy'

  return {
    firstName: String(lead.name || '').split(' ')[0] || '',
    intent,
    // Already done? The capture app shows a "thanks, already received" state
    // rather than letting them fill it in twice.
    completed: Boolean(lead?.qualification?.completedAt),
    questions: questionsFor(intent).map((q) => ({
      id: q.id, label: q.label, type: q.type, options: q.options ?? null
    }))
  }
})
