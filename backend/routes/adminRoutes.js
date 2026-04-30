const express = require('express');
const router = express.Router();
const { 
    loginAdmin, getStats, createProduct, updateProduct, deleteProduct,
    getAllOrders, updateOrderStatus, getAllUsers
} = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/login', loginAdmin);
router.get('/stats', protectAdmin, getStats);

// Product routes
router.route('/products')
    .post(protectAdmin, upload.array('images', 5), createProduct);
router.route('/products/:id')
    .put(protectAdmin, upload.array('images', 5), updateProduct)
    .delete(protectAdmin, deleteProduct);

// Order routes
router.route('/orders')
    .get(protectAdmin, getAllOrders);
router.route('/orders/:id/status')
    .put(protectAdmin, updateOrderStatus);

// User routes
router.route('/users')
    .get(protectAdmin, getAllUsers);

module.exports = router;
