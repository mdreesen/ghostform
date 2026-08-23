import { connectDB } from "../../lib/database/mongodb";
import { date } from "~/lib/date";
import { Model } from 'mongoose';
import LeadModel from '../../lib/database/models/Lead';
import type { Lead } from '~/types/lead';

const Lead = LeadModel as Model<Lead>;

/**
 * Persist a captured lead.
 *
 * Returns the created document so the caller can reference it (e.g. to fire a
 * speed-to-lead alert). Errors surface the ACTUAL cause instead of a blanket
 * "Something went wrong", which previously hid Mongoose validation failures.
 */
export async function useLead(
  companyId: string,
  companyEmail: string,
  companyName: string,
  answers: Lead
) {
  if (!companyId) {
    throw createError({
      statusCode: 400,
      message: 'Cannot save a lead without a company id.'
    });
  }

  try {
    await connectDB();

    const created = await Lead.create({
      userId: companyId,
      company_email: companyEmail,
      company_name: companyName,
      ...answers,
      date: date()
    });

    return created;

  } catch (error: any) {
    // Mongoose validation errors name the offending field — surface it.
    if (error?.name === 'ValidationError') {
      const fields = Object.keys(error.errors || {}).join(', ');
      console.error('[lead] Validation failed on:', fields, error.message);
      throw createError({
        statusCode: 400,
        message: `Lead rejected — invalid or missing: ${fields || 'unknown field'}`
      });
    }

    console.error('[lead] Save failed:', error);
    throw createError({
      statusCode: 500,
      message: error?.message || 'Could not save the lead.'
    });
  };
};

export async function useLeadUpdate(
  companyId: string,
  companyEmail: string,
  companyName: string,
  answers: Lead
) {
  if (!companyId) {
    throw createError({
      statusCode: 400,
      message: 'Cannot save a lead without a company id.'
    });
  }

  try {
    await connectDB();

    await Lead.findOneAndUpdate(
      { email: answers?.email },
      {
        userId: companyId,
        company_email: companyEmail,
        company_name: companyName,
        ...answers
      },
      { new: true });

  } catch (error: any) {
    // Mongoose validation errors name the offending field — surface it.
    if (error?.name === 'ValidationError') {
      const fields = Object.keys(error.errors || {}).join(', ');
      console.error('[lead] Validation failed on:', fields, error.message);
      throw createError({
        statusCode: 400,
        message: `Lead rejected — invalid or missing: ${fields || 'unknown field'}`
      });
    }

    console.error('[lead] Save failed:', error);
    throw createError({
      statusCode: 500,
      message: error?.message || 'Could not save the lead.'
    });
  };
};
