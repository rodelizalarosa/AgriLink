"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllMessagesRead = exports.markAsRead = exports.sendMessage = exports.getMessages = exports.getConversations = void 0;
const messageService_1 = require("../services/messageService");
const notificationService_1 = require("../services/notificationService");
const database_1 = require("../database/database");
const socket_1 = require("../socket");
const getConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        const conversations = await messageService_1.messageService.getConversations(userId);
        res.json({ conversations });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getConversations = getConversations;
const getMessages = async (req, res) => {
    try {
        const userId = req.user.id;
        const { otherUserId } = req.params;
        const other = Number(otherUserId);
        if (!Number.isFinite(other) || other <= 0) {
            return res.status(400).json({ message: 'Invalid user id' });
        }
        const messages = await messageService_1.messageService.getMessages(userId, other);
        res.json({ messages });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getMessages = getMessages;
const sendMessage = async (req, res) => {
    try {
        const senderId = req.user.id;
        const file = req.file;
        const { receiverId, content } = req.body;
        if (receiverId === undefined || receiverId === null || receiverId === '') {
            return res.status(400).json({ message: 'receiverId is required' });
        }
        const receiverNum = Number(receiverId);
        if (!Number.isFinite(receiverNum) || receiverNum <= 0 || receiverNum === senderId) {
            return res.status(400).json({ message: 'Invalid receiver' });
        }
        const text = typeof content === 'string' ? content.trim() : '';
        if (!text && !file) {
            return res.status(400).json({ message: 'Message text or image is required' });
        }
        let imagePublicPath = null;
        if (file?.filename) {
            imagePublicPath = `/uploads/${file.filename}`;
        }
        const insertResult = await messageService_1.messageService.sendMessage(senderId, receiverNum, text || '', imagePublicPath);
        const [senderRows] = await database_1.db.execute('SELECT first_name, last_name FROM users_table WHERE id = ?', [senderId]);
        const senderName = senderRows[0]
            ? `${senderRows[0].first_name} ${senderRows[0].last_name}`
            : 'A user';
        let notifMessage = `${senderName} sent you a message`;
        if (imagePublicPath && text) {
            notifMessage = `${senderName} sent a photo: "${text.substring(0, 40)}${text.length > 40 ? '...' : ''}"`;
        }
        else if (imagePublicPath) {
            notifMessage = `${senderName} sent a photo`;
        }
        else {
            notifMessage = `${senderName}: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`;
        }
        await notificationService_1.notificationService.createNotification(receiverNum, 'New Message', notifMessage, 'message', `/messages?contactId=${senderId}`);
        // Realtime payload: fetch the exact inserted row when insertId exists.
        let sentMessage = null;
        const insertedId = Number(insertResult?.insertId);
        if (Number.isFinite(insertedId) && insertedId > 0) {
            const [byIdRows] = await database_1.db.execute('SELECT * FROM messages_table WHERE m_id = ? LIMIT 1', [insertedId]);
            sentMessage = byIdRows?.[0] ?? null;
        }
        if (!sentMessage) {
            const [latestRows] = await database_1.db.execute('SELECT * FROM messages_table WHERE sender_id = ? AND receiver_id = ? ORDER BY created_at DESC LIMIT 1', [senderId, receiverNum]);
            sentMessage = latestRows?.[0] ?? null;
        }
        if (sentMessage) {
            // Push to both ends so sender and receiver update thread instantly.
            (0, socket_1.emitToUser)(receiverNum, 'new_message', sentMessage);
            (0, socket_1.emitToUser)(senderId, 'new_message', sentMessage);
        }
        res.status(201).json({ message: 'Message sent successfully', data: sentMessage });
    }
    catch (error) {
        if (error?.code === 'ER_BAD_FIELD_ERROR' && String(error?.message || '').includes('image_path')) {
            return res.status(500).json({
                message: 'Message images require DB migration. Run server/src/database/add_message_image_path.sql on your database.',
            });
        }
        res.status(500).json({ message: error.message });
    }
};
exports.sendMessage = sendMessage;
const markAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const { otherUserId } = req.params;
        const other = Number(otherUserId);
        if (!Number.isFinite(other) || other <= 0) {
            return res.status(400).json({ message: 'Invalid user id' });
        }
        await messageService_1.messageService.markAsRead(other, userId);
        await notificationService_1.notificationService.markNotificationsAsReadByLink(userId, `/messages?contactId=${other}`);
        res.json({ message: 'Messages marked as read' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.markAsRead = markAsRead;
const markAllMessagesRead = async (req, res) => {
    try {
        const userId = req.user.id;
        await messageService_1.messageService.markAllAsReadForReceiver(userId);
        res.json({ message: 'All messages marked as read' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.markAllMessagesRead = markAllMessagesRead;
