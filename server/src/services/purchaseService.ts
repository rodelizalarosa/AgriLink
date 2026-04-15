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

export const getBuyerOrders = async (buyerId: number) => {
    const [rows] = await db.execute(
        `SELECT pt.*, p.p_name, p.p_price, u.first_name as farmer_first, u.last_name as farmer_last, p.p_image 
     FROM purchase_table pt
     JOIN product_table p ON pt.product_id = p.p_id
     JOIN users_table u ON p.u_id = u.id
     WHERE pt.buyer_id = ?
     ORDER BY pt.req_date DESC`,
        [buyerId]
    );
    return rows;
};

export const updateOrderStatus = async (reqId: number, status: string, uId: number, notificationService: any) => {
    // Ensure the product belongs to the farmer and get current context
    const [rows]: any = await db.execute(
        `SELECT pt.req_status, pt.quantity, pt.product_id, pt.buyer_id, p.p_name, p.u_id as farmer_id 
         FROM purchase_table pt 
         JOIN product_table p ON pt.product_id = p.p_id 
         WHERE pt.req_id = ?`,
        [reqId]
    );

    const order = rows[0];
    if (!order || order.farmer_id !== uId) {
        throw new Error('Unauthorized or order not found.');
    }

    const previousStatus = order.req_status;

    // 1. If moving to "Confirmed" and was "Pending", deduct quantity
    if (status === 'Confirmed' && previousStatus === 'Pending') {
        const [updateRes]: any = await db.execute(
            'UPDATE product_table SET p_quantity = p_quantity - ? WHERE p_id = ? AND p_quantity >= ?',
            [order.quantity, order.product_id, order.quantity]
        );
        if (updateRes.affectedRows === 0) {
            throw new Error('Insufficient stock to confirm this order.');
        }
    }

    // 2. Update the order status
    await db.execute('UPDATE purchase_table SET req_status = ? WHERE req_id = ?', [status, reqId]);

    // 3. Notify the buyer
    try {
        await notificationService.createNotification(
            order.buyer_id,
            `Order ${status}`,
            `Farmer has updated your order for ${order.p_name} to "${status}".`,
            'order',
            '/buyer/orders'
        );
    } catch (e) {
        console.error('[purchase] notify buyer failed', e);
    }
};

export const cancelPurchase = async (reqId: number, uId: number, role: string) => {
    // Check if the order exists and if the user is authorized
    const [rows]: any = await db.execute(
        `SELECT pt.*, p.u_id as farmer_id 
         FROM purchase_table pt 
         JOIN product_table p ON pt.product_id = p.p_id 
         WHERE pt.req_id = ?`,
        [reqId]
    );

    const order = rows[0];
    if (!order) throw new Error('Order not found.');

    const isFarmer = role === 'farmer' && order.farmer_id === uId;
    const isBuyer = role === 'buyer' && order.buyer_id === uId;

    if (!isFarmer && !isBuyer && role !== 'admin') {
        throw new Error('Unauthorized.');
    }

    // If order was confirmed/completed, we might need to restore stock? 
    // For now, only allow cancellation of 'Pending' or 'Confirmed' if not yet 'Delivered'
    if (order.req_status === 'Delivered' || order.req_status === 'Completed') {
        throw new Error('Cannot cancel a completed transaction.');
    }

    // Restore stock if it was confirmed
    if (order.req_status === 'Confirmed' || order.req_status === 'Processing') {
        await db.execute(
            'UPDATE product_table SET p_quantity = p_quantity + ? WHERE p_id = ?',
            [order.quantity, order.product_id]
        );
    }

    // Delete or Update to "Cancelled"
    // The user said "remove this one", but "CANCEL functionality" implies status change or delete.
    // Usually P2P apps just delete or mark Cancelled. I'll mark as Cancelled.
    await db.execute('UPDATE purchase_table SET req_status = "Cancelled" WHERE req_id = ?', [reqId]);
    return true;
};

export const deletePurchase = async (reqId: number) => {
    await db.execute('DELETE FROM purchase_table WHERE req_id = ?', [reqId]);
};

export const removeCancelledOrder = async (reqId: number, uId: number, role: string) => {
    const [rows]: any = await db.execute(
        `SELECT pt.req_id, pt.req_status, pt.buyer_id, p.u_id as farmer_id
         FROM purchase_table pt
         JOIN product_table p ON pt.product_id = p.p_id
         WHERE pt.req_id = ?`,
        [reqId]
    );

    const order = rows[0];
    if (!order) throw new Error('Order not found.');

    const isFarmerOwner = role === 'farmer' && Number(order.farmer_id) === Number(uId);
    const isBuyerOwner = role === 'buyer' && Number(order.buyer_id) === Number(uId);
    const isAdmin = role === 'admin';

    if (!isFarmerOwner && !isBuyerOwner && !isAdmin) {
        throw new Error('Unauthorized.');
    }

    const normalizedStatus = String(order.req_status || '').trim().toLowerCase();
    if (!normalizedStatus.includes('cancel')) {
        throw new Error('Only cancelled orders can be removed.');
    }

    await db.execute('DELETE FROM purchase_table WHERE req_id = ?', [reqId]);
    return true;
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

/** Product + farmer for notifying on new purchase request */
export const getProductForOrderNotify = async (productId: number) => {
    const [rows]: any = await db.execute(
        'SELECT p_name, u_id AS farmer_id FROM product_table WHERE p_id = ?',
        [productId]
    );
    return rows[0] || null;
};

/** Buyer + product name for notifying buyer on status change */
export const getOrderNotifyContext = async (reqId: number) => {
    const [rows]: any = await db.execute(
        `SELECT pt.buyer_id, p.p_name
         FROM purchase_table pt
         JOIN product_table p ON pt.product_id = p.p_id
         WHERE pt.req_id = ?`,
        [reqId]
    );
    return rows[0] || null;
};
