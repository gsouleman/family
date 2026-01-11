import { createClient } from '@supabase/supabase-js';

// Configuration
const supabaseUrl = 'https://figvzdehzzsgzttzmslt.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImQ3ZThhYWY4LTVkM2ItNGY1NS05ODhiLTg4YTRjNGEwYjBlMCJ9.eyJwcm9qZWN0SWQiOiJmaWd2emRlaHp6c2d6dHR6bXNsdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY3OTUwNjMwLCJleHAiOjIwODMzMTA2MzAsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.kg6PeoBFeTasJ4ZkZjjVMoXe0knkQcpx-QKMWRGJzM0';

const supabase = createClient(supabaseUrl, supabaseKey);

const ADMIN_USER = {
    email: 'admin@campost.app', // Standardized Admin Email
    password: 'admin',
    fullName: 'Administrator'
};

async function createNeonAdmin() {
    console.log(`\n--- Creating Admin User for Neon Database ---`);
    console.log(`Target: ${supabaseUrl}`);
    console.log(`User: ${ADMIN_USER.email}`);

    // 1. Sign Up (Create Auth User)
    let { data, error } = await supabase.auth.signUp({
        email: ADMIN_USER.email,
        password: ADMIN_USER.password,
        options: {
            data: {
                full_name: ADMIN_USER.fullName,
                role: 'admin',
                account_type: 'family'
            }
        }
    });

    // Handle "User already exists" by Signing In
    if (error && (error.message.includes('already registered') || error.message.includes('already exists'))) {
        console.log(`\nUser already exists in Auth. Signing in to sync...`);
        const signIn = await supabase.auth.signInWithPassword({
            email: ADMIN_USER.email,
            password: ADMIN_USER.password
        });

        if (signIn.error) {
            console.error(`\n[CRITICAL] Could not sign in: ${signIn.error.message}`);
            return;
        }
        data = signIn.data;
        error = null;
    } else if (error) {
        console.error(`\n[CRITICAL] Failed to create user: ${error.message}`);
        return;
    }

    // 1.5 FORCE UPDATE METADATA (Robustness Fix)
    // This ensures that even if the 'profiles' table is broken, the Auth Metadata has the correct role.
    if (data.user) {
        console.log(`\n[ROBUSTNESS] Forcing Auth Metadata update to role='admin'...`);
        const { error: metaError } = await supabase.auth.updateUser({
            data: { role: 'admin', full_name: ADMIN_USER.fullName }
        });

        if (metaError) {
            console.error(`Failed to update metadata: ${metaError.message}`);
        } else {
            console.log(`Metadata updated successfully. (Fallback auth check will now pass)`);
        }
    }

    // 2. Create/Update Profile
    if (data.session) {
        // Set session to allow RLS write access
        await supabase.auth.setSession(data.session);
    }

    const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        email: ADMIN_USER.email,
        full_name: ADMIN_USER.fullName,
        role: 'admin',      // This requires the 'role' column
        status: 'active',   // This requires the 'status' column
        account_type: 'family',
        updated_at: new Date().toISOString()
    });

    if (profileError) {
        console.warn(`\n[WARNING] Profile update failed (Database table might be missing columns).`);
        console.warn(`Reason: ${profileError.message}`);
        console.warn(`But "Admin" access should now work via Metadata Fallback.`);
    } else {
        console.log(`\n[SUCCESS] Admin User and Profile fully configured!`);
    }

    console.log(`\nChecked Credentials:`);
    console.log(`Email: ${ADMIN_USER.email}`);
    console.log(`Password: ${ADMIN_USER.password}`);
    console.log(`-----------------------------------------------`);
}

createNeonAdmin();
