const Admin = require('../models/Admin');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const Coupon = require('../models/Coupon');
const jwt = require('jsonwebtoken');

const generateAdminToken = (id) => {
    return jwt.sign({ id }, process.env.ADMIN_JWT_SECRET, { expiresIn: '30d' });
};

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (admin && (await admin.matchPassword(password))) {
            res.json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                token: generateAdminToken(admin._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getStats = async (req, res) => {
    try {
        const totalSalesQuery = await Order.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]);
        const totalSales = totalSalesQuery[0] ? totalSalesQuery[0].total : 0;
        
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();

        res.json({ totalSales, totalOrders, totalProducts, totalUsers });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// --- Product Management ---
const createProduct = async (req, res) => {
    try {
        const { name, slug, description, price, stock, category } = req.body;
        const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

        const product = await Product.create({
            name, slug, description, price, stock, category, images
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, slug, description, price, stock, category, existingImages } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.slug = slug || product.slug;
            product.description = description || product.description;
            product.price = price || product.price;
            product.stock = stock || product.stock;
            product.category = category || product.category;
            
            let finalImages = existingImages ? JSON.parse(existingImages) : product.images;
            if (req.files && req.files.length > 0) {
                const newImages = req.files.map(file => `/uploads/${file.filename}`);
                finalImages = [...finalImages, ...newImages];
            }
            product.images = finalImages;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (product) {
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// --- Order Management ---
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('userId', 'id name').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = status;
            const updatedOrder = await order.save();

            // Socket.IO event: Notify specific customer that status changed
            const io = req.app.get('io');
            if (io) {
                // Emit to the user's room
                io.to(`user_${order.userId.toString()}`).emit('orderStatusUpdate', updatedOrder);
            }

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// --- User Management ---
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-passwordHash');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    loginAdmin, getStats, createProduct, updateProduct, deleteProduct,
    getAllOrders, updateOrderStatus, getAllUsers
};
