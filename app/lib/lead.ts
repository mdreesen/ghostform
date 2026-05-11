import { connectDB } from "../../lib/database/mongodb";
import { Model } from 'mongoose';
import UserModel from '../../lib/database/models/User';

const User = UserModel as Model<any>;

export async function useLead(useAiCompany, findCompany, answers) {

    try {
        await connectDB();

        await User.findOneAndUpdate({ email: findCompany?.email }, { $addToSet: { leads: { ...answers, ai_analysis: useAiCompany } } });

    } catch (error) {
        console.log(error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Something went wrong.'
        });
    };
};