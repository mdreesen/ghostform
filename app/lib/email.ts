import { Resend } from 'resend';
import { useRealtorCompanyEmailFormatting } from '~/utils/email/formatting/company/realtor'
import type { Lead } from '~/types/lead';
import { useCleanString } from '~/composables/useCleanString';
const resend = new Resend(`${process.env.RESEND_KEY}`);

export async function emailLead(companyName: string, leadEmail: string) {
    try {
        // Transform Company name to no spaces or it will not work
        const useCompanyName = useCleanString(companyName)

        await resend.emails.send({
            from: `${useCompanyName}@ascendpod.com`,
            to: [leadEmail],
            subject: "Your Inquiry Has Been Received!",
            html:  `<div>Inquiry received.</div>
                    <div>Thank you, a specialist is currently reviewing your specifications and will provide a status update shortly.</div>
                    <div>${companyName}</div>`
        });

    } catch (error) {
        console.log(error);
        throw createError({
            statusCode: 401,
            message: 'Please try again'
        });
    };
};

export async function emailCompany(answers: Lead, companyEmail: string, imagePart) {
    try {
        await resend.emails.send({
            from: 'NoReply@ascendpod.com',
            to: [companyEmail],
            subject: "🔥 New Lead Inquiry 🔥",
            html: useRealtorCompanyEmailFormatting(answers),
            attachments: imagePart?.filename ? [
                {
                    filename: imagePart?.filename,
                    content: imagePart?.data, // Resend handles the Buffer automatically
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