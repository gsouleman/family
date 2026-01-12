
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- CORRECTING ADMIN NAME ---');

    const email = 'gsouleman@gmail.com';
    const correctName = 'GHOUENZEN SOULEMANOU';

    try {
        const user = await prisma.profile.findFirst({
            where: { email: email }
        });

        if (user) {
            console.log(`Found user: ${user.email} with name: "${user.full_name}"`);

            const updated = await prisma.profile.update({
                where: { id: user.id },
                data: {
                    full_name: correctName,
                    role: 'admin',
                    account_type: 'personal',
                    status: 'active'
                }
            });
            console.log(`Updated user to name: "${updated.full_name}"`);
        } else {
            console.log('User not found!');
        }
    } catch (e) {
        console.error('Error updating user:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
