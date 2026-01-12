import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import assetRoutes from './routes/assets.routes';
import heirRoutes from './routes/heirs.routes';
import documentRoutes from './routes/documents.routes';
import transactionRoutes from './routes/transactions.routes';
import distributionRoutes from './routes/distributions.routes';
import notificationRoutes from './routes/notifications.routes';
import ledgerRoutes from './routes/ledger.routes';
import userRoutes from './routes/users.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

import { errorHandler } from './middleware/error.middleware';
import { userMiddleware } from './middleware/user.middleware';

// Apply user middleware essentially globally or to specific routes
app.use(userMiddleware);

app.use('/api/assets', assetRoutes);
app.use('/api/heirs', heirRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/distributions', distributionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ledger', ledgerRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('Family Assets Sharing API is running');
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

import prisma from './lib/prisma';

app.get('/api/debug/db', async (req, res) => {
    try {
        const dbUrlExists = !!process.env.DATABASE_URL;
        // Obfuscate the URL for safety if it exists
        const dbUrlSafe = dbUrlExists ? (process.env.DATABASE_URL?.substring(0, 20) + '...') : 'MISSING';

        await prisma.$connect();
        const userCount = await prisma.user.count();

        res.json({
            status: 'connected',
            env_database_url: dbUrlExists ? 'PRESENT' : 'MISSING',
            url_preview: dbUrlSafe,
            user_count: userCount
        });
    } catch (error: any) {
        console.error('DB Debug Connection Failed:', error);
        res.status(500).json({
            status: 'failed',
            env_database_url: !!process.env.DATABASE_URL ? 'PRESENT' : 'MISSING',
            error: error.message
        });
    } finally {
        await prisma.$disconnect();
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
