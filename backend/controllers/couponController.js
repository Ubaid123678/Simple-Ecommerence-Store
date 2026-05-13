const Coupon = require('../models/Coupon');

const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({ code, isActive: true });

        if (!coupon) {
            return res.status(404).json({ message: 'Invalid or inactive coupon' });
        }

        if (coupon.usesRemaining <= 0) {
            return res.status(400).json({ message: 'Coupon usage limit reached' });
        }

        if (coupon.expiresAt && new Date() > coupon.expiresAt) {
            return res.status(400).json({ message: 'Coupon has expired' });
        }

        res.json({
            code: coupon.code,
            discountPercent: coupon.discountPercent
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Get all coupons
const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({}).sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Create coupon
const createCoupon = async (req, res) => {
    try {
        const { code, discountPercent, usesRemaining, expiresAt } = req.body;
        
        const existing = await Coupon.findOne({ code });
        if (existing) {
            return res.status(400).json({ message: 'Coupon code already exists' });
        }

        const coupon = await Coupon.create({
            code,
            discountPercent,
            usesRemaining,
            expiresAt: expiresAt ? new Date(expiresAt) : null
        });

        res.status(201).json(coupon);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Update coupon
const updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const { code, discountPercent, usesRemaining, expiresAt, isActive } = req.body;

        const coupon = await Coupon.findById(id);
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        coupon.code = code || coupon.code;
        coupon.discountPercent = discountPercent || coupon.discountPercent;
        coupon.usesRemaining = usesRemaining ?? coupon.usesRemaining;
        coupon.expiresAt = expiresAt ? new Date(expiresAt) : coupon.expiresAt;
        if (isActive !== undefined) coupon.isActive = isActive;

        await coupon.save();
        res.json(coupon);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Delete coupon
const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const coupon = await Coupon.findByIdAndDelete(id);
        
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        res.json({ message: 'Coupon deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { validateCoupon, getAllCoupons, createCoupon, updateCoupon, deleteCoupon };
