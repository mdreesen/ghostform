import { emailLead, emailCompany } from '~/lib/email';
import { sms } from '~/lib/sms';
import type { Lead, Company } from '~/types/user';
import { leadData } from '~/utils/users/lead';
import { companyData } from '~/utils/users/company';
import { aiClient, aiCompany } from '~/lib/ai';

export default defineEventHandler(async (event) => {

    try {
        const formData = await readMultipartFormData(event);

        const answersPart = formData?.find(item => item.name === 'answers');
        const companyPart = formData?.find(item => item.name === 'company');

        let answers: Lead = leadData;
        let company: Company = companyData;

        if (answersPart) {
            const jsonString = answersPart.data.toString('utf-8');
            answers = JSON.parse(jsonString);
        };
        if (companyPart) {
            const jsonString = companyPart.data.toString('utf-8');
            company = JSON.parse(jsonString);
        };

        const imagePart = formData?.find((item) => item.name === 'image');

        const useAiClient = await aiClient({ ...answers, ...company })
        const useAiCompany = await aiCompany({ ...imagePart, ...answers, ...company })

        if (!answers?.email) throw createError({ statusCode: 400, message: 'Missing data' });

        // // Email lead
        await emailLead(useAiClient, answers);

        // // Email Company
        await emailCompany(useAiCompany, company);

        // await sms();

        return { status: 'success', aiResponse: useAiCompany };
        } catch (error) {
        if (error instanceof Error) {
            console.error('Validation Details:', JSON.stringify(error.cause, null, 2));
        } else {
            console.log("An unknown error occurred");
        }
        throw error;
    }
});