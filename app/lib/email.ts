import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { Resend } from 'resend';
import type { Lead } from '~/types/lead';

export async function emailLead(data: Lead) {
    try {
        const resend = new Resend(`${process.env.RESEND_KEY}`);
        console.log('emailing: Send email');

        // 1. Generate the AI Response for the Lead
        const { text } = await generateText({
            model: openai('gpt-4o-mini'),
            system: `You are an assistant for a Construction Company. 
             Be professional and helpful`,
            prompt: `A new lead named ${data?.name}. 
             Write a 3-sentence email thanking them, 
             mentioning one specific detail you see in the message, 
             and telling them a human will call them shortly.
             
            Let new lines be wrapped in a <div></div> element
            `,
            // experimental_attachments: [{ url: `data:${file.type};base64,${file.data.toString('base64')}`, name: 'project.jpg' }]
        });

        await resend.emails.send({
            from: 'NoReply@ascendpod.com',
            to: [data?.email],
            // to: ['michaeldreesen90@gmail.com', 'josiah@westernrockiesconstruction.com'],
            subject: "Your Job Inquiry", // Subject line
            html: text
        });
        console.log('emailing: Email sent to lead');

    } catch (error) {
        console.log(error);
        throw createError({
            statusCode: 401,
            message: 'Please try again'
        });
    };
};

export async function emailCompany(body: string) {

    try {
        const resend = new Resend(`${process.env.RESEND_KEY}`);

        await resend.emails.send({
            from: 'NoReply@ascendpod.com',
            // to: ['michaeldreesen90@gmail.com', 'josiah@westernrockiesconstruction.com'],
            to: ['michaeldreesen90@gmail.com'],
            subject: "Your Lead Inquiry", // Subject line
            html: body,
            // attachments: [
            //     {
            //       filename: file.filename || 'site-photo.jpg',
            //       content: file.data // Resend accepts the Buffer directly!
            //     }
            //   ]
        });
    } catch (error) {
        console.log(error);
        throw createError({
            statusCode: 401,
            message: 'Please try again'
        });
    };
};