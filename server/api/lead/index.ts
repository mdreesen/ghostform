import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { emailLead, emailCompany } from '~/lib/email';
import { construction_role } from '~/utils/prompts/category_role';
import { analyze_lead } from '~/utils/analyze/lead';
import type { Lead } from '~/types/lead';
import { leadData } from '~/utils/lead/lead-data';

export default defineEventHandler(async (event) => {
    const formData = await readMultipartFormData(event);

    const answersPart = formData?.find(item => item.name === 'answers');

    let answers: Lead = leadData;
    if (answersPart) {
        const jsonString = answersPart.data.toString('utf-8');
        answers = JSON.parse(jsonString);
    }

    const imagePart = formData?.find(item => item.name === 'image');

    const useRole = construction_role(answers?.address);
    const useLeadAnalysis = analyze_lead(answers);

    const { text } = await generateText({
        model: openai('gpt-5.3-chat-latest'),
        system: useRole,
        messages: [
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: useLeadAnalysis
                    },
                    {
                        type: 'image',
                        image: imagePart?.data, // This is your <Buffer ...>
                        mediaType: imagePart?.type // 'image/jpeg'
                    }
                ],
            },
        ],
    });

    const output = `
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
    await emailLead(answers);

    // // Email Company
    await emailCompany(output);

    return { status: 'success', aiResponse: text };
});