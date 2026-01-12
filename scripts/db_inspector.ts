import 'dotenv/config';
import prisma from '../server/src/lib/prisma';

// Usage: npx ts-node scripts/db_inspector.ts

const inspect = async () => {
    try {
        console.log('--- Database Inspector ---');
        console.log('Connecting to DB via:', process.env.DATABASE_URL ? 'URL Present' : 'URL MISSING');

        // 1. List Users
        const users = await prisma.user.findMany({
            include: {
                _count: {
                    select: { assets: true, heirs: true, documents: true }
                }
            }
        });

        console.log('\n--- Users & Data Counts ---');
        if (users.length === 0) {
            console.log('No users found in the User table.');
        } else {
            console.table(users.map(u => ({
                id: u.id,
                email: u.email,
                assets: u._count.assets,
                heirs: u._count.heirs,
                docs: u._count.documents
            })));
        }

        // 2. Count Total Assets (Orphaned check)
        const totalAssets = await prisma.asset.count();
        console.log(`\nTotal Assets in DB: ${totalAssets}`);

        if (totalAssets > 0 && users.length > 0) {
            const userAssetCount = users.reduce((acc, u) => acc + u._count.assets, 0);
            if (userAssetCount < totalAssets) {
                console.warn(`WARNING: ${totalAssets - userAssetCount} assets are orphaned (not linked to any current User record).`);
            }
        }

        // 3. List Profiles
        const profiles = await prisma.profile.findMany();
        console.log('\n--- Profiles ---');
        if (profiles.length === 0) {
            console.log('No profiles found.');
        } else {
            console.table(profiles.map(p => ({
                id: p.id,
                email: p.email,
                role: p.role
            })));
        }

    } catch (error) {
        console.error('Inspection failed:', error);
    } finally {
        await prisma.$disconnect();
    }
};

inspect();
