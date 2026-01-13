
import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
declare global {
    var prisma: PrismaClient | undefined;
}

const getDatabaseUrl = () => {
    let url = process.env.DATABASE_URL;
    if (!url) {
        console.error('❌ DATABASE_URL environment variable is not set!');
        console.error('📝 Please set DATABASE_URL in your Render dashboard:');
        console.error('   1. Go to https://dashboard.render.com');
        console.error('   2. Select your backend service');
        console.error('   3. Go to Environment tab');
        console.error('   4. Add DATABASE_URL with your Neon connection string');
        throw new Error('DATABASE_URL environment variable is required');
    }

    // Fix for Neon Pooling: Force Simple Query Mode (pgbouncer=true)
    // This prevents "cached plan must not change result type" errors
    if (!url.includes('pgbouncer=true')) {
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}pgbouncer=true`;
        console.log('🔌 Adjusted DATABASE_URL for PgBouncer (Simple Query Mode)');
    }
    return url;
};

const prisma = global.prisma || new PrismaClient({
    datasources: {
        db: {
            url: getDatabaseUrl(),
        },
    },
});

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}

export default prisma;
