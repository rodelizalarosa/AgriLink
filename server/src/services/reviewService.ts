import { db } from '../database/database';

export const reviewService = {
    getReviewsByProductId: async (productId: number) => {
        const [rows]: any = await db.query(
            `SELECT 
                r.*, 
                u.first_name, 
                u.last_name,
                u.city
             FROM product_reviews r
             JOIN users_table u ON r.user_id = u.id
             WHERE r.product_id = ?
             ORDER BY r.created_at DESC`,
            [productId]
        );
        return rows;
    },

    addReview: async (userId: number, productId: number, rating: number, comment: string) => {
        const [result] = await db.query(
            'INSERT INTO product_reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)',
            [userId, productId, rating, comment]
        );
        return result;
    },

    getAverageRating: async (productId: number) => {
        const [rows]: any = await db.query(
            'SELECT AVG(rating) as avgRating, COUNT(*) as reviewCount FROM product_reviews WHERE product_id = ?',
            [productId]
        );
        return rows[0] || { avgRating: 0, reviewCount: 0 };
    }
};
