"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
exports.userRoutes = express_1.default.Router();
// Get all farmers (for MapPage) — must be before /:userId to avoid conflict
exports.userRoutes.get('/farmers/all', userController_1.getAllFarmers);
exports.userRoutes.put('/:userId/onboarding', userController_1.updateOnboardingStatus);
exports.userRoutes.put('/:userId/profile', uploadMiddleware_1.upload.fields([
    { name: 'farm_image', maxCount: 1 },
    { name: 'profile_image', maxCount: 1 },
]), userController_1.updateUserProfile);
exports.userRoutes.get('/:userId', userController_1.getUserProfile);
exports.default = exports.userRoutes;
