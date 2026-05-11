import { Resend } from 'resend';
import type { Company } from '~/types/user';

const resend = new Resend(`${process.env.RESEND_KEY}`);

export async function emailLead(aiOutput: string, data: any) {
    try {

        await resend.emails.send({
            from: 'NoReply@ascendpod.com',
            to: [data?.email],
            subject: "Your Inquiry",
            html: aiOutput
        });

    } catch (error) {
        console.log(error);
        throw createError({
            statusCode: 401,
            message: 'Please try again'
        });
    };
};

export async function emailCompany(aiOutput: string, findCompany, image) {
    try {
        await resend.emails.send({
            from: 'NoReply@ascendpod.com',
            to: [findCompany?.email],
            subject: "New Lead Inquiry",
            html: aiOutput,
            attachments: image?.filename ? [
                {
                    filename: image?.filename,
                    content: image?.data, // Resend handles the Buffer automatically
                },
            ] : [],
        });

    } catch (error) {
        console.log(error);
        throw createError({
            statusCode: 401,
            message: 'Please try again'
        });
    };
};