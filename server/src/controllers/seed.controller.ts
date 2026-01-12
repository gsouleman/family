import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AssetCategory, AssetStatus } from '@prisma/client';

export const seedData = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: 'User authentication required' });
        }

        console.log(`Seeding data for user: ${userId}`);

        // Embedded data from family.ts to ensure standalone execution
        const assets = [
            { id: 'asset-1', name: 'Family Villa - Palm Jumeirah', value: 4500000, category: AssetCategory.real_estate, status: AssetStatus.active },
            { id: 'asset-2', name: 'Downtown Apartment', value: 1200000, category: AssetCategory.real_estate, status: AssetStatus.active },
            { id: 'asset-4', name: 'Investment Portfolio', value: 850000, category: AssetCategory.investment, status: AssetStatus.active },
            { id: 'asset-5', name: 'Sukuk Bonds', value: 500000, category: AssetCategory.investment, status: AssetStatus.active },
            { id: 'asset-6', name: 'Mercedes-Benz S-Class', value: 180000, category: AssetCategory.vehicle, status: AssetStatus.active },
            { id: 'asset-9', name: 'Jewelry Collection', value: 250000, category: AssetCategory.other, status: AssetStatus.active },
            { id: 'asset-12', name: 'Trading Co LLC', value: 2000000, category: AssetCategory.business, status: AssetStatus.active },
            { id: 'asset-16', name: 'Beach House - Maldives', value: 2100000, category: AssetCategory.real_estate, status: AssetStatus.active },
            { id: 'asset-17', name: 'Family Yacht', value: 750000, category: AssetCategory.vehicle, status: AssetStatus.active },
        ];

        const heirs = [
            { id: 'heir-1', name: 'Fatima Al-Rahman', relation: 'spouse_wife', email: 'fatima@family.com', phone: '+971 50 123 4567', dateOfBirth: '1975-03-15', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
            { id: 'heir-2', name: 'Ahmed Al-Rahman', relation: 'son', email: 'ahmed@family.com', phone: '+971 50 234 5678', dateOfBirth: '1998-08-22', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
            { id: 'heir-3', name: 'Omar Al-Rahman', relation: 'son', email: 'omar@family.com', phone: '+971 50 345 6789', dateOfBirth: '2001-11-05', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80' },
            { id: 'heir-4', name: 'Layla Al-Rahman', relation: 'daughter', email: 'layla@family.com', phone: '+971 50 456 7890', dateOfBirth: '2003-06-18', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80' },
            { id: 'heir-5', name: 'Sara Al-Rahman', relation: 'daughter', email: 'sara@family.com', phone: '+971 50 567 8901', dateOfBirth: '2006-02-28', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80' },
        ];

        const documents = [
            { id: 'doc-1', name: 'Family Will - 2024 Update', type: 'will', uploadDate: '2024-01-15' },
            { id: 'doc-2', name: 'Palm Jumeirah Villa - Title Deed', type: 'title_deed', relatedAssetId: 'asset-1' },
            { id: 'doc-7', name: 'Investment Portfolio Statement', type: 'other', relatedAssetId: 'asset-4' }
        ];

        const notifications = [
            { id: 'notif-1', title: 'Welcome to Family Assets', message: 'Your dashboard has been populated with demo data.', date: new Date().toISOString().split('T')[0], read: false, type: 'general' }
        ];

        // Seed Assets
        for (const asset of assets) {
            await prisma.asset.upsert({
                where: { id: asset.id },
                update: { userId },
                create: {
                    id: asset.id,
                    name: asset.name,
                    value: asset.value,
                    category: asset.category,
                    status: asset.status,
                    userId,
                    description: 'Demo ' + asset.name,
                    location: 'Dubai, UAE',
                    isForSale: true
                }
            });
        }

        // Seed Heirs
        for (const heir of heirs) {
            await prisma.heir.upsert({
                where: { id: heir.id },
                update: { userId },
                create: {
                    id: heir.id,
                    name: heir.name,
                    relation: heir.relation,
                    email: heir.email,
                    phone: heir.phone,
                    dateOfBirth: new Date(heir.dateOfBirth),
                    userId,
                    avatar: heir.avatar
                }
            });
        }

        // Seed Documents
        for (const doc of documents) {
            await prisma.document.upsert({
                where: { id: doc.id },
                update: { userId },
                create: {
                    id: doc.id,
                    name: doc.name,
                    type: doc.type,
                    fileUrl: 'https://example.com/demo.pdf',
                    userId,
                    relatedAssetId: doc.relatedAssetId
                }
            });
        }

        // Seed Notifications
        for (const notif of notifications) {
            await prisma.notification.create({
                data: {
                    title: notif.title,
                    message: notif.message,
                    date: new Date(notif.date),
                    read: notif.read,
                    type: notif.type,
                    userId
                }
            });
        }

        res.json({ message: 'Demo data seeded successfully' });

    } catch (error) {
        console.error('Seeding failed:', error);
        res.status(500).json({ error: 'Failed to seed data' });
    }
};
