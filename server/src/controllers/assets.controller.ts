import { Request, Response } from 'express';
import { PrismaClient, AssetCategory, AssetStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const getAssets = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: 'User authentication required' });
        }

        const assets = await prisma.asset.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: { documents: true }
        });
        res.json(assets);
    } catch (error) {
        console.error('Error fetching assets:', error);
        res.status(500).json({ error: 'Failed to fetch assets' });
    }
};

export const createAsset = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: 'User authentication required' });
        }

        const { name, category, value, description, location, purchaseDate, image, status, isForSale } = req.body;

        // Validate Enum values
        if (category && !Object.values(AssetCategory).includes(category as AssetCategory)) {
            return res.status(400).json({ error: 'Invalid asset category' });
        }

        const asset = await prisma.asset.create({
            data: {
                name,
                category: category as AssetCategory,
                value: parseFloat(value),
                description,
                location,
                purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
                image,
                status: (status as AssetStatus) || AssetStatus.active,
                isForSale: isForSale !== undefined ? Boolean(isForSale) : true,
                userId,
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
        const userId = req.userId;

        const { name, category, value, description, location, purchaseDate, image, status, isForSale } = req.body;

        const asset = await prisma.asset.update({
            where: { id, userId }, // Ensure user owns the asset
            data: {
                name,
                category: category as AssetCategory,
                value: value ? parseFloat(value) : undefined,
                description,
                location,
                purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
                image,
                status: status as AssetStatus,
                isForSale: isForSale !== undefined ? Boolean(isForSale) : undefined,
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
        const userId = req.userId;

        await prisma.asset.delete({
            where: { id, userId }, // Ensure user owns the asset
        });
        res.json({ message: 'Asset deleted successfully' });
    } catch (error) {
        console.error('Error deleting asset:', error);
        res.status(500).json({ error: 'Failed to delete asset' });
    }
};
