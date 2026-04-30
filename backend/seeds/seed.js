const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

dotenv.config();

// Default demo products
const products = [
    {
        name: "Nova X Pro Smartphone",
        slug: "nova-x-pro-smartphone",
        description: "The ultimate 5G smartphone with a 120Hz display and advanced camera system.",
        price: 899.99,
        stock: 50,
        category: "Electronics",
        images: []
    },
    {
        name: "ErgoComfort Office Chair",
        slug: "ergocomfort-office-chair",
        description: "Premium ergonomic chair for long gaming or working sessions.",
        price: 249.99,
        stock: 30,
        category: "Furniture",
        images: []
    },
    {
        name: "Neon Lights Mechanical Keyboard",
        slug: "neon-lights-mechanical-keyboard",
        description: "RGB backlit mechanical keyboard with tactile switches.",
        price: 129.99,
        stock: 100,
        category: "Electronics",
        images: []
    },
    {
        name: "CyberPunk Edge Jacket",
        slug: "cyberpunk-edge-jacket",
        description: "Stylish futuristic jacket with glowing accents.",
        price: 189.50,
        stock: 20,
        category: "Clothing",
        images: []
    },
    {
        name: "Quantum Noise-Cancelling Headphones",
        slug: "quantum-noise-cancelling-headphones",
        description: "Immersive audio experience with active noise cancellation.",
        price: 199.99,
        stock: 45,
        category: "Electronics",
        images: []
    }
];

const importData = async () => {
    try {
        await connectDB();

        await Admin.deleteMany();
        await Product.deleteMany();
        await Coupon.deleteMany();

        // Create Admin
        await Admin.create({
            name: 'Nova Admin',
            email: 'admin@novamart.com',
            passwordHash: 'admin123',
            role: 'admin'
        });

        // Create Products
        await Product.insertMany(products);

        // Create Coupons
        await Coupon.create({
            code: 'WELCOME10',
            discountPercent: 10,
            usesRemaining: 1000
        });
        
        await Coupon.create({
            code: 'NOVA20',
            discountPercent: 20,
            usesRemaining: 50
        });

        console.log('Data Imported successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error with data import: ${error}`);
        process.exit(1);
    }
};

importData();
