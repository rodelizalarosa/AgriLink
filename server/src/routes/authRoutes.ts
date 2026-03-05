import express from 'express';
import { registerController, loginController, verifyController, checkEmailController } from '../controllers/authController';


export const authRoutes = express.Router();

authRoutes.post('/register', registerController);
authRoutes.post('/login', loginController);
authRoutes.get('/verify', verifyController);
authRoutes.get('/check-email', checkEmailController);

export default authRoutes;
