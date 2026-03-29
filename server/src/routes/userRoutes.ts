import express from 'express';
import { updateOnboardingStatus, getUserProfile } from '../controllers/userController';

export const userRoutes = express.Router();

userRoutes.put('/:userId/onboarding', updateOnboardingStatus);
userRoutes.get('/:userId', getUserProfile);

export default userRoutes;
