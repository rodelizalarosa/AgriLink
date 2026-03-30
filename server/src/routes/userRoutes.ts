import express from 'express';
import { updateOnboardingStatus, getUserProfile, updateUserProfile, getAllFarmers } from '../controllers/userController';

export const userRoutes = express.Router();

// Get all farmers (for MapPage) — must be before /:userId to avoid conflict
userRoutes.get('/farmers/all', getAllFarmers);

userRoutes.put('/:userId/onboarding', updateOnboardingStatus);
userRoutes.put('/:userId/profile', updateUserProfile);
userRoutes.get('/:userId', getUserProfile);

export default userRoutes;
