export async function sms() {
    console.log('Hooked Up SMS');

    try {
        const accountSid = process.env.TWILIO_SID;
        const authToken = process.env.TWILIO_TOKEN;
        const client = require('twilio')(accountSid, authToken);
        client.messages
            .create({
                body: 'Ahoy 👋',
                messagingServiceSid: process.env.TWILIO_SERVICE_SID,
                to: '+18777804236'
            })
            .then((message: { sid: any; }) => console.log(message.sid));
    } catch (error) {
        console.log(error);
    }
}