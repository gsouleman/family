
import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { PrismaClient } from '@prisma/client';

export const userMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. Try to get User details from headers (sent by Frontend)
        const userId = req.headers['x-user-id'] as string;
        const userEmail = req.headers['x-user-email'] as string;
        const userName = req.headers['x-user-name'] as string;

        if (userId) {
            try {
                console.log(`[Middleware] Syncing user ${userId} (Email: ${userEmail}, Name: ${userName})`);

                const existingProfile = await prisma.profile.findUnique({ where: { id: userId } });
                console.log(`[Middleware] Existing Profile before sync:`, existingProfile);

                await prisma.user.upsert({
                    where: { id: userId },
                    update: {}, // No updates needed, Auth is source of truth
                    create: {
                        id: userId,
                        email: userEmail || `user_${userId.substring(0, 8)}@example.com`,
                        fullName: userName ? decodeURIComponent(userName) : 'Unknown User'
                    }
                });

                // ALSO Sync Profile (for Admin Panel visibility)
                const upsertedProfile = await prisma.profile.upsert({
                    where: { id: userId },
                    update: {}, // Don't overwrite admin changes (role/status)
                    create: {
                        id: userId,
                        email: userEmail || `user_${userId.substring(0, 8)}@example.com`,
                        full_name: userName ? decodeURIComponent(userName) : 'Unknown User',
                        role: 'user', // Default
                        account_type: 'family',
                        status: 'active'
                    }
                });
                console.log(`[Middleware] Upserted Profile:`, upsertedProfile);
            } catch (dbError) {
                console.error("Failed to sync user to Neon:", dbError);
                // Continue? If upsert fails, subsequent queries might fail, but let's try.
            }
            req.userId = userId;
        } else {
            // 2. Fallback: If no header, use 'dev@example.com' (Development Mode)
            const firstUser = await prisma.user.findFirst();
            if (firstUser) {
                req.userId = firstUser.id;
            } else {
                const newUser = await prisma.user.create({
                    data: {
                        email: 'dev@example.com',
                        fullName: 'Development User'
                    }
                });
                req.userId = newUser.id;
            }
        }

        next();
    } catch (error) {
        console.error('User middleware error:', error);
        next();
    }
};
