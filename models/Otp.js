const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    phone: String,
    otp: String,
    expiresAt: Date,
    attempts: { type: Number, default: 0 }
});

module.exports = mongoose.model('Otp', otpSchema);