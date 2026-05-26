import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { analyze_lead } from '~/utils/analyze/lead';
import { use_ai_category_role } from '~/utils/prompts/roleAi';
import { useCompanyEmailFormatting } from '~/utils/email/useEmailFormatting';

export async function aiClient(data) {
    return `
    <div>Inquiry received.</div>
    <div>Thank you ${data.name}, a specialist is currently reviewing your specifications and will provide a status update shortly.</div>
    `
};

export async function aiCompany(imagePart, answers, findCompany) {
    const useLeadAnalysis = analyze_lead(answers);
    const useRole = use_ai_category_role(answers);

    const { text } = await generateText({
        model: openai('gpt-4o-mini'),
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

    const aiOutput = useCompanyEmailFormatting(answers, text);

    return aiOutput
};