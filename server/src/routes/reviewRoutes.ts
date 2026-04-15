import { Router } from 'express';
import { reviewController } from '../controllers/reviewController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/:productId', reviewController.getReviews);
router.post('/', authenticateToken, reviewController.addReview);

export default router;
