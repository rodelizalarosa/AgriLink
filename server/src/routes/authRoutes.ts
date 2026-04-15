import express from 'express';
import { registerController, loginController, verifyController, checkEmailController, updatePasswordController } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

export const authRoutes = express.Router();

authRoutes.post('/register', registerController);
authRoutes.post('/login', loginController);
authRoutes.get('/verify', verifyController);
authRoutes.get('/check-email', checkEmailController);
authRoutes.put('/password', authenticateToken, updatePasswordController);

export default authRoutes;
