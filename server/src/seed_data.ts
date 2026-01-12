import 'dotenv/config';
import prisma from './lib/prisma';
import { initialHeirs, initialDocuments, initialTransactions, initialNotifications } from '../../src/data/family';
import { AssetCategory, AssetStatus } from '@prisma/client';

const seedForUser = async (email: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            console.error(`User with email ${email} not found.`);
            process.exit(1);
        }

        const userId = user.id;
        console.log(`Seeding data for user: ${user.email} (${userId})`);

        // Seed Assets manually (since they are not in family.ts directly as a list, but transactions refer to them)
        // I will create some dummy assets based on the transactions or hardcoded values
        const assets = [
            { id: 'asset-1', name: 'Family Villa - Palm Jumeirah', value: 4500000, category: AssetCategory.property, status: AssetStatus.active },
            { id: 'asset-2', name: 'Downtown Apartment', value: 1200000, category: AssetCategory.property, status: AssetStatus.active },
            { id: 'asset-4', name: 'Investment Portfolio', value: 850000, category: AssetCategory.investment, status: AssetStatus.active },
            { id: 'asset-5', name: 'Sukuk Bonds', value: 500000, category: AssetCategory.investment, status: AssetStatus.active },
            { id: 'asset-6', name: 'Mercedes-Benz S-Class', value: 180000, category: AssetCategory.vehicle, status: AssetStatus.active },
            { id: 'asset-9', name: 'Jewelry Collection', value: 250000, category: AssetCategory.other, status: AssetStatus.active },
            { id: 'asset-12', name: 'Trading Co LLC', value: 2000000, category: AssetCategory.business, status: AssetStatus.active },
            { id: 'asset-16', name: 'Beach House - Maldives', value: 2100000, category: AssetCategory.property, status: AssetStatus.active },
            { id: 'asset-17', name: 'Family Yacht', value: 750000, category: AssetCategory.vehicle, status: AssetStatus.active },
        ];

        for (const asset of assets) {
            await prisma.asset.upsert({
                where: { id: asset.id },
                update: { userId }, // Transfer ownership if exists
                create: {
                    id: asset.id,
                    name: asset.name,
                    value: asset.value,
                    category: asset.category,
                    status: asset.status,
                    userId,
                    description: 'Seeded asset',
                    location: 'Dubai, UAE',
                    isForSale: true
                }
            });
        }
        console.log(`Verifying/Seeding ${assets.length} assets... Done.`);

        // Seed Heirs
        for (const heir of initialHeirs) {
            const { id, ...data } = heir;
            // Map frontend relation to backend enum if needed, or keep string if flexible
            // Backend Heir model might differ slightly.
            // Let's assume schema matches for now or use 'other'
            await prisma.heir.upsert({
                where: { id },
                update: { userId },
                create: {
                    id,
                    name: data.name,
                    relation: data.relation,
                    email: data.email,
                    phone: data.phone,
                    dateOfBirth: new Date(data.dateOfBirth),
                    userId,
                    avatar: data.avatar
                }
            });
        }
        console.log(`Verifying/Seeding ${initialHeirs.length} heirs... Done.`);

        // Seed Documents
        for (const doc of initialDocuments) {
            const { id, ...data } = doc;
            const docTypeMap: any = { 'will': 'other', 'deed': 'deed', 'certificate': 'certificate', 'other': 'other' };

            await prisma.document.upsert({
                where: { id },
                update: { userId },
                create: {
                    id,
                    name: data.name,
                    type: docTypeMap[data.type] || 'other',
                    url: 'https://example.com/doc.pdf', // Mock URL
                    userId,
                    assetId: data.relatedAssetId
                }
            });
        }
        console.log(`Verifying/Seeding ${initialDocuments.length} documents... Done.`);

        console.log('Seeding completed successfully.');

    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await prisma.$disconnect();
    }
};

const email = process.argv[2];
if (!email) {
    console.error('Please provide an email argument.');
    process.exit(1);
}

seedForUser(email);
