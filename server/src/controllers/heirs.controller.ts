import { Request, Response } from 'express';
import { HeirRelation } from '@prisma/client';
import prisma from '../lib/prisma';

export const getHeirs = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: 'User authentication required' });
        }

        const heirs = await prisma.heir.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(heirs);
    } catch (error) {
        console.error('Error fetching heirs:', error);
        res.status(500).json({ error: 'Failed to fetch heirs' });
    }
};

export const createHeir = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: 'User authentication required' });
        }

        const { name, relation, dateOfBirth, email, phone, avatar } = req.body;

        const heir = await prisma.heir.create({
            data: {
                name,
                relation: relation as HeirRelation,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                email,
                phone,
                avatar,
                userId,
            },
        });
        res.json(heir);
    } catch (error) {
        console.error('Error creating heir:', error);
        res.status(500).json({ error: 'Failed to create heir' });
    }
};

export const updateHeir = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const { name, relation, dateOfBirth, email, phone, avatar } = req.body;
        const heir = await prisma.heir.update({
            where: { id, userId },
            data: {
                name,
                relation: relation as HeirRelation,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
                email,
                phone,
                avatar,
            },
        });
        res.json(heir);
    } catch (error) {
        console.error('Error updating heir:', error);
        res.status(500).json({ error: 'Failed to update heir' });
    }
};

export const deleteHeir = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        await prisma.heir.delete({
            where: { id, userId },
        });
        res.json({ message: 'Heir deleted successfully' });
    } catch (error) {
        console.error('Error deleting heir:', error);
        res.status(500).json({ error: 'Failed to delete heir' });
    }
};
