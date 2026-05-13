const express = require('express');
const router = express.Router();
const { getProducts, getProductById, getAllProducts } = require('../controllers/productController');
const { addReview, getProductReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getProducts);

router.route('/all')
    .get(getAllProducts);

router.route('/:id')
    .get(getProductById);

router.route('/:id/reviews')
    .post(protect, addReview)
    .get(getProductReviews);

module.exports = router;
