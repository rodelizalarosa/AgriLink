import { Request, Response } from 'express';
import { registerUser, loginUser, updatePassword } from '../services/authService';
import jwt from 'jsonwebtoken';
import { db } from '../database/database';
import { getVerificationSuccessTemplate, getVerificationExpiredTemplate } from '../templates/webTemplates';

export const registerController = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, role_name } = req.body;

    if (!email || !password || !role_name) {
      return res.status(400).json({ message: 'Email, password, and role are required' });
    }

    const result = await registerUser({ email, password, firstName, lastName, role_name });

    return res.status(201).json({ message: 'User registered successfully', result });
  } catch (err: any) {
    console.error(err);
    if (err.message === 'Email already registered') {
      return res.status(409).json({ message: err.message });
    }
    return res.status(500).json({ message: err.message || 'Service temporarily unavailable. Please try again later.' });
  }
};

export const updatePasswordController = async (req: Request, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const authId = (req as any).user.auth_id;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new passwords are required' });
        }

        const result = await updatePassword(authId, currentPassword, newPassword);
        return res.status(200).json(result);
    } catch (err: any) {
        console.error(err);
        const message = err.message || 'Error updating password';
        if (message === 'Current password is incorrect') {
            return res.status(401).json({ message });
        }
        if (message === 'User not found') {
            return res.status(404).json({ message });
        }
        return res.status(500).json({ message });
    }
};

export const checkEmailController = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const [existing]: any = await db.execute(
      'SELECT id FROM auth_table WHERE email = ?',
      [email as string]
    );

    return res.status(200).json({ exists: existing.length > 0 });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: 'Error checking email' });
  }
};

export const verifyController = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    // Verify token
    const decoded: any = jwt.verify(token as string, process.env.JWT_SECRET || 'secret');
    const email = decoded.email;

    // Update the user's is_verified status in the database
    // Also fetch the role for auto-login
    const [users]: any = await db.execute(`
      SELECT a.id as auth_id, u.id as user_id, r.role_name, u.first_name, u.last_name, u.onboarding_completed
      FROM auth_table a 
      JOIN role_table r ON a.role_id = r.id 
      LEFT JOIN users_table u ON a.id = u.auth_id
      WHERE a.email = ?
    `, [email]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'You are not registered' });
    }

    const user = users[0];
    const role = user.role_name.toLowerCase();

    await db.execute('UPDATE auth_table SET is_verified = 1 WHERE email = ?', [email]);

    // Generate a proper session JWT for auto-login
    const loginToken = jwt.sign(
      { id: user.user_id, email: email, role: role, firstName: user.first_name, lastName: user.last_name, onboarding_completed: user.onboarding_completed },
      process.env.JWT_SECRET || 'supersecretkey',
      { expiresIn: '1d' }
    );

    return res.send(getVerificationSuccessTemplate(loginToken, role, user.first_name, user.last_name, user.user_id));
  } catch (err: any) {
    console.error(err);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).send(getVerificationExpiredTemplate());
    }
    return res.status(400).json({ message: 'Invalid token' });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await loginUser({ email, password });

    // Generate session JWT
    const token = jwt.sign(
      {
        id: result.id,
        auth_id: result.auth_id,
        email: result.email,
        role: result.role_name,
        firstName: result.first_name,
        lastName: result.last_name,
        onboarding_completed: result.onboarding_completed
      },
      process.env.JWT_SECRET || 'supersecretkey',
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'User logged in successfully',
      token,
      result
    });
  } catch (err: any) {
    console.error(err);
    if (err.message === 'User not found') {
      return res.status(401).json({ message: 'You are not registered' });
    }
    if (err.message === 'Invalid password') {
      return res.status(401).json({ message: err.message });
    }
    if (err.message.includes('Please verify your email')) {
      return res.status(403).json({ message: err.message });
    }
    return res.status(500).json({ message: err.message || 'Service temporarily unavailable. Please try again later.' });
  }
};
