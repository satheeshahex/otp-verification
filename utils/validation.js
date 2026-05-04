const Joi = require('joi');



exports.sendOtpSchema = Joi.object({
    phone: Joi.string()
        .pattern(/^\+\d{10,15}$/)
        .required()
        .messages({
            'string.empty': 'Phone number is required',
            'string.pattern.base': 'Phone must be in international format (+919876543210)'
        })
});
exports.verifyOtpSchema = Joi.object({
    phone: Joi.string()
        .pattern(/^\+\d{10,15}$/)
        .required()
        .messages({
            'string.pattern.base': 'Phone must be in international format (+91...)'
        }),

    otp: Joi.string()
        .length(6)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
            'string.length': 'OTP must be 6 digits',
            'string.pattern.base': 'OTP must be numeric'
        })
});