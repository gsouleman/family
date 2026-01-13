import { Request, Response } from 'express';
import { DocumentType } from '@prisma/client';
import prisma from '../lib/prisma.js';

export const getDocuments = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: 'User authentication required' });
        }

        const documents = await prisma.document.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: { asset: { select: { name: true } } }
        });
        res.json(documents);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ error: 'Failed to fetch documents' });
    }
};

export const createDocument = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: 'User authentication required' });
        }

        const { name, type, url, fileSize, assetId } = req.body;

        const document = await prisma.document.create({
            data: {
                name,
                type: type as DocumentType,
                url,
                fileSize,
                uploadDate: new Date(),
                userId,
                assetId: assetId || undefined,
            },
        });
        res.json(document);
    } catch (error) {
        console.error('Error creating document:', error);
        res.status(500).json({ error: 'Failed to create document' });
    }
};

export const deleteDocument = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        await prisma.document.delete({
            where: { id, userId },
        });
        res.json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ error: 'Failed to delete document' });
    }
};
