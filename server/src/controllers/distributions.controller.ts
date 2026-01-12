import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getDistributions = async (req: Request, res: Response) => {
    try {
        const distributions = await prisma.distribution.findMany({
            include: {
                shares: {
                    include: { heir: true }
                },
                asset: true
            },
            orderBy: { saleDate: 'desc' }
        });
        res.json(distributions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch distributions' });
    }
};

export const createDistribution = async (req: Request, res: Response) => {
    try {
        const { totalAmount, saleDate, status, assetId, shares } = req.body;

        const distribution = await prisma.distribution.create({
            data: {
                totalAmount,
                saleDate: new Date(saleDate),
                status,
                assetId,
                shares: {
                    create: shares.map((share: any) => ({
                        sharePercentage: share.sharePercentage,
                        shareAmount: share.shareAmount,
                        shareFraction: share.shareFraction,
                        heirId: share.heirId
                    }))
                }
            },
            include: {
                shares: {
                    include: { heir: true }
                }
            }
        });
        res.json(distribution);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create distribution' });
    }
};
