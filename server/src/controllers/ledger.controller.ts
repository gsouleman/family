import { Request, Response } from 'express';
import { LedgerType, LedgerCategory } from '@prisma/client';
import prisma from '../lib/prisma.js';

export const getLedgerEntries = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const entries = await prisma.ledgerEntry.findMany({
            where: { userId },
            orderBy: { date: 'desc' }
        });
        res.json(entries);
    } catch (error) {
        console.error('Error fetching ledger entries:', error);
        res.status(500).json({ error: 'Failed to fetch ledger entries' });
    }
};

export const createLedgerEntry = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const { title, amount, type, category, date, description } = req.body;

        const entry = await prisma.ledgerEntry.create({
            data: {
                title,
                amount: parseFloat(amount),
                type: type as LedgerType,
                category: category as LedgerCategory,
                date: new Date(date),
                description,
                userId: userId!
            }
        });
        res.json(entry);
    } catch (error) {
        console.error('Error creating ledger entry:', error);
        res.status(500).json({ error: 'Failed to create ledger entry' });
    }
};

export const updateLedgerEntry = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const { title, amount, type, category, date, description } = req.body;

        const entry = await prisma.ledgerEntry.update({
            where: { id, userId },
            data: {
                title,
                amount: parseFloat(amount),
                type: type as LedgerType,
                category: category as LedgerCategory,
                date: new Date(date),
                description
            }
        });
        res.json(entry);
    } catch (error) {
        console.error('Error updating ledger entry:', error);
        res.status(500).json({ error: 'Failed to update ledger entry' });
    }
};

export const deleteLedgerEntry = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        await prisma.ledgerEntry.delete({
            where: { id, userId }
        });
        res.json({ message: 'Entry deleted successfully' });
    } catch (error) {
        console.error('Error deleting ledger entry:', error);
        res.status(500).json({ error: 'Failed to delete ledger entry' });
    }
};
