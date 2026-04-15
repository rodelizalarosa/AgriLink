"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.loginUser = exports.registerUser = void 0;
const hash_1 = require("../utils/hash");
const database_1 = require("../database/database");
const emailService_1 = require("./emailService");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const emailTemplates_1 = require("../templates/emailTemplates");
const registerUser = async (data) => {
    const connection = await database_1.db.getConnection();
    try {
        await connection.beginTransaction();
        // 1. Check if email exists in auth_table
        const [existingUser] = await connection.execute('SELECT id FROM auth_table WHERE email = ?', [data.email]);
        if (existingUser.length > 0) {
            throw new Error('Email already registered');
        }
        // 2. Lookup role_id from role_table
        const [roles] = await connection.execute('SELECT id FROM role_table WHERE role_name = ?', [data.role_name]);
        if (roles.length === 0) {
            throw new Error(`Invalid role specified: ${data.role_name}`);
        }
        const roleId = roles[0].id;
        // 3. Hash the password
        const password_hash = await (0, hash_1.hashPassword)(data.password);
        // 4. Insert into auth_table
        const [authResult] = await connection.execute('INSERT INTO auth_table (email, password_hash, role_id) VALUES (?, ?, ?)', [data.email, password_hash, roleId]);
        const authId = authResult.insertId;
        // 5. Insert into users_table
        const [userResult] = await connection.execute('INSERT INTO users_table (auth_id, first_name, last_name, role) VALUES (?, ?, ?, ?)', [authId, data.firstName || '', data.lastName || '', data.role_name]);
        const userId = userResult.insertId;
        await connection.commit();
        const verificationToken = jsonwebtoken_1.default.sign({ email: data.email, userId: authId }, process.env.JWT_SECRET || 'secret', { expiresIn: '10m' });
        const confirmationURL = `http://localhost:${process.env.PORT || 5002}/api/auth/verify?token=${verificationToken}`;
        const logoUrl = process.env.LOGO_URL || 'https://osgogrbrjlnslgdinhgl.supabase.co/storage/v1/object/public/email-assets/AgriLinkGREEN.png';
        const emailHtml = (0, emailTemplates_1.getEmailVerificationTemplate)(confirmationURL, logoUrl);
        console.log('Registering user, preparing email for:', data.email);
        (0, emailService_1.sendEmail)({
            to: data.email,
            subject: 'Welcome to AgriLink! Please Confirm Your Email',
            html: emailHtml
        })
            .then(info => console.log('EmailService response in authService:', info?.messageId))
            .catch(err => console.error('CRITICAL: Failed to send welcome email in authService catch:', err));
        return { id: userId, authId, email: data.email };
    }
    catch (err) {
        await connection.rollback();
        throw err;
    }
    finally {
        connection.release();
    }
};
exports.registerUser = registerUser;
const loginUser = async (data) => {
    const [users] = await database_1.db.execute(`SELECT a.id as auth_id, u.id as user_id, a.password_hash, a.is_verified, r.role_name, u.first_name, u.last_name, u.onboarding_completed
     FROM auth_table a 
     JOIN role_table r ON a.role_id = r.id 
     LEFT JOIN users_table u ON a.id = u.auth_id
     WHERE a.email = ?`, [data.email]);
    if (users.length === 0) {
        throw new Error('User not found');
    }
    const user = users[0];
    if (user.is_verified === 0) {
        throw new Error('Please verify your email address before logging in.');
    }
    const isPasswordValid = await (0, hash_1.comparedPassword)(data.password, user.password_hash);
    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }
    return {
        id: user.user_id, // Use users_table.id
        auth_id: user.auth_id,
        email: data.email,
        role_name: user.role_name,
        first_name: user.first_name,
        last_name: user.last_name,
        onboarding_completed: user.onboarding_completed
    };
};
exports.loginUser = loginUser;
const updatePassword = async (authId, currentPassword, newPassword) => {
    // 1. Get current password hash
    const [users] = await database_1.db.execute('SELECT password_hash FROM auth_table WHERE id = ?', [authId]);
    if (users.length === 0) {
        throw new Error('User not found');
    }
    const { password_hash } = users[0];
    // 2. Verify current password
    const isMatch = await (0, hash_1.comparedPassword)(currentPassword, password_hash);
    if (!isMatch) {
        throw new Error('Current password is incorrect');
    }
    // 3. Hash new password
    const newHash = await (0, hash_1.hashPassword)(newPassword);
    // 4. Update
    await database_1.db.execute('UPDATE auth_table SET password_hash = ? WHERE id = ?', [newHash, authId]);
    return { message: 'Password updated successfully' };
};
exports.updatePassword = updatePassword;
