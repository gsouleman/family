
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
            profile_columns: columns,
            prisma_client_version: PrismaClient.dmmf?.datamodel?.models // This might not be accessible at runtime easily
        });
    } catch (error) {
        res.status(500).json({
            error: 'Database check failed',
            details: String(error)
        });
    }
});

export default router;
