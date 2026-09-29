import { emailLead, emailCompany } from '~/lib/email';
import type { Company } from '~/types/user';
import { leadData } from '~/utils/users/useLead';
import { companyData } from '~/utils/users/company';
import { useUser } from '~/lib/user';
import { useLead } from '~/lib/lead';

export default defineEventHandler(async (event) => {
    const formData = await readMultipartFormData(event);

    const answersPart = formData?.find(item => item.name === 'answers');
    const companyPart = formData?.find(item => item.name === 'company');
    const imagePart = formData?.find((item) => item.name === 'image');

    let answers: any = leadData;
    let company: Company = companyData;

    try {
        if (answersPart) answers = JSON.parse(answersPart.data.toString('utf-8'));
        if (companyPart) company = JSON.parse(companyPart.data.toString('utf-8'));
    } catch (error) {
        throw createError({ statusCode: 400, message: 'Malformed form payload.' });
    }

    /**
     * EITHER an email or a phone number.
     *
     * Was email-only, which turned away every lead who gave a mobile instead —
     * and at an open house that's most of them. The client validates too, but
     * this is the check that actually protects the database.
     */
    const leadHasEmail = Boolean(String(answers?.email ?? '').trim());
    const leadHasPhone = Boolean(String(answers?.phone ?? '').replace(/\D/g, ''));

    if (!leadHasEmail && !leadHasPhone) {
        throw createError({
            statusCode: 400,
            message: 'Need an email address or a phone number.'
        });
    }

    // Resolve the realtor. Throws a specific 400/404/503 if this fails, rather
    // than returning undefined and blowing up later with a generic 500.
    const findCompany = await useUser(company);

    const companyId = findCompany?._id;
    const companyEmail = findCompany?.email;
    const companyName = findCompany?.company ?? 'NoReply';
    const leadEmail = answers?.email;

    const savedLead = await useLead(companyId, companyEmail, companyName, answers);

    // 2. Notifications are best-effort. Failures are logged, not thrown:
    //    previously a Resend hiccup returned a 500 even though the lead was
    //    already safely in the database.
    /**
     * A phone-only lead has no address to confirm to. allSettled would swallow
     * the failure, but it would log an error on every such submission — so skip
     * it deliberately rather than failing quietly and noisily.
     *
     * The realtor is still notified either way; that's the notification that
     * matters.
     */
    const notifications = await Promise.allSettled([
        leadHasEmail
            ? emailLead(companyName, leadEmail)
            : Promise.resolve({ skipped: 'no email address for this lead' }),
        emailCompany(answers, companyEmail, imagePart)
    ]);

    notifications.forEach((result, i) => {
        if (result.status === 'rejected') {
            console.error(
                `[lead] Notification ${i === 0 ? 'to lead' : 'to company'} failed:`,
                result.reason?.message || result.reason
            );
        }
    });

    const emailsFailed = notifications.some(n => n.status === 'rejected');

    return {
        status: 'success',
        leadId: String(savedLead?._id ?? ''),
        // Surfaced so the UI could warn if desired; the capture itself is safe.
        emailsFailed
    };
});
