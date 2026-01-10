import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getNotifications = async (req: Request, res: Response) => {
    try {
        // Ideally filter by userId from req.user
        const notifications = await prisma.notification.findMany({
            orderBy: { date: 'desc' },
            include: { user: false } // Avoid leaking user data if not needed
        });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

export const createNotification = async (req: Request, res: Response) => {
    try {
        const { title, message, type, userId } = req.body;

        // If userId is not provided in body, fallback to hardcoded or fail (for now we assume 1 user in simple mode)
        // But schema requires userId. We'll try to find the first user or create one if missing
        // For simplicity in this "family" single-tenant setup:
        let targetUserId = userId;
        if (!targetUserId) {
            const user = await prisma.user.findFirst();
            if (user) targetUserId = user.id;
        }

        if (!targetUserId) {
            return res.status(400).json({ error: 'User ID required for notification via fallback' });
        }

        const notification = await prisma.notification.create({
            data: {
                title,
                message,
                type,
                userId: targetUserId
            }
        });
        res.json(notification);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create notification' });
    }
};

export const markRead = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const notification = await prisma.notification.update({
            where: { id },
            data: { read: true }
        });
        res.json(notification);
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
};
