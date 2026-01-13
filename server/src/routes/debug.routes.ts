
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '../services/auth.service.js'; // Import AuthService

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

router.get('/smtp', async (req, res) => {
    try {
        const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com (default)';
        const smtpPort = process.env.SMTP_PORT || '465 (default)';
        const smtpUser = process.env.SMTP_USER ? '***' : 'MISSING';
        const smtpPass = process.env.SMTP_PASS ? '***' : 'MISSING';
        const smtpSecure = process.env.SMTP_SECURE;

        console.log('🔍 Manual SMTP Debug Verification Triggered');
        const isVerified = await AuthService.verifySMTPConnection();

        res.json({
            status: isVerified ? 'success' : 'failed',
            config: {
                host: smtpHost,
                port: smtpPort,
                user: smtpUser,
                pass: smtpPass,
                secure: smtpSecure
            },
            message: isVerified ? '✅ Connection Successful' : '❌ Connection Failed (Check Server Logs for Details)'
        });
    } catch (error) {
        res.status(500).json({ error: String(error) });
    }
});

export default router;
