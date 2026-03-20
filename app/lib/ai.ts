import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { analyze_lead } from '~/utils/analyze/lead';
import { construction_role } from '~/utils/prompts/category_role';
import type { LeadAndCompany } from '~/types/user';


export async function aiClient(data: LeadAndCompany) {
    const { text } = await generateText({
        model: openai('gpt-4o-mini'),
        system: `You are an assistant for a Construction Company. 
         Be professional and helpful`,
        prompt: `A new lead named ${data?.name}. 
         Write a 3-sentence email thanking them, 
         mentioning one specific detail you see in the message, 
         and telling them a human will call them shortly.

        End the email with:
        Best regards,
        ${data?.company_name}
         
        Let new lines be wrapped in a <div></div> element
        `,
    });

    return text
};

export async function aiCompany(data: LeadAndCompany) {
    console.log(data.imagePart.data)
    const useLeadAnalysis = analyze_lead(data);
    const useRole = construction_role(data?.address);

    const { text } = await generateText({
        model: openai('gpt-4o-mini'),
        system: useRole,
        messages: data.imagePart?.data ? [
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: useLeadAnalysis
                    },
                    {
                        type: 'image',
                        image: new Uint8Array(data.imagePart.data),
                        mediaType: data.imagePart.type || 'image/jpeg'
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
    <div>Lead Name: ${data?.name}</div>
    <div>Lead Email: ${data?.email}</div>
    <div>Project Goal: ${data?.goal}</div>
    <div>Square Footage: ${data?.sqft}</div>
    <div>Budget: ${data?.budget}</div>
    <div>Message Details: ${data?.message}</div>

    <h2>AI Analysis:</h2>
    ${text}
`;

    return aiOutput
};