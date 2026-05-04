const User = require('../models/User');
const Otp = require('../models/Otp');
const jwt = require('jsonwebtoken');
const { generateOTP, hashOTP } = require('../services/otpService');
const { sendSMS } = require('../services/smsService');
const { verifyOtpSchema } = require('../utils/validation');

const { sendOtpSchema } = require('../utils/validation');

exports.sendOtp = async (req, res) => {
    try {
        const { error, value } = sendOtpSchema.validate(req.body);

        if (error) {
            const cleanMessage = error.details[0].message.replace(/["]/g, '');
            return res.status(400).json({
                message: cleanMessage
            });
        }

        const { phone } = value;

        const otp = generateOTP();
        const hashedOtp = hashOTP(otp);

        const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 min

        await Otp.findOneAndUpdate(
            { phone },
            { otp: hashedOtp, expiresAt, attempts: 0 },
            { upsert: true }
        );

        const twilio_otp = await sendSMS(phone, `Your OTP is ${otp}`);
        // If twilio otp fails to send OTP, return OTP in response for testing purposes
        const msg = 'SMS could not be sent. In trial mode, OTP works only for verified numbers. Using OTP from response for testing.';
        const response = { message: twilio_otp === null ? msg : 'OTP sent successfully', otp: twilio_otp === null ? otp : undefined }
        res.json(response);

    } catch (err) {
        console.log(err, 'erro.')
        res.status(500).json({
            error: 'SMS failed. OTP available for testing'
        });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { error, value } = verifyOtpSchema.validate(req.body);

        if (error) {
            const cleanMessage = error.details[0].message.replace(/["]/g, '');
            return res.status(400).json({
                message: cleanMessage
            });
        }

        const { phone, otp } = value;

        const record = await Otp.findOne({ phone });

        if (!record)
            return res.status(400).json({ message: 'No OTP found' });

        if (record.expiresAt < new Date())
            return res.status(400).json({ message: 'OTP expired' });

        if (record.attempts >= 3)
            return res.status(400).json({ message: 'Too many attempts' });

        const hashedOtp = hashOTP(otp);

        if (record.otp !== hashedOtp) {
            record.attempts += 1;
            await record.save();
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        let user = await User.findOne({ phone });

        if (!user) {
            user = await User.create({ phone, isVerified: true });
        } else {
            user.isVerified = true;
            await user.save();
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        await Otp.deleteOne({ phone });

        res.json({ token, verified: true });

    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};