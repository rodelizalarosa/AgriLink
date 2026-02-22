import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService';

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
    return res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await loginUser({ email, password });

    return res.status(200).json({ message: 'User logged in successfully', result });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
};