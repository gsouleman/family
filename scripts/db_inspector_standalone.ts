import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const inspect = async () => {
    try {
        console.log('--- Database Inspector (Standalone) ---');

        // 1. List Users
        const users = await prisma.user.findMany({
            include: {
                _count: {
                    select: { assets: true, heirs: true, documents: true }
                }
            }
        });

        console.log('\n--- Users (JSON) ---');
        console.log(JSON.stringify(users, null, 2));

        // 2. Count Total Assets
        const allAssets = await prisma.asset.findMany({
            select: { id: true, name: true, userId: true, status: true }
        });
        console.log(`\n--- Assets (${allAssets.length}) ---`);
        console.log(JSON.stringify(allAssets, null, 2));

    } catch (error) {
        console.error('Inspection failed:', error);
    } finally {
        await prisma.$disconnect();
    }
};

inspect();
