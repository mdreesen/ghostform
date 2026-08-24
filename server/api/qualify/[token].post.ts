import { z } from 'zod'
import type { Model } from 'mongoose'
import LeadModelImport from '../../../lib/database/models/Lead'
import { connectDB } from '../../../lib/database/mongodb'

const LeadModel = LeadModelImport as Model<any>

const bodySchema = z.object({
  answers: z.record(z.string(), z.union([z.string(), z.number()]))
})

/**
 * POST /api/qualify/:token   (PUBLIC — no session)
 *
 * Saves a completed questionnaire against the EXISTING lead — it never creates
 * one. Then runs the analysis immediately, so the realtor sees the result
 * waiting for them rather than having to ask for it.
 */
export default defineEventHandler(async (event) => {
  // CORS (including the OPTIONS preflight) is handled in server/middleware/cors.ts

  const token = event.context.params?.token || ''
  const parsed = readQualifyToken(token)
  if (!parsed) {
    throw createError({ statusCode: 401, message: 'This link is not valid or has expired.' })
  }

  const { answers } = await readValidatedBody(event, bodySchema.parse)

  await connectDB()
  const lead = await LeadModel.findById(parsed.leadId) as any
  if (!lead) throw createError({ statusCode: 404, message: 'We could not find that record.' })

  const intent = lead?.qualification?.intent || lead?.buy_sell_both || 'buy'
  const now = new Date()

  // Save the answers first. Analysis is a bonus — a failure there must never
  // lose what the lead just spent five minutes typing.
  await LeadModel.updateOne({ _id: lead._id }, {
    $set: {
      'qualification.answers': answers,
      'qualification.completedAt': now,
      'qualification.intent': intent
    }
  })

  try {
    const result = await analyseLead(answers, intent, lead.name || '')
    await LeadModel.updateOne({ _id: lead._id }, {
      $set: {
        analysis: {
          readiness: result.scorecard.readiness,
          readinessLabel: result.scorecard.readinessLabel,
          financingRisk: result.scorecard.financingRisk,
          signals: result.scorecard.signals,
          gaps: result.scorecard.gaps,
          read: result.read,
          nextSteps: result.nextSteps,
          source: result.source,
          generatedAt: new Date(result.generatedAt)
        }
      }
    })
  } catch (err) {
    console.error('[qualify] answers saved, analysis failed:', err)
  }

  return { success: true }
})
