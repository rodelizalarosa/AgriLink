import express, { Request, Response, NextFunction } from 'express';
import { authRoutes } from './routes/authRoutes';

const app = express();

// Custom CORS Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;

    if (origin === 'http://localhost:5173') {
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

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

export default app;
