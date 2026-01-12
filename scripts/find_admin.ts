import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const findUser = async () => {
    try {
        const email = 'gsouleman@gmail.com';
        console.log(`Searching for user: ${email}...`);

        const user = await prisma.user.findFirst({
            where: { email: { equals: email, mode: 'insensitive' } }
        });

        if (user) {
            console.log('FOUND USER:', user);
        } else {
            console.log('User NOT found. Listing all users to verify:');
            const allUsers = await prisma.user.findMany();
            console.log(allUsers);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
};

findUser();
