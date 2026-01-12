import { createClient } from '@supabase/supabase-js';

// Configuration from src/lib/supabase.ts
const supabaseUrl = 'https://figvzdehzzsgzttzmslt.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImQ3ZThhYWY4LTVkM2ItNGY1NS05ODhiLTg4YTRjNGEwYjBlMCJ9.eyJwcm9qZWN0SWQiOiJmaWd2emRlaHp6c2d6dHR6bXNsdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY3OTUwNjMwLCJleHAiOjIwODMzMTA2MzAsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.kg6PeoBFeTasJ4ZkZjjVMoXe0knkQcpx-QKMWRGJzM0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugAdmin() {
    const email = 'admin@campost.app';
    const password = 'admin';

    console.log(`Debugging Admin User: ${email}...`);

    console.log('1. Attempting to Sign In...');
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('Login Failed:', error.message);
        return;
    }

    console.log('Login Successful!');

    // Test Metadata Write
    console.log('2. Writing Test Metadata...');
    const buildTime = new Date().toISOString();
    const { data: updateData, error: updateError } = await supabase.auth.updateUser({
        data: {
            role: 'admin',
            account_type: 'family',
            last_debug_run: buildTime
        }
    });

    if (updateError) {
        console.error('Metadata Write Failed:', updateError.message);
    } else {
        console.log('Metadata Write Success!');
        console.log('Updated User Metadata:', JSON.stringify(updateData.user.user_metadata, null, 2));
    }

    // Read back via getUser
    console.log('3. Reading back via getUser()...');
    const { data: { user: freshlyFetchedUser }, error: getError } = await supabase.auth.getUser();

    if (getError) {
        console.error('getUser Failed:', getError.message);
    } else {
        console.log('Fresh User Metadata:', JSON.stringify(freshlyFetchedUser.user_metadata, null, 2));
    }

    console.log('\n4. Checking "profiles" table again (ignoring error if cache issue)...');
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

    if (profileError) {
        console.error('Profile Fetch Error:', profileError.message);
    } else {
        console.log('Profile Data:', JSON.stringify(profile, null, 2));
    }
}

debugAdmin();
