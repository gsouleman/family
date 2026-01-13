
import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
declare global {
    var prisma: PrismaClient | undefined;
}

const getDatabaseUrl = () => {
    let url = process.env.DATABASE_URL;

    if (!url) {
        console.error('❌ DATABASE_URL environment variable is not set!');
        console.error('------------------------------------------------------------------');
        console.error('🔍 DIAGNOSIS:');
        console.error('1. IF THIS IS THE BACKEND SERVICE:');
        console.error('   - Go to Render Dashboard > Environment');
        console.error('   - Add DATABASE_URL = postgresql://...');
        console.error('');
        console.error('2. IF THIS IS THE FRONTEND SERVICE:');
        console.error('   - 🛑 YOUR CONFIGURATION IS WRONG!');
        console.error('   - You are running Backend code in the Frontend Service.');
        console.error('   - FIX: Go to Settings > Start Command. Change to: npm start');
        console.error('------------------------------------------------------------------');
        throw new Error('DATABASE_URL is missing. See logs above for fix.');
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
