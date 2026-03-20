import express, { Request, Response, NextFunction } from 'express';
import { authRoutes } from './routes/authRoutes';
import { productRoutes } from './routes/productRoutes';
import { purchaseRoutes } from './routes/purchaseRoutes';
import phenotypingRoutes from './routes/phenotypingRoutes';

const app = express();

// Custom CORS Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;

    if (origin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle Preflight (OPTIONS)
    if (req.method === 'OPTIONS') {
        res.sendStatus(204);
        return;
    }

    next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
});

app.use(express.json());
app.use('/uploads', express.static('public/uploads'));

// --- DIAGNOSTIC TEST ROUTE ---
app.get('/api/test-now', (req: Request, res: Response) => {
    res.json({
        message: 'SERVER IS RECOGNIZING EDITS - VERSION 3 - ROUTES CHECK',
        time: new Date().toLocaleTimeString(),
        status: 'OK'
    });
});

// Routes
app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'AgriLink API - RECOGNIZING EDITS v2',
        status: 'Online',
        port: process.env.PORT || 5001
    });
});

app.get('/api/test', (req, res) => res.json({ status: 'API IS LIVE', timestamp: new Date().toISOString() }));

// --- DIRECT ADD ROUTE ---
import * as productController from './controllers/productController';
import { authenticateToken } from './middleware/authMiddleware';
import { upload } from './middleware/uploadMiddleware';
app.post('/api/add/product', authenticateToken, upload.single('p_image'), productController.createProduct);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/phenotyping', phenotypingRoutes);

// --- GLOBAL ERROR HANDLER ---
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('--- GLOBAL ERROR CAUGHT ---');
    console.error('Error Name:', err.name);
    console.error('Error Message:', err.message);
    console.error('Error Stack:', err.stack);

    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        stack: err.stack, // Always return stack for internal debugging
        error_name: err.name
    });
});

export default app;
