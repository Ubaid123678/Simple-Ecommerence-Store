const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
        if (!cart) {
            cart = await Cart.create({ userId: req.user._id, items: [] });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        let cart = await Cart.findOne({ userId: req.user._id });
        
        if (!cart) {
            cart = new Cart({ userId: req.user._id, items: [{ productId, quantity }] });
        } else {
            const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ productId, quantity });
            }
        }
        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await Cart.findOne({ userId: req.user._id });
        if (cart) {
            const itemIndex = cart.items.findIndex(p => p._id.toString() === req.params.id);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity = quantity;
                await cart.save();
                res.json(cart);
            } else {
                res.status(404).json({ message: 'Item not found in cart' });
            }
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        if (cart) {
            cart.items = cart.items.filter(p => p._id.toString() !== req.params.id);
            await cart.save();
            res.json(cart);
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
