import { connectDB } from "../../lib/database/mongodb";
import { Model } from 'mongoose';
import UserModel from '../../lib/database/models/User';
import { date } from "~/lib/date";
import type { Lead } from "~/types/lead";

const User = UserModel as Model<any>;

export async function useLead(companyEmail: string, answers: Lead) {

    try {
        await connectDB();

        await User.findOneAndUpdate({ email: companyEmail }, { $addToSet: { leads: { ...answers, date: date(), status: 'new' } } });

    } catch (error) {
        console.log(error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Something went wrong.'
        });
    };
};