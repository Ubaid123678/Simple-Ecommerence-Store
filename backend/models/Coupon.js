const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discountPercent: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    usesRemaining: { type: Number, default: 100 },
    expiresAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
