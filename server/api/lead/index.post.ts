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

    if (!answers?.email) {
        throw createError({ statusCode: 400, message: 'Missing data: Need email' });
    }

    // Resolve the realtor. Throws a specific 400/404/503 if this fails, rather
    // than returning undefined and blowing up later with a generic 500.
    const findCompany = await useUser(company);
console.log(answers)
    const companyId = findCompany?._id;
    const companyEmail = findCompany?.email;
    const companyName = findCompany?.company ?? 'NoReply';
    const leadEmail = answers?.email;

    const savedLead = await useLead(companyId, companyEmail, companyName, answers);

    // 2. Notifications are best-effort. Failures are logged, not thrown:
    //    previously a Resend hiccup returned a 500 even though the lead was
    //    already safely in the database.
    const notifications = await Promise.allSettled([
        emailLead(companyName, leadEmail),
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
