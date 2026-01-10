import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDocuments = async (req: Request, res: Response) => {
    try {
        const documents = await prisma.document.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(documents);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ error: 'Failed to fetch documents' });
    }
};

export const createDocument = async (req: Request, res: Response) => {
    try {
        const { name, type, url } = req.body;
        const document = await prisma.document.create({
            data: {
                name,
                type,
                url,
                uploadDate: new Date(),
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
        await prisma.document.delete({
            where: { id },
        });
        res.json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ error: 'Failed to delete document' });
    }
};
