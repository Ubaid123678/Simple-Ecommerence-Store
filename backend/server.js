const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const socketHandler = require('./sockets/socketHandler');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
    cors: {
        origin: '*', // For development
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});
socketHandler(io);

// Make io accessible in routes/controllers
app.set('io', io);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static folders
app.use('/uploads', express.static('uploads'));
app.use('/', express.static(path.join(__dirname, '..', 'frontend')));
app.use('/admin', express.static(path.join(__dirname, '..', 'admin-panel')));

// Routes (to be added)
app.get('/api/health', (req, res) => {
    res.json({ status: 'API is running' });
});

// We will mount routes here
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
