
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://neondb_owner:npg_9geBaToXCs1v@ep-noisy-cell-a4rcfopc-pooler.us-east-1.aws.neon.tech/Family?sslmode=require&channel_binding=require"
        }
    }
});

async function main() {
    console.log("--- DEBUG START ---");

    // 1. Test User Connection (Reference for FKs)
    try {
        console.log("Testing User Model...");
        const users = await prisma.user.findMany({ take: 1 });
        console.log("✅ Users OK. Count:", users.length);
    } catch (e: any) {
        console.error("❌ User Model FAILED:", e.message);
    }

    // 2. Test Asset Model
    try {
        console.log("Testing Asset Model...");
        const assets = await prisma.asset.findMany({ take: 1 });
        console.log("✅ Assets OK. Count:", assets.length);
    } catch (e: any) {
        console.error("❌ Asset Model FAILED:", e.message);
    }

    // 3. Test Notification Model
    try {
        console.log("Testing Notification Model...");
        const notifications = await prisma.notification.findMany({ take: 1 });
        console.log("✅ Notifications OK. Count:", notifications.length);
    } catch (e: any) {
        console.error("❌ Notification Model FAILED:", e.message);
    }

    console.log("--- DEBUG END ---");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
