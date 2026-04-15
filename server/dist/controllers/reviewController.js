"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewController = void 0;
const reviewService_1 = require("../services/reviewService");
exports.reviewController = {
    getReviews: async (req, res) => {
        try {
            const productId = parseInt(req.params.productId);
            const reviews = await reviewService_1.reviewService.getReviewsByProductId(productId);
            const stats = await reviewService_1.reviewService.getAverageRating(productId);
            res.json({ reviews, stats });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    addReview: async (req, res) => {
        try {
            const userId = req.user.id;
            const { productId, rating, comment } = req.body;
            await reviewService_1.reviewService.addReview(userId, productId, rating, comment);
            res.status(201).json({ message: 'Review added' });
        }
        catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'You have already reviewed this product' });
            }
            res.status(500).json({ message: error.message });
        }
    }
};
