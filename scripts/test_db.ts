
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://neondb_owner:npg_9geBaToXCs1v@ep-noisy-cell-a4rcfopc-pooler.us-east-1.aws.neon.tech/Family?sslmode=require&channel_binding=require"
        }
    }
});

async function main() {
    console.log("Testing connection to Neon DB...");
    try {
        const users = await prisma.profile.findMany();
        console.log("Successfully fetched Profiles from Neon:", users);

        const count = await prisma.user.count();
        console.log("User count in Neon:", count);

    } catch (e) {
        console.error("Connection Failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
