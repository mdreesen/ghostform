import { connectDB } from "../../lib/database/mongodb";
import { Model } from 'mongoose';
import UserModel from '../../lib/database/models/User';

const User = UserModel as Model<any>;

export async function useUser(data) {

    try {
        await connectDB();

        // data.company_email brings back the hashed email
        const findUser = await User.find({ email_hashed: data.company_email }).lean();

        if (findUser[0]) {
            return findUser[0];
        };

    } catch (error) {
        console.log(error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Something went wrong.'
        });
    };
};