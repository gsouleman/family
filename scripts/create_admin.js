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
                console.error('Could not sign in with existing user:', signInResult.error.message);
                return;
            }

            data = signInResult.data; // Use the signed-in session data
        } else {
            console.error('Error creating user:', error.message);
            return;
        }
    }

    // 2. Update User Metadata (Crucial if user already existed without metadata)
    if (data.user) {
        console.log(`User ID: ${data.user.id}`);

        const { error: updateError } = await supabase.auth.updateUser({
            data: {
                full_name: fullName,
                role: 'admin',
                account_type: 'family'
            }
        });

        if (updateError) {
            console.error('Failed to update user metadata:', updateError.message);
        } else {
            console.log('User metadata updated successfully.');
        }

        // 3. Ensure Profile Exists
        // Check if we have a session to respect RLS (if enabled)
        if (data.session) {
            await supabase.auth.setSession(data.session);
        }

        console.log('Attempting full profile upsert (role, status, etc.)...');
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
            console.warn('Full profile update failed:', profileError.message);

            // Fallback: Try basic profile creation (ignoring missing columns)
            console.log('Fallback: Attempting basic profile upsert (id, email, name only)...');
            const { error: basicError } = await supabase.from('profiles').upsert({
                id: data.user.id,
                email: email,
                full_name: fullName,
                created_at: new Date().toISOString(),
            });

            if (basicError) {
                console.error('Basic profile creation also failed:', basicError.message);
            } else {
                console.log('SUCCESS: Basic admin profile created. (Role applied via Metadata)');
            }
        } else {
            console.log('SUCCESS: Admin profile created/updated with role "admin".');
        }

    } else {
        console.log('Unexpected state: No user data returned.');
    }
}

createAdmin();
