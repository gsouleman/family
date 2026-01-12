
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const userId = 'cbfa24ff-1242-41d1-93f3-840d7257ad92'; // User's failed ID
    console.log(`Checking DB for user: ${userId}`);

    const user = await prisma.profile.findUnique({
        where: { id: userId },
    });

    if (!user) {
        console.log('User NOT FOUND in DB');
    } else {
        console.log('User found:');
        console.log(JSON.stringify(user, null, 2));
        console.log('---');
        console.log(`Phone: ${user.phone}`);
        console.log(`2FA Enabled: ${user.is_2fa_enabled}`);
        console.log(`2FA Method: ${user.two_factor_method}`);
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
