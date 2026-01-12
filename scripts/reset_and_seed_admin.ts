
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

// Initialize Prisma
const prisma = new PrismaClient();

// Hardcoded keys from src/lib/supabase.ts (as found in previous steps)
const supabaseUrl = 'https://figvzdehzzsgzttzmslt.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImQ3ZThhYWY4LTVkM2ItNGY1NS05ODhiLTg4YTRjNGEwYjBlMCJ9.eyJwcm9qZWN0SWQiOiJmaWd2emRlaHp6c2d6dHR6bXNsdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY3OTUwNjMwLCJleHAiOjIwODMzMTA2MzAsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.kg6PeoBFeTasJ4ZkZjjVMoXe0knkQcpx-QKMWRGJzM0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('--- STARTING USER RESET & SEED ---');

    // 1. Delete all profiles (Backend Data)
    console.log('Deleting all profiles from Database...');
    try {
        const deleted = await prisma.profile.deleteMany({});
        console.log(`Deleted ${deleted.count} profiles.`);
    } catch (e) {
        console.error('Error deleting profiles:', e);
    }

    // 2. Create Admin User
    const adminEmail = 'gsouleman@gmail.com';
    const adminPassword = 'Helltocell';
    const adminName = 'GHOUENZEN SOULEMANOU';

    console.log(`Attempting to sign up admin: ${adminEmail}`);

    // Try to sign up (this handles auth.users creation if not exists)
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword,
        options: {
            data: {
                full_name: adminName,
                account_type: 'personal', // Assuming personal for admin
                role: 'admin'
            }
        }
    });

    let userId = signUpData.user?.id;

    if (signUpError) {
        console.log('SignUp Error (User likely exists):', signUpError.message);
        if (signUpError.message.includes('already registered') || signUpError.message.includes('User already exists')) {
            // User exists in Auth, but we just wiped their profile. We need their ID.
            // Since we don't have service key to search auth.users, we try to SignIn to get the ID.
            console.log('Attempting to SignIn to retrieve ID...');
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email: adminEmail,
                password: adminPassword
            });

            if (signInError) {
                console.error('SignIn failed.', signInError.message);
                console.log('Trying fallback with known ID: bcb1d4de-7960-4716-a346-992037fe4aea');
                userId = 'bcb1d4de-7960-4716-a346-992037fe4aea';
            } else {
                userId = signInData.user?.id;
            }
        }
    }

    if (userId) {
        console.log(`User ID identified: ${userId}`);

        // 3. Create/Ensure Admin Profile exists with correct details
        console.log('Creating/Updating Admin Profile in Database...');
        const profile = await prisma.profile.upsert({
            where: { id: userId },
            update: {
                full_name: adminName,
                role: 'admin',
                account_type: 'personal',
                email: adminEmail,
                status: 'active'
            },
            create: {
                id: userId,
                full_name: adminName,
                role: 'admin',
                account_type: 'personal',
                email: adminEmail,
                status: 'active'
            }
        });

        console.log('Admin Profile Set:', profile);
        console.log('--- SUCCESS ---');
    } else {
        console.error('Could not determine User ID. Admin creation failed.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
