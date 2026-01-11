import { createClient } from '@supabase/supabase-js';

// Configuration from src/lib/supabase.ts
const supabaseUrl = 'https://figvzdehzzsgzttzmslt.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImQ3ZThhYWY4LTVkM2ItNGY1NS05ODhiLTg4YTRjNGEwYjBlMCJ9.eyJwcm9qZWN0SWQiOiJmaWd2emRlaHp6c2d6dHR6bXNsdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY3OTUwNjMwLCJleHAiOjIwODMzMTA2MzAsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.kg6PeoBFeTasJ4ZkZjjVMoXe0knkQcpx-QKMWRGJzM0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
    const email = 'admin@campost.app';
    const password = 'admin'; // Note: check if min length is enforced
    const fullName = 'Administrator';

    console.log(`Processing Admin User: ${email}...`);

    // 1. Try to Sign Up
    let { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                role: 'admin',
                account_type: 'family'
            }
        }
    });

    if (error) {
        // If user already exists, try to sign in to get the ID
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
            console.log('User already exists. Attempting to sign in to update profile...');
            const signInResult = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInResult.error) {
                console.error('Could not sign in with existing user. Password might be different?', signInResult.error.message);
                return;
            }

            data = signInResult.data; // Use the signed-in session data
        } else {
            console.error('Error creating user:', error.message);
            return;
        }
    }

    // 2. Ensure Profile Exists
    if (data.user) {
        console.log(`User ID: ${data.user.id}`);

        // Check if we have a session to respect RLS (if enabled)
        if (data.session) {
            await supabase.auth.setSession(data.session);
        }

        const { error: profileError } = await supabase.from('profiles').upsert({
            id: data.user.id,
            email: email,
            full_name: fullName,
            role: 'admin',
            account_type: 'family',
            status: 'active',
            created_at: new Date().toISOString(),
        });

        if (profileError) {
            console.error('Failed to create/update profile:', profileError.message);
            console.log('Check if "profiles" table exists and has the correct columns (id, email, full_name, role, account_type, status).');
        } else {
            console.log('SUCCESS: Admin profile created/updated with role "admin".');
            console.log(`Credentials -> Email: ${email}, Password: ${password}`);
        }

    } else {
        console.log('Unexpected state: No user data returned.');
    }
}

createAdmin();
