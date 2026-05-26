import { emailLead, emailCompany } from '~/lib/email';
import type { Company } from '~/types/user';
import { leadData } from '~/utils/users/useLead';
import { companyData } from '~/utils/users/company';
import { useUser } from '~/lib/user';
import { useLead } from '~/lib/lead';
export default defineEventHandler(async (event) => {

    try {
        const formData = await readMultipartFormData(event);

        const answersPart = formData?.find(item => item.name === 'answers');
        const companyPart = formData?.find(item => item.name === 'company');

        let answers: any = leadData;
        let company: Company = companyData;

        if (answersPart) {
            const jsonString = answersPart.data.toString('utf-8');
            answers = JSON.parse(jsonString);
        };
        if (companyPart) {
            const jsonString = companyPart.data.toString('utf-8');
            company = JSON.parse(jsonString);
        };

        // Need lead's email to create email and use database
        if (!answers?.email) throw createError({ statusCode: 400, message: 'Missing data' });
        const findCompany = await useUser(company);
        const imagePart = formData?.find((item) => item.name === 'image');

        const companyEmail = findCompany?.email;
        const companyName = findCompany?.company ?? 'NoReply';
        const leadEmail = answers?.email;
    
        await useLead(companyEmail, answers);
        await emailLead(companyName, leadEmail);
        await emailCompany(answers, companyEmail, imagePart);
        
        return { status: 'success' };
        } catch (error) {
        if (error instanceof Error) {
            console.error('Validation Details:', JSON.stringify(error.cause, null, 2));
        } else {
            console.log("An unknown error occurred");
        }
        throw error;
    }
});