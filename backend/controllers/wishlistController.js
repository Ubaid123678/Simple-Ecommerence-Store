const Wishlist = require('../models/Wishlist');

const getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ userId: req.user._id }).populate('products');
        if (!wishlist) {
            wishlist = await Wishlist.create({ userId: req.user._id, products: [] });
        }
        res.json(wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        let wishlist = await Wishlist.findOne({ userId: req.user._id });
        
        if (!wishlist) {
            wishlist = new Wishlist({ userId: req.user._id, products: [productId] });
        } else if (!wishlist.products.includes(productId)) {
            wishlist.products.push(productId);
        }

        await wishlist.save();
        res.status(201).json(wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ userId: req.user._id });
        if (wishlist) {
            wishlist.products = wishlist.products.filter(id => id.toString() !== req.params.id);
            await wishlist.save();
            res.json(wishlist);
        } else {
            res.status(404).json({ message: 'Wishlist not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
