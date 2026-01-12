
import { createClient } from '@supabase/supabase-js';

// Hardcoded keys from src/lib/supabase.ts
const supabaseUrl = 'https://figvzdehzzsgzttzmslt.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImQ3ZThhYWY4LTVkM2ItNGY1NS05ODhiLTg4YTRjNGEwYjBlMCJ9.eyJwcm9qZWN0SWQiOiJmaWd2emRlaHp6c2d6dHR6bXNsdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY3OTUwNjMwLCJleHAiOjIwODMzMTA2MzAsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.kg6PeoBFeTasJ4ZkZjjVMoXe0knkQcpx-QKMWRGJzM0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectDuplicates() {
    console.log('--- Inspecting Profiles for gsouleman@gmail.com ---');

    // Check profiles
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(50);

    if (error) {
        console.error('Error fetching profiles:', error);
    } else {
        console.log(`Found ${profiles.length} profiles:`);
        console.log(JSON.stringify(profiles, null, 2));
    }

    console.log('\n(Note: Cannot inspect auth.users without service role key)');
}

inspectDuplicates();
