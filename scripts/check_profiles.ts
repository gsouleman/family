import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://figvzdehzzsgzttzmslt.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImQ3ZThhYWY4LTVkM2ItNGY1NS05ODhiLTg4YTRjNGEwYjBlMCJ9.eyJwcm9qZWN0SWQiOiJmaWd2emRlaHp6c2d6dHR6bXNsdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY3OTUwNjMwLCJleHAiOjIwODMzMTA2MzAsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.kg6PeoBFeTasJ4ZkZjjVMoXe0knkQcpx-QKMWRGJzM0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProfiles() {
    console.log('\n--- Profiles Table (All Columns) ---\n');

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error fetching profiles:', error);
        return;
    }

    if (!data || data.length === 0) {
        console.log('No profiles found');
        return;
    }

    console.log('Available columns:');
    console.log(Object.keys(data[0]));
    console.log('\nSample profile data:');
    console.log(JSON.stringify(data[0], null, 2));

  // Now fetch all profiles with the correct columns  const { data: allProfiles } = await supabase
    .from('profiles')
        .select('*')
        .order('email');

    if (allProfiles) {
        console.log(`\n--- Total profiles: ${allProfiles.length} ---`);
        allProfiles.forEach(p => {
            console.log(`Email: ${p.email}`);
            console.log(`  Full Name: ${p.full_name}`);
            console.log(`  2FA Enabled: ${p.is_2fa_enabled || false}`);
            console.log(`  2FA Method: ${p.two_factor_method || 'none'}`);
            console.log('---');
        });
    }
}

checkProfiles().catch(console.error);
