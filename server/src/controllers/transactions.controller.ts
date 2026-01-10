import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTransactions = async (req: Request, res: Response) => {
    try {
        const transactions = await prisma.transaction.findMany({
            orderBy: { date: 'desc' }
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
};

export const createTransaction = async (req: Request, res: Response) => {
    try {
        // userId is handled by middleware but we might not need it for general ledger if not strict
        const { type, description, amount, relatedAssetId, relatedHeirId, date } = req.body;
        const transaction = await prisma.transaction.create({
            data: {
                type,
                description,
                amount,
                relatedAssetId,
                relatedHeirId,
                date: date ? new Date(date) : undefined
            }
        });
        res.json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create transaction' });
    }
};
