import type { Model } from 'mongoose'
import LeadModelImport from '../../../lib/database/models/Lead'
import { connectDB } from '../../../lib/database/mongodb'

const LeadModel = LeadModelImport as Model<any>

/**
 * POST /api/qualify/:id
 * Same-origin — no CORS, no preflight, no cross-app fetch.
 *
 * Updates the EXISTING lead. Never creates one. The dashboard reads these
 * answers from the shared database and runs its analysis there.
 */
export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id || !/^[a-f0-9]{24}$/i.test(id)) {
    throw createError({ statusCode: 400, message: 'That link does not look right.' })
  }

  const body = await readBody(event)
  const answers = body?.answers
  if (!answers || typeof answers !== 'object') {
    throw createError({ statusCode: 400, message: 'No answers were received.' })
  }

  await connectDB()
  const lead = await LeadModel.findById(id) as any
  if (!lead) throw createError({ statusCode: 404, message: 'We could not find that record.' })

  const intent = lead?.qualification?.intent || lead?.buy_sell_both || 'buy'

  await LeadModel.updateOne({ _id: id }, {
    $set: {
      'qualification.answers': answers,
      'qualification.completedAt': new Date(),
      'qualification.intent': intent
    }
  })

  return { success: true }
})
