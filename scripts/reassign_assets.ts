import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const migrate = async () => {
    try {
        const TARGET_EMAIL = 'gsouleman@gmail.com';
        console.log(`Migrating all assets to: ${TARGET_EMAIL}`);

        const targetUser = await prisma.user.findFirst({
            where: { email: { equals: TARGET_EMAIL, mode: 'insensitive' } }
        });

        if (!targetUser) {
            console.error('Target user not found!');
            return;
        }

        const targetUserId = targetUser.id;
        console.log(`Target User ID: ${targetUserId}`);

        // Update Name if "Unknown"
        if (targetUser.fullName === 'Unknown User') {
            console.log('Updating user name to GHOUENZEN SOULEMANOU...');
            await prisma.user.update({
                where: { id: targetUserId },
                data: { fullName: 'GHOUENZEN SOULEMANOU' }
            });
            await prisma.profile.update({
                where: { id: targetUserId },
                data: { full_name: 'GHOUENZEN SOULEMANOU' }
            });
        }

        // Reassign Assets
        const assetsUpdate = await prisma.asset.updateMany({
            where: { userId: { not: targetUserId } },
            data: { userId: targetUserId }
        });
        console.log(`Migrated ${assetsUpdate.count} assets to target user.`);

        // Reassign Heirs
        const heirsUpdate = await prisma.heir.updateMany({
            where: { userId: { not: targetUserId } },
            data: { userId: targetUserId }
        });
        console.log(`Migrated ${heirsUpdate.count} heirs.`);

        // Reassign Documents
        const docsUpdate = await prisma.document.updateMany({
            where: { userId: { not: targetUserId } },
            data: { userId: targetUserId }
        });
        console.log(`Migrated ${docsUpdate.count} documents.`);

        // Reassign Notifications
        const notifUpdate = await prisma.notification.updateMany({
            where: { userId: { not: targetUserId } },
            data: { userId: targetUserId }
        });
        console.log(`Migrated ${notifUpdate.count} notifications.`);

        // Reassign Ledger Entries
        const ledgerUpdate = await prisma.ledgerEntry.updateMany({
            where: { userId: { not: targetUserId } },
            data: { userId: targetUserId }
        });
        console.log(`Migrated ${ledgerUpdate.count} ledger entries.`);


    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await prisma.$disconnect();
    }
};

migrate();
