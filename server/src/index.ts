import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import assetRoutes from './routes/assets.routes.js';
import heirRoutes from './routes/heirs.routes.js';
import documentRoutes from './routes/documents.routes.js';
import transactionRoutes from './routes/transactions.routes.js';
import distributionRoutes from './routes/distributions.routes.js';
import notificationRoutes from './routes/notifications.routes.js';
import ledgerRoutes from './routes/ledger.routes.js';
import userRoutes from './routes/users.routes.js';
import seedRoutes from './routes/seed.routes.js';
import debugRoutes from './routes/debug.routes.js';
import authRoutes from './routes/auth.routes.js';


const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

import { errorHandler } from './middleware/error.middleware.js';
import { userMiddleware } from './middleware/user.middleware.js';


// Apply user middleware essentially globally or to specific routes
// Auth routes come BEFORE user middleware (they don't need auth)
app.use('/api/auth', authRoutes);
app.use(userMiddleware);

app.use('/api/assets', assetRoutes);
app.use('/api/heirs', heirRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/distributions', distributionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ledger', ledgerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/debug', debugRoutes);


app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('Family Assets Sharing API is running');
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.2.4' });
});

import prisma from './lib/prisma.js';

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
