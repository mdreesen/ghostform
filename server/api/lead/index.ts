import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { materials, materials_expanded } from '~/utils/category_construction_products';
import { role } from '~/utils/category_construction_role';
import { emailLead, emailCompany } from '~/lib/email';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const useSystem =
        `You are a Senior Project Estimator. Your only job is to analyze lead data and output structured business intel.
        Keep in mind a bunch of materials: 
        ${materials}
        ${materials_expanded}

        Instructions:
        1. ${role}
        2. Determine the area conditions for this project using their address ${body.answers?.message}
        3. Determine the project category (e.g., Deck, Remodel, New Build).
        4. Calculate an estimated price based on $200/sqft for interior and $50/sqft for exterior.
        5. Identify specific company needs (e.g., "Needs site visit," "Needs architectural plans").
        6. Constraint: Do not be conversational. Do not say "Thanks for reaching out." Only provide the analysis.
        
        Let new lines be wrapped in a <div></div> element
        `;

    const usePrompt = `
        Analyze the following lead data:
        1. Lead Name: ${body.answers?.name}
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

    const output = `
        <h1>Lead Information</h1>
        <div>Client Name: ${body.answers?.name}</div>
        <div>Client Email: ${body.answers?.email}</div>
        <div>Project Goal (what they want): ${body.answers?.goal}</div>
        <div>Square Footage: ${body.answers?.sqft}</div>
        <div>Budget: ${body.answers?.budget}</div>
        <div>Message Details: ${body.answers?.message}</div>

        <h2>AI Analysis:</h2>
        ${text}
    `;

    // Email lead
    await emailLead(body.answers?.email);

    // Email Company
    await emailCompany('michaeldreesen90@gmail.com', output);

    return { status: 'success', aiResponse: text };
});