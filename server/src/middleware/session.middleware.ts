import { Request, Response, NextFunction } from 'express';

// In-memory session activity tracker
// For production, use Redis or similar
const sessionActivity = new Map<string, number>();

const SESSION_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

export const sessionActivityMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).userId;

    if (userId) {
        const now = Date.now();
        const lastActivity = sessionActivity.get(userId);

        if (lastActivity && (now - lastActivity) > SESSION_TIMEOUT_MS) {
            // Session timed out
            sessionActivity.delete(userId);
            return res.status(401).json({
                error: 'Session expired due to inactivity',
                sessionExpired: true
            });
        }

        // Update last activity
        sessionActivity.set(userId, now);
    }

    next();
};

// Cleanup old sessions periodically
setInterval(() => {
    const now = Date.now();
    const entries = Array.from(sessionActivity.entries());
    for (const [userId, lastActivity] of entries) {
        if ((now - lastActivity) > SESSION_TIMEOUT_MS) {
            sessionActivity.delete(userId);
        }
    }
}, 60 * 1000); // Clean up every minute
