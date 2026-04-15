import { Server } from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';
import { ENV } from './config/env';

let io: Server;

export const initSocket = (server: http.Server) => {
    io = new Server(server, {
        cors: {
            origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    // Simple auth middleware for socket
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error: Token missing'));
        }

        try {
            const decoded = jwt.verify(token, ENV.JWT_SECRET) as any;
            const rawId = decoded?.id ?? decoded?.userId ?? decoded?.u_id;
            const idNum = typeof rawId === 'number' ? rawId : Number(rawId);
            if (!Number.isFinite(idNum) || idNum <= 0) {
                return next(new Error('Authentication error: Missing user id in token'));
            }
            (socket as any).userId = idNum;
            next();
        } catch (err) {
            return next(new Error('Authentication error: Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        const userId = (socket as any).userId;
        console.log(`[SOCKET] User connected: ${userId} (Socket ID: ${socket.id})`);

        // Join a private room for this user
        socket.join(`user_${userId}`);

        socket.on('disconnect', () => {
            console.log(`[SOCKET] User disconnected: ${userId}`);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

export const emitToUser = (userId: number, event: string, data: any) => {
    if (io) {
        io.to(`user_${userId}`).emit(event, data);
    }
};
