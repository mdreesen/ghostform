// server/api/ghost-form.post.ts
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { materials, materials_expanded } from '~/utils/category_construction_products';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const useSystem =
        `You are a Senior Project Estimator. Your only job is to analyze lead data and output structured business intel.
        Keep in mind a bunch of materials: 
        ${materials}
        ${materials_expanded}

        Instructions:
        1. Determine the project category (e.g., Deck, Remodel, New Build).
        2. Calculate an estimated price based on $200/sqft for interior and $50/sqft for exterior.
        3. Identify specific company needs (e.g., "Needs site visit," "Needs architectural plans").
        4. Constraint: Do not be conversational. Do not say "Thanks for reaching out." Only provide the analysis.`;

    const usePrompt = `
        Analyze the following lead data:
        1. Client Name: ${body.answers?.name}
        2. Project Goal: ${body.answers?.goal}
        3. Approximate Square Footage: ${body.answers?.sqft}
        4. Budget Provided: ${body.answers?.budget}
        5. Message Provided: ${body.answers?.message}
        `;

    const { text } = await generateText({
        model: openai('gpt-5.3-chat-latest'),
        system: useSystem,
        prompt: usePrompt
    });

    // 3. Log or send the response (e.g., to an email or DB)
    console.log('AI Analysis:', text);

    return { status: 'success', aiResponse: text };
});