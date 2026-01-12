import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // "test@example.com" user from previous session
    const userId = "0986f33c-023d-436b-b1a2-e4bdc63a749b";

    console.log(`Checking for user ${userId}...`);

    const user = await prisma.profile.upsert({
        where: { id: userId },
        update: {
            account_type: 'personal',
            full_name: 'Test Personal User',
            email: 'test@example.com'
        },
        create: {
            id: userId,
            email: 'test@example.com',
            full_name: 'Test Personal User',
            role: 'user',
            account_type: 'personal',
            status: 'active'
        }
    });

    console.log("User upserted successfully:", user);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
