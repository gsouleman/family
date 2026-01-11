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

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
