import { connectDB } from "../../lib/database/mongodb";
import { date } from "~/lib/date";
import { Model } from 'mongoose';
import LeadModel from '../../lib/database/models/Lead';
import type { Lead } from '~/types/lead';

const Lead = LeadModel as Model<Lead>;

export async function useLead(companyId: string, companyEmail: string, companyName: string, answers: Lead) {

    try {
        await connectDB();

        await Lead.create({ userId: companyId, company_email: companyEmail, company_name: companyName, ...answers, date: date() });

    } catch (error) {
        console.log(error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Something went wrong.'
        });
    };
};