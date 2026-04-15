import { db } from '../database/database';

export const getAllProducts = async () => {
    // 🚜 Enhanced Query: Fetches product data AND overall Farmer (Seller) averages
    // This ensures ratings persist even if individual product listings are archived/deleted.
    const [rows] = await db.execute(`
        SELECT p.*, c.cat_name, u.first_name, u.last_name, u.city,
               (SELECT AVG(rating) FROM product_reviews pr JOIN product_table pt ON pr.product_id = pt.p_id WHERE pt.u_id = p.u_id) as sellerAvgRating,
               (SELECT COUNT(rating) FROM product_reviews pr JOIN product_table pt ON pr.product_id = pt.p_id WHERE pt.u_id = p.u_id) as sellerReviewCount
        FROM product_table p
        LEFT JOIN product_category c ON p.p_category = c.cat_id
        LEFT JOIN users_table u ON p.u_id = u.id
        WHERE p.p_status = 'active'
    `);
    return rows;
};

export const getFarmerProducts = async (uId: number) => {
    const [rows] = await db.execute(
        `SELECT p.*, c.cat_name, u.first_name, u.last_name, u.city
     FROM product_table p
     LEFT JOIN product_category c ON p.p_category = c.cat_id
     LEFT JOIN users_table u ON p.u_id = u.id
     WHERE p.u_id = ?`,
        [uId]
    );
    return rows;
};

export const getProductById = async (pId: number) => {
    const [rows]: any = await db.execute(`
        SELECT p.*, c.cat_name, u.first_name, u.last_name, u.city,
               (SELECT AVG(rating) FROM product_reviews pr JOIN product_table pt ON pr.product_id = pt.p_id WHERE pt.u_id = p.u_id) as sellerAvgRating,
               (SELECT COUNT(rating) FROM product_reviews pr JOIN product_table pt ON pr.product_id = pt.p_id WHERE pt.u_id = p.u_id) as sellerReviewCount
        FROM product_table p
        LEFT JOIN product_category c ON p.p_category = c.cat_id
        LEFT JOIN users_table u ON p.u_id = u.id
        WHERE p.p_id = ?
    `, [pId]);
    return rows[0];
};

export const createProduct = async (productData: any) => {
    const { u_id, p_name, p_description, p_price, p_unit, p_quantity, p_category, p_image, harvest_date } = productData;

    if (!u_id) throw new Error('User identification is missing.');
    if (!p_name || p_name.trim() === '') throw new Error('Product name is required.');
    if (!p_category || isNaN(parseInt(p_category))) throw new Error('A valid product category is required.');
    if (!p_price || isNaN(parseFloat(p_price)) || parseFloat(p_price) <= 0) throw new Error('A valid positive price is required.');
    if (!p_quantity || isNaN(parseFloat(p_quantity)) || parseFloat(p_quantity) < 0) throw new Error('A valid quantity is required.');
    if (!p_unit || p_unit.trim() === '') throw new Error('Unit valuation (e.g., kg, kg, pc) is required.');
    if (!harvest_date) throw new Error('Harvest date is required.');

    const [existing]: any = await db.execute(
        'SELECT p_id FROM product_table WHERE u_id = ? AND p_name = ? AND p_status = "active"',
        [u_id, p_name]
    );

    if (existing.length > 0) {
        throw new Error(`You already have an active listing for "${p_name}". Archive it first to create a new one.`);
    }

    const [result]: any = await db.execute(
        'INSERT INTO product_table (u_id, p_name, p_description, p_price, p_unit, p_quantity, p_category, p_image, p_status, harvest_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, "active", ?)',
        [u_id, p_name, p_description, p_price, p_unit, p_quantity, p_category, p_image, harvest_date]
    );
    return result.insertId;
};

export const updateProduct = async (pId: number, productData: any) => {
    const { p_name, p_description, p_price, p_unit, p_quantity, p_category, p_image, p_status, harvest_date } = productData;

    await db.execute(
        'UPDATE product_table SET p_name = ?, p_description = ?, p_price = ?, p_unit = ?, p_quantity = ?, p_category = ?, p_image = ?, p_status = ?, harvest_date = ? WHERE p_id = ?',
        [p_name, p_description, p_price, p_unit, p_quantity, p_category, p_image, p_status, harvest_date, pId]
    );
};

export const unarchiveProduct = async (pId: number, uId: number) => {
    await db.execute('UPDATE product_table SET p_status = "active" WHERE p_id = ? AND u_id = ?', [pId, uId]);
};

export const archiveProduct = async (pId: number, uId: number) => {
    const [orders]: any = await db.execute(
        'SELECT req_id FROM purchase_table WHERE product_id = ? AND req_status IN ("Pending", "Confirmed")',
        [pId]
    );

    if (orders.length > 0) {
        throw new Error('Cannot archive product with active or reserved orders. Please fulfill or cancel orders first.');
    }

    await db.execute('UPDATE product_table SET p_status = "archived" WHERE p_id = ? AND u_id = ?', [pId, uId]);
};

export const deleteProduct = async (pId: number, uId: number) => {
    await db.execute('DELETE FROM product_table WHERE p_id = ? AND u_id = ?', [pId, uId]);
};
