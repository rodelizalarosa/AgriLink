"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewService = void 0;
const database_1 = require("../database/database");
exports.reviewService = {
    getReviewsByProductId: async (productId) => {
        const [rows] = await database_1.db.query(`SELECT 
                r.*, 
                u.first_name, 
                u.last_name,
                u.city
             FROM product_reviews r
             JOIN users_table u ON r.user_id = u.id
             WHERE r.product_id = ?
             ORDER BY r.created_at DESC`, [productId]);
        return rows;
    },
    addReview: async (userId, productId, rating, comment) => {
        const [result] = await database_1.db.query('INSERT INTO product_reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)', [userId, productId, rating, comment]);
        return result;
    },
    getAverageRating: async (productId) => {
        const [rows] = await database_1.db.query('SELECT AVG(rating) as avgRating, COUNT(*) as reviewCount FROM product_reviews WHERE product_id = ?', [productId]);
        return rows[0] || { avgRating: 0, reviewCount: 0 };
    }
};
