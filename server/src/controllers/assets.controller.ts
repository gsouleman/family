import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAssets = async (req: Request, res: Response) => {
    try {
        const assets = await prisma.asset.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(assets);
    } catch (error) {
        console.error('Error fetching assets:', error);
        res.status(500).json({ error: 'Failed to fetch assets' });
    }
};

export const createAsset = async (req: Request, res: Response) => {
    try {
        const { name, category, value, description, location, purchaseDate, image, status } = req.body;
        const asset = await prisma.asset.create({
            data: {
                name,
                category,
                value: parseFloat(value),
                description,
                location,
                purchaseDate,
                image,
                status: status || 'active',
            },
        });
        res.json(asset);
    } catch (error) {
        console.error('Error creating asset:', error);
        res.status(500).json({ error: 'Failed to create asset' });
    }
};

export const updateAsset = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, category, value, description, location, purchaseDate, image, status } = req.body;
        const asset = await prisma.asset.update({
            where: { id },
            data: {
                name,
                category,
                value: value ? parseFloat(value) : undefined,
                description,
                location,
                purchaseDate,
                image,
                status,
            },
        });
        res.json(asset);
    } catch (error) {
        console.error('Error updating asset:', error);
        res.status(500).json({ error: 'Failed to update asset' });
    }
};

export const deleteAsset = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.asset.delete({
            where: { id },
        });
        res.json({ message: 'Asset deleted successfully' });
    } catch (error) {
        console.error('Error deleting asset:', error);
        res.status(500).json({ error: 'Failed to delete asset' });
    }
};
