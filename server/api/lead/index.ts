import { generateText, convertToModelMessages } from 'ai';
import { openai } from '@ai-sdk/openai';
import { emailLead, emailCompany } from '~/lib/email';
import { sms } from '~/lib/sms';
import { construction_role } from '~/utils/prompts/category_role';
import { analyze_lead } from '~/utils/analyze/lead';
import type { Lead } from '~/types/user';
import { leadData } from '~/utils/users/lead';
import { companyData } from '~/utils/users/company';

export default defineEventHandler(async (event) => {

    try {
        const formData = await readMultipartFormData(event);

        const answersPart = formData?.find(item => item.name === 'answers');
        const companyPart = formData?.find(item => item.name === 'company');

        let answers: Lead = leadData;
        let company = companyData;

        if (answersPart) {
            const jsonString = answersPart.data.toString('utf-8');
            answers = JSON.parse(jsonString);
        };
        if (companyPart) {
            const jsonString = companyPart.data.toString('utf-8');
            company = JSON.parse(jsonString);
        };

        console.log(formData);
        console.log(answers?.address);
        console.log(company?.category);
        const imagePart = formData?.find(item => item.name === 'image') ?? {};

        const useRole = construction_role(answers?.address);
        const useLeadAnalysis = analyze_lead(answers);

        const { text: leadText } = await generateText({
            model: openai('gpt-4o-mini'),
            system: `You are an assistant for a Construction Company. 
             Be professional and helpful`,
            prompt: `A new lead named ${answers?.name}. 
             Write a 3-sentence email thanking them, 
             mentioning one specific detail you see in the message, 
             and telling them a human will call them shortly.
             
            Let new lines be wrapped in a <div></div> element
            `,
        });

        const { text } = await generateText({
            model: openai('gpt-4o'),
            system: useRole,
            messages: imagePart?.data ? [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: useLeadAnalysis
                        },
                        {
                            type: 'image',
                            image: new Uint8Array(imagePart.data),
                            mediaType: imagePart.type || 'image/jpeg'
                        }
                    ],
                },
            ] : [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: useLeadAnalysis
                        },
                    ],
                },
            ],
        });

        const aiOutput = `
            <h1>Lead Information</h1>
            <div>Lead Name: ${answers?.name}</div>
            <div>Lead Email: ${answers?.email}</div>
            <div>Project Goal: ${answers?.goal}</div>
            <div>Square Footage: ${answers?.sqft}</div>
            <div>Budget: ${answers?.budget}</div>
            <div>Message Details: ${answers?.message}</div>
    
            <h2>AI Analysis:</h2>
            ${text}
        `;

        if (!answers?.email) throw createError({ statusCode: 400, message: 'Missing data' });

        // // Email lead
        await emailLead(leadText, answers);

        // // Email Company
        await emailCompany(aiOutput, company);

        // await sms();

        return { status: 'success', aiResponse: text };
    } catch (error) {
        console.error('Validation Details:', JSON.stringify(error.cause, null, 2));
        throw error;
    }

});