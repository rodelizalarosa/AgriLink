import { db } from './src/database/database';

async function checkData() {
    try {
        const [roles]: any = await db.query('SELECT * FROM role_table');
        console.log('Roles:', roles);

        const [users]: any = await db.query('SELECT id, email, role_id FROM auth_table');
        console.log('Users (limited):', users);

        process.exit(0);
    } catch (err) {
        console.error('Failed to fetch data:', err);
        process.exit(1);
    }
}

checkData();
