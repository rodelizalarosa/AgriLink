import { db } from '../database/database';

async function setupDatabase() {
    try {
        console.log('--- Setting up Database: agrilink_db ---');

        // 1. Product Category Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS product_category (
                cat_id INT AUTO_INCREMENT PRIMARY KEY,
                cat_name VARCHAR(255) NOT NULL UNIQUE
            )
        `);
        console.log('✔ Table "product_category" is ready.');

        // Insert default categories if empty
        const [categories]: any = await db.execute('SELECT COUNT(*) as count FROM product_category');
        if (categories[0].count === 0) {
            await db.execute(`
                INSERT INTO product_category (cat_name) VALUES 
                ('Vegetables'), ('Fruits'), ('Grains'), ('Root Crops'), ('Others')
            `);
            console.log('✔ Default categories inserted.');
        }

        // 2. Users Table - Ensure consistency with auth_table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS users_table (
                id INT AUTO_INCREMENT PRIMARY KEY,
                auth_id INT NOT NULL,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                onboarding_completed TINYINT(1) DEFAULT 0,
                KEY auth_id (auth_id),
                CONSTRAINT users_table_ibfk_1 FOREIGN KEY (auth_id) REFERENCES auth_table (id) ON DELETE CASCADE
            )
        `);
        console.log('✔ Table "users_table" is ready.');

        // 3. Product Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS product_table (
                p_id INT AUTO_INCREMENT PRIMARY KEY,
                u_id INT NOT NULL,
                p_name VARCHAR(255) NOT NULL,
                p_description TEXT,
                p_price DECIMAL(10, 2) NOT NULL,
                p_unit VARCHAR(50) NOT NULL,
                p_quantity DECIMAL(10, 2) NOT NULL,
                p_category INT NOT NULL,
                p_image VARCHAR(255),
                p_status ENUM('active', 'archived') DEFAULT 'active',
                harvest_date DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (u_id) REFERENCES users_table(id) ON DELETE CASCADE,
                FOREIGN KEY (p_category) REFERENCES product_category(cat_id)
            )
        `);
        console.log('✔ Table "product_table" is ready.');

        // 4. Purchase Table (Orders)
        await db.execute(`
            CREATE TABLE IF NOT EXISTS purchase_table (
                req_id INT AUTO_INCREMENT PRIMARY KEY,
                buyer_id INT NOT NULL,
                product_id INT NOT NULL,
                quantity DECIMAL(10, 2) NOT NULL,
                req_status ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled') DEFAULT 'Pending',
                req_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (buyer_id) REFERENCES users_table(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES product_table(p_id) ON DELETE CASCADE
            )
        `);
        console.log('✔ Table "purchase_table" is ready.');

        // 4. Phenotyping Results Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS phenotyping_results (
                result_id INT AUTO_INCREMENT PRIMARY KEY,
                product_id INT NOT NULL,
                result_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                variety VARCHAR(255),
                health_score DECIMAL(5, 2),
                predicted_yield DECIMAL(10, 2),
                status VARCHAR(100),
                FOREIGN KEY (product_id) REFERENCES product_table(p_id) ON DELETE CASCADE
            )
        `);
        console.log('✔ Table "phenotyping_results" is ready.');

        console.log('\n✔ Database setup completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('✘ Database setup failed:', error);
        process.exit(1);
    }
}

setupDatabase();
