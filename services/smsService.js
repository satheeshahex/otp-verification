const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.sendSMS = async (phone, message) => {
    try {
        const res = await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE,
            to: phone
        });
        return res
    } catch (error) {
        return null
    }
};