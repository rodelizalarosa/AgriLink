import { Router } from 'express';
import * as purchaseController from '../controllers/purchaseController';
import { authenticateToken } from '../middleware/authMiddleware';

export const purchaseRoutes = Router();

purchaseRoutes.post('/', authenticateToken, purchaseController.createPurchase);
purchaseRoutes.get('/farmer/:u_id', authenticateToken, purchaseController.getFarmerOrders);
purchaseRoutes.put('/status/:req_id', authenticateToken, purchaseController.updateOrderStatus);
purchaseRoutes.get('/earnings/:u_id', authenticateToken, purchaseController.getEarningSummary);

export default purchaseRoutes;
