import { Request, Response } from 'express';
import { reviewService } from '../services/reviewService';

export const reviewController = {
    getReviews: async (req: Request, res: Response) => {
        try {
            const productId = parseInt(req.params.productId as string);
            const reviews = await reviewService.getReviewsByProductId(productId);
            const stats = await reviewService.getAverageRating(productId);
            res.json({ reviews, stats });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    addReview: async (req: any, res: Response) => {
        try {
            const userId = req.user.id;
            const { productId, rating, comment } = req.body;
            await reviewService.addReview(userId, productId, rating, comment);
            res.status(201).json({ message: 'Review added' });
        } catch (error: any) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'You have already reviewed this product' });
            }
            res.status(500).json({ message: error.message });
        }
    }
};
