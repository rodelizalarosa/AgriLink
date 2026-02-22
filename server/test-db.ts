import { db } from './src/database/database';

async function testConnection() {
    try {
        console.log('Attempting to connect to database...');
        const connection = await db.getConnection();
        console.log('Connected successfully!');

        console.log('Checking tables...');
        const [tables]: any = await connection.query('SHOW TABLES');
        console.log('Tables found:', tables.map((t: any) => Object.values(t)[0]));

        const requiredTables = ['auth_table', 'role_table', 'users_table'];
        for (const table of requiredTables) {
            const exists = tables.some((t: any) => Object.values(t)[0] === table);
            console.log(`Table "${table}": ${exists ? 'EXISTS' : 'MISSING'}`);
        }

        connection.release();
        process.exit(0);
    } catch (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
}

testConnection();
