import type { Model } from 'mongoose'
import LeadModelImport from '../../../lib/database/models/Lead'
import { connectDB } from '../../../lib/database/mongodb'
import { questionsFor } from '~/utils/questions/qualify'

const LeadModel = LeadModelImport as Model<any>

/**
 * GET /api/qualify/:id
 * Same-origin. Loads the lead's name and the right question set.
 *
 * The id is a Mongo ObjectId taken straight from the link the realtor sent.
 * It is not guessable in practice, and the only thing it exposes is a first
 * name — no contact details are returned.
 */
export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id || !/^[a-f0-9]{24}$/i.test(id)) {
    throw createError({ statusCode: 400, message: 'That link does not look right.' })
  }

  await connectDB()
  const lead = await LeadModel.findById(id).lean() as any
  if (!lead) throw createError({ statusCode: 404, message: 'We could not find that record.' })

  const intent = lead?.qualification?.intent || lead?.buy_sell_both || 'buy'

  return {
    firstName: String(lead.name || '').split(' ')[0] || '',
    intent,
    completed: Boolean(lead?.qualification?.completedAt),
    questions: questionsFor(intent)
  }
})
