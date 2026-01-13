
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/db-schema', async (req, res) => {
    try {
        // Query information_schema directly using raw SQL
        // This bypasses Prisma Client model definitions to see what's actually in DB
        const columns = await prisma.$queryRaw`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'profiles'
        `;

        // Also check if Prisma Client *thinks* it has the fields
        // We can check the dmmf or just try a dummy count query
        // But the raw query is the most important proof of connection/schema

        res.json({
            message: 'Database Schema Check',
            db_connection: 'Success',
            profile_columns: columns
        });
    } catch (error) {
        res.status(500).json({
            error: 'Database check failed',
            details: String(error)
        });
    }
});

router.get('/email', async (req, res) => {
    try {
        const resendKey = process.env.RESEND_API_KEY ? '***SET***' : 'MISSING';
        const emailFrom = process.env.EMAIL_FROM || 'Family Assets <onboarding@resend.dev> (default)';

        res.json({
            status: resendKey !== 'MISSING' ? 'configured' : 'not_configured',
            config: {
                resend_api_key: resendKey,
                email_from: emailFrom
            },
            message: resendKey !== 'MISSING' ? '✅ Resend API Key is set' : '❌ RESEND_API_KEY is missing'
        });
    } catch (error) {
        res.status(500).json({ error: String(error) });
    }
});

export default router;
