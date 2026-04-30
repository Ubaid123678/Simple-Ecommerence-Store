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

module.exports = { validateCoupon };
