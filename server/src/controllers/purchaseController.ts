import { Request, Response } from 'express';
import * as purchaseService from '../services/purchaseService';

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

export const updateOrderStatus = async (req: any, res: Response) => {
    try {
        const req_id = parseInt(req.params.req_id as string);
        const status = req.body?.status;
        const u_id = req.user?.id || req.body?.u_id;

        if (!status || !u_id) {
            return res.status(400).json({ message: 'Missing status or user identification.' });
        }

        await purchaseService.updateOrderStatus(req_id, status, parseInt(u_id as string));
        res.json({ message: 'Order status updated.' });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Error updating order status.' });
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
