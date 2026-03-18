import { Resend } from 'resend';

const htmlBody_lead = `
<div>
    <h1>Thank you for your inquiry</h1>
    <p>We will get back to you shortly</p>
</div>
`;

export async function emailLead(email: string) {
    try {
        const resend = new Resend(`${process.env.RESEND_KEY}`);
        console.log('emailing: Send email')

        await resend.emails.send({
            from: 'NoReply@ascendpod.com',
            to: [email],
            subject: "Your Job Inquiry", // Subject line
            html: htmlBody_lead
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

export async function emailCompany(email: string, body: string) {
    try {
        const resend = new Resend(`${process.env.RESEND_KEY}`);

        await resend.emails.send({
            from: 'NoReply@ascendpod.com',
            to: ['michaeldreesen90@gmail.com'],
            subject: "Your Lead Inquiry", // Subject line
            html: body
        });
    } catch (error) {
        console.log(error);
        throw createError({
            statusCode: 401,
            message: 'Please try again'
        });
    };
};