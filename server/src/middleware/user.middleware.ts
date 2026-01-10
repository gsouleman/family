
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const userMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. Try to get User ID from header
        let userId = req.headers['x-user-id'] as string;

        // 2. If no header, try to find the first user in DB (for development/testing)
        if (!userId) {
            const firstUser = await prisma.user.findFirst();
            if (firstUser) {
                userId = firstUser.id;
            } else {
                // Create a default user if none exists
                const newUser = await prisma.user.create({
                    data: {
                        email: 'dev@example.com',
                        fullName: 'Development User'
                    }
                });
                userId = newUser.id;
            }
        }

        req.userId = userId;
        next();
    } catch (error) {
        console.error('User middleware error:', error);
        next();
    }
};
