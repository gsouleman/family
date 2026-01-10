import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getHeirs = async (req: Request, res: Response) => {
    try {
        const heirs = await prisma.heir.findMany({
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
        const { name, relation, dateOfBirth, email, phone, avatar } = req.body;
        const heir = await prisma.heir.create({
            data: {
                name,
                relation,
                dateOfBirth,
                email,
                phone,
                avatar,
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
        const { name, relation, dateOfBirth, email, phone, avatar } = req.body;
        const heir = await prisma.heir.update({
            where: { id },
            data: {
                name,
                relation,
                dateOfBirth,
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
        await prisma.heir.delete({
            where: { id },
        });
        res.json({ message: 'Heir deleted successfully' });
    } catch (error) {
        console.error('Error deleting heir:', error);
        res.status(500).json({ error: 'Failed to delete heir' });
    }
};
