import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { analyze_lead } from '~/utils/analyze/lead';
import { use_ai_category_role } from '~/utils/prompts/roleAi';
import type { LeadAndCompany } from '~/types/user';
import { useLeadEmailFormatting, useCompanyEmailFormatting } from '~/utils/email/useEmailFormatting';

export async function aiClient(data: LeadAndCompany) {
    return `
    <div>Thank you for your inquery.</div>
    <div>We will get back to you shortly</>
    `
};

export async function aiCompany(data: LeadAndCompany) {
    const useLeadAnalysis = analyze_lead(data);
    const useRole = use_ai_category_role(data);

    const { text } = await generateText({
        model: openai('gpt-4o-mini'),
        system: useRole,
        messages: data?.imagePart?.data ? [
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

    const aiOutput = useCompanyEmailFormatting(data, text);

    return aiOutput
};