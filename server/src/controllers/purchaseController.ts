import { Request, Response } from 'express';
import * as purchaseService from '../services/purchaseService';
import { notificationService } from '../services/notificationService';

export const createPurchase = async (req: any, res: Response) => {
    try {
        const u_id = req.user?.id || req.body?.u_id || req.body?.buyer_id;

        if (!u_id) {
            return res.status(401).json({ message: 'User identification required for purchase.' });
        }

        const purchaseData = {
            buyer_id: parseInt(u_id as string),
            product_id: parseInt((req.body?.product_id || req.body?.p_id) as string),
            quantity: parseFloat(req.body?.quantity as string)
        };

        if (isNaN(purchaseData.product_id) || isNaN(purchaseData.quantity)) {
            return res.status(400).json({ message: 'Invalid product ID or quantity.' });
        }

        const purchaseId = await purchaseService.createPurchaseRequest(purchaseData);

        // Notify farmer (no platform logistics/discounts; just request + confirmation workflow).
        try {
            const ctx = await purchaseService.getProductForOrderNotify(purchaseData.product_id);
            const farmerId = Number(ctx?.farmer_id);
            const productName = String(ctx?.p_name ?? 'a product');
            if (Number.isFinite(farmerId) && farmerId > 0) {
                await notificationService.createNotification(
                    farmerId,
                    'New Order Request',
                    `A buyer requested ${purchaseData.quantity} unit(s) of ${productName}.`,
                    'order',
                    '/farmer/orders'
                );
            }
        } catch (e) {
            // Do not fail purchase creation if notification fails.
            console.error('[purchase] notify farmer failed', e);
        }

        res.status(201).json({ message: 'Purchase request created.', purchaseId });
    } catch (error: any) {
        res.status(500).json({ message: 'Error creating purchase.', error: error.message });
    }
};

export const getFarmerOrders = async (req: Request, res: Response) => {
    try {
        const u_id = parseInt(req.params.u_id as string);
        const orders = await purchaseService.getFarmerOrders(u_id);
        res.json({ orders });
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching orders.', error: error.message });
    }
};

export const getBuyerOrders = async (req: Request, res: Response) => {
    try {
        const buyer_id = parseInt(req.params.u_id as string);
        const orders = await purchaseService.getBuyerOrders(buyer_id);
        res.json({ orders });
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching buyer orders.', error: error.message });
    }
};

export const updateOrderStatus = async (req: any, res: Response) => {
    try {
        const req_id = parseInt(req.params.req_id as string);
        const status = req.body?.status;
        const u_id = req.user?.id || req.body?.u_id;

        if (!status || !u_id) {
            return res.status(400).json({ message: 'Missing status or user identification.' });
        }

        await purchaseService.updateOrderStatus(req_id, status, parseInt(u_id as string), notificationService);
        res.json({ message: 'Order status updated.' });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Error updating order status.' });
    }
};

export const cancelPurchase = async (req: any, res: Response) => {
    try {
        const req_id = parseInt(req.params.req_id as string);
        const u_id = req.user?.id || req.body?.u_id;
        const role = req.user?.role || req.body?.role;

        if (!u_id) return res.status(401).json({ message: 'Authentication required.' });

        await purchaseService.cancelPurchase(req_id, parseInt(u_id as string), role);
        res.json({ message: 'Order successfully cancelled.' });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Error cancelling order.' });
    }
};

export const removeCancelledOrder = async (req: any, res: Response) => {
    try {
        const req_id = parseInt(req.params.req_id as string);
        const u_id = req.user?.id || req.body?.u_id;
        const role = req.user?.role || req.body?.role;

        if (!u_id) return res.status(401).json({ message: 'Authentication required.' });
        if (isNaN(req_id)) return res.status(400).json({ message: 'Invalid order ID.' });

        await purchaseService.removeCancelledOrder(req_id, parseInt(u_id as string), String(role || ''));
        res.json({ message: 'Cancelled order removed.' });
    } catch (error: any) {
        const message = error.message || 'Error removing cancelled order.';
        if (message === 'Order not found.') return res.status(404).json({ message });
        if (message === 'Unauthorized.') return res.status(403).json({ message });
        if (message === 'Only cancelled orders can be removed.') return res.status(400).json({ message });
        res.status(500).json({ message });
    }
};

export const getEarningSummary = async (req: Request, res: Response) => {
    try {
        const u_id = parseInt(req.params.u_id as string);
        const summary = await purchaseService.getEarningSummary(u_id);
        res.json({ summary });
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching earnings.', error: error.message });
    }
};
