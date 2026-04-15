import express from 'express';
import { updateOnboardingStatus, getUserProfile, updateUserProfile, getAllFarmers } from '../controllers/userController';
import { upload } from '../middleware/uploadMiddleware';

export const userRoutes = express.Router();

// Get all farmers (for MapPage) — must be before /:userId to avoid conflict
userRoutes.get('/farmers/all', getAllFarmers);

userRoutes.put('/:userId/onboarding', updateOnboardingStatus);
userRoutes.put(
  '/:userId/profile',
  upload.fields([
    { name: 'farm_image', maxCount: 1 },
    { name: 'profile_image', maxCount: 1 },
  ]),
  updateUserProfile
);
userRoutes.get('/:userId', getUserProfile);

export default userRoutes;
