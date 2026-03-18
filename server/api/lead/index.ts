import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { emailLead, emailCompany } from '~/lib/email';
import { construction_role } from '~/utils/prompts/category_role';
import { analyze_lead } from '~/utils/analyze/lead';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const formData = await readMultipartFormData(event);

    const useRole = construction_role(body.answers?.address);
    const useLeadAnalysis = analyze_lead(body.answers);

    console.log('formData', formData);
    console.log('body', body)

    // const imageFile = formData?.find((item) => item.name === 'image');

    const { text } = await generateText({
        model: openai('gpt-5.3-chat-latest'),
        system: useRole,
        prompt: useLeadAnalysis,
        // messages: [
        //     {
        //       role: 'user',
        //       content: [
        //         { type: 'text', text: `${useLeadAnalysis}` },
        //         { 
        //           type: 'image', 
        //           image: imageFile, // Buffer or Uint8Array
        //           mediaType: 'image/jpeg' 
        //         }
        //       ]
        //     }
        //   ]
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

    if (!body.answers?.email) throw createError({ statusCode: 400, message: 'Missing data' });

    // Email lead
    await emailLead(body.answers);

    // Email Company
    await emailCompany(output);

    return { status: 'success', aiResponse: text };
});