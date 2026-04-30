const Order = require('../models/Order');

const addOrderItems = async (req, res) => {
    try {
        const { orderItems, shippingAddress, subtotal, discount, total, couponCode } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = new Order({
            userId: req.user._id,
            items: orderItems,
            shippingAddress,
            subtotal,
            discount,
            total,
            couponCode
        });

        const createdOrder = await order.save();

        // Socket.IO event: Notify admins of new order
        const io = req.app.get('io');
        if (io) {
            io.to('adminRoom').emit('newOrder', createdOrder);
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('userId', 'name email');
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { addOrderItems, getMyOrders, getOrderById };
