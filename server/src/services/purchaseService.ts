import { db } from '../database/database';

export const createPurchaseRequest = async (purchaseData: any) => {
    const { buyer_id, product_id, quantity } = purchaseData;
    const [result]: any = await db.execute(
        'INSERT INTO purchase_table (buyer_id, product_id, quantity, req_status) VALUES (?, ?, ?, "Pending")',
        [buyer_id, product_id, quantity]
    );
    return result.insertId;
};

export const getFarmerOrders = async (uId: number) => {
    const [rows] = await db.execute(
        `SELECT pt.*, p.p_name, p.p_price, u.first_name as buyer_first, u.last_name as buyer_last 
     FROM purchase_table pt
     JOIN product_table p ON pt.product_id = p.p_id
     JOIN users_table u ON pt.buyer_id = u.id
     WHERE p.u_id = ?
     ORDER BY pt.req_date DESC`,
        [uId]
    );
    return rows;
};

export const updateOrderStatus = async (reqId: number, status: string, uId: number) => {
    // Ensure the product belongs to the farmer
    const [owner]: any = await db.execute(
        'SELECT p.u_id FROM purchase_table pt JOIN product_table p ON pt.product_id = p.p_id WHERE pt.req_id = ?',
        [reqId]
    );

    if (!owner[0] || owner[0].u_id !== uId) {
        throw new Error('Unauthorized or order not found.');
    }

    await db.execute('UPDATE purchase_table SET req_status = ? WHERE req_id = ?', [status, reqId]);
};

export const getEarningSummary = async (uId: number) => {
    const [rows]: any = await db.execute(
        `SELECT SUM(pt.quantity * p.p_price) as total_earnings
     FROM purchase_table pt
     JOIN product_table p ON pt.product_id = p.p_id
     WHERE p.u_id = ? AND pt.req_status = "Completed"`,
        [uId]
    );
    return rows[0] || { total_earnings: 0 };
};
