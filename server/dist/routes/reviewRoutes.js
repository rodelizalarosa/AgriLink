"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviewController_1 = require("../controllers/reviewController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/:productId', reviewController_1.reviewController.getReviews);
router.post('/', authMiddleware_1.authenticateToken, reviewController_1.reviewController.addReview);
exports.default = router;
