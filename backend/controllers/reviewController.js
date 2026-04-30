const Review = require('../models/Review');
const Product = require('../models/Product');

const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.id;

        const alreadyReviewed = await Review.findOne({
            userId: req.user._id,
            productId: productId
        });

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Product already reviewed' });
        }

        const review = await Review.create({
            userId: req.user._id,
            productId,
            rating: Number(rating),
            comment
        });

        // Update product rating and numReviews
        const reviews = await Review.find({ productId });
        const numReviews = reviews.length;
        const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
        const newRating = totalRating / numReviews;

        await Product.findByIdAndUpdate(productId, { rating: newRating, numReviews });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.id }).populate('userId', 'name');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { addReview, getProductReviews };
