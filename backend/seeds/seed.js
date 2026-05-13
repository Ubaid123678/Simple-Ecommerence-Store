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
    },
    {
        name: "TrailBlazer Hiking Backpack",
        slug: "trailblazer-hiking-backpack",
        description: "Water-resistant 40L backpack perfect for weekend adventures.",
        price: 79.99,
        stock: 60,
        category: "Sports",
        images: []
    },
    {
        name: "CeramicPro Smart Coffee Maker",
        slug: "ceramicpro-smart-coffee-maker",
        description: "App-controlled coffee machine with built-in grinder.",
        price: 299.99,
        stock: 25,
        category: "Home & Garden",
        images: []
    },
    {
        name: "VelvetTouch Yoga Mat",
        slug: "velvettouch-yoga-mat",
        description: "Extra thick eco-friendly yoga mat with carrying strap.",
        price: 49.99,
        stock: 120,
        category: "Sports",
        images: []
    },
    {
        name: "TechMaster USB-C Hub",
        slug: "techmaster-usb-c-hub",
        description: "7-in-1 hub with HDMI, USB 3.0, and SD card reader.",
        price: 59.99,
        stock: 200,
        category: "Electronics",
        images: []
    },
    {
        name: "Artisan Coffee Beans Gift Box",
        slug: "artisan-coffee-beans-gift-box",
        description: "Premium roasted coffee beans from 3 different countries.",
        price: 44.99,
        stock: 80,
        category: "Food & Beverage",
        images: []
    },
    {
        name: "LuxeCashmere Winter Scarf",
        slug: "luxecashmere-winter-scarf",
        description: "Ultra-soft cashmere scarf in classic herringbone pattern.",
        price: 129.99,
        stock: 35,
        category: "Clothing",
        images: []
    },
    {
        name: "BioGlow Skincare Set",
        slug: "bioglow-skincare-set",
        description: "Complete 5-step skincare routine with natural ingredients.",
        price: 89.99,
        stock: 50,
        category: "Health & Beauty",
        images: []
    },
    {
        name: "GravityFit Resistance Bands",
        slug: "gravityfit-resistance-bands",
        description: "Set of 5 resistance bands with door anchor and handles.",
        price: 34.99,
        stock: 150,
        category: "Sports",
        images: []
    },
    {
        name: "MiniMakers 3D Puzzle Kit",
        slug: "minimakers-3d-puzzle-kit",
        description: "Educational 3D puzzle set for kids ages 8+.",
        price: 24.99,
        stock: 90,
        category: "Toys & Games",
        images: []
    },
    {
        name: "CloudSleep Memory Foam Pillow",
        slug: "cloudsleep-memory-foam-pillow",
        description: "Ergonomic pillow with cooling gel-infused memory foam.",
        price: 59.99,
        stock: 75,
        category: "Home & Garden",
        images: []
    },
    {
        name: "CodeCraft Programming Guide",
        slug: "codecraft-programming-guide",
        description: "Comprehensive guide to modern web development.",
        price: 49.99,
        stock: 40,
        category: "Books",
        images: []
    },
    {
        name: "FlexRun Athletic Sneakers",
        slug: "flexrun-athletic-sneakers",
        description: "Lightweight running shoes with responsive cushioning.",
        price: 119.99,
        stock: 65,
        category: "Clothing",
        images: []
    },
    {
        name: "ZenAroma Essential Oils",
        slug: "zenaroma-essential-oils",
        description: "Collection of 12 pure essential oils for aromatherapy.",
        price: 39.99,
        stock: 100,
        category: "Health & Beauty",
        images: []
    },
    {
        name: "NightOwl LED Desk Lamp",
        slug: "nightowl-led-desk-lamp",
        description: "Adjustable LED lamp with 5 brightness levels and USB port.",
        price: 45.99,
        stock: 85,
        category: "Home & Garden",
        images: []
    },
    {
        name: "RetroArcade Game Console",
        slug: "retroarcade-game-console",
        description: "Classic arcade games with HD output and 2 controllers.",
        price: 149.99,
        stock: 30,
        category: "Toys & Games",
        images: []
    },
    {
        name: "AquaPure Water Filter Pitcher",
        slug: "aquapure-water-filter-pitcher",
        description: "5-stage filtration system removes 99% of contaminants.",
        price: 29.99,
        stock: 110,
        category: "Home & Garden",
        images: []
    },
    {
        name: "PeakPerform Protein Powder",
        slug: "peakperform-protein-powder",
        description: "Vegan protein supplement with 25g protein per serving.",
        price: 54.99,
        stock: 70,
        category: "Health & Beauty",
        images: []
    },
    {
        name: "SoundScape Portable Speaker",
        slug: "soundscape-portable-speaker",
        description: "Waterproof Bluetooth speaker with 20-hour battery life.",
        price: 79.99,
        stock: 95,
        category: "Electronics",
        images: []
    },
    {
        name: "CraftMaster Cross-Stitch Kit",
        slug: "craftmaster-cross-stitch-kit",
        description: "Complete kit with patterns, threads, and needles.",
        price: 22.99,
        stock: 55,
        category: "Toys & Games",
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
