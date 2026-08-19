import { connectDB } from "../../lib/database/mongodb";
import { Model } from 'mongoose';
import UserModel from '../../lib/database/models/User';

const User = UserModel as Model<any>;

/**
 * Look up the realtor this form belongs to.
 *
 * `data.company_email` is the HASHED email carried in the form's URL, matched
 * against the user's stored `email_hashed`.
 *
 * NOTE: this previously returned `undefined` when no match was found, which let
 * a broken lookup flow downstream into `Lead.create({ userId: undefined })` —
 * a Mongoose "required" validation error surfacing as a useless generic 500.
 * Now it fails loudly at the actual point of failure.
 */
export async function useUser(data: any) {
    if (!data?.company_email) {
        throw createError({
            statusCode: 400,
            message: 'Form is missing its company_email parameter — the link is incomplete.'
        });
    }

    try {
        await connectDB();
    } catch (error) {
        console.error('[lead] Mongo connection failed:', error);
        throw createError({
            statusCode: 503,
            message: 'Database unavailable. Check MONGO_URI.'
        });
    }

    const findUser = await User.findOne({ email_hashed: data.company_email }).lean();

    if (!findUser) {
        // The single most common cause of a failed capture: the hash in the
        // link doesn't match any user. Log enough to diagnose without dumping
        // the full hash into logs.
        console.error(
            '[lead] No company matched email_hashed:',
            String(data.company_email).slice(0, 12) + '…',
            '- the form link may be stale, or the account regenerated its hash.'
        );
        throw createError({
            statusCode: 404,
            message: 'This form is not linked to an active account. Regenerate the form link.'
        });
    }

    return findUser;
};
