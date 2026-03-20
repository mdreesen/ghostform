import { Resend } from 'resend';
import type { Lead } from '~/types/lead';

const resend = new Resend(`${process.env.RESEND_KEY}`);

export async function emailLead(aiOutput: string, data: Lead) {
    try {

        await resend.emails.send({
            from: 'NoReply@ascendpod.com',
            to: [data?.email],
            subject: "Your Job Inquiry",
            html: aiOutput
        });
        console.log('emailing: Email sent to lead');

    } catch (error) {
        console.log(error);
        throw createError({
            statusCode: 401,
            message: 'Please try again'
        });
    };
};

export async function emailCompany(aiOutput: string, data: Lead) {

    try {
        await resend.emails.send({
            from: 'NoReply@ascendpod.com',
            to: [data?.email],
            subject: "Your Lead Inquiry",
            html: aiOutput,
        });

        console.log('emailing: Email sent to Company');

    } catch (error) {
        console.log(error);
        throw createError({
            statusCode: 401,
            message: 'Please try again'
        });
    };
};