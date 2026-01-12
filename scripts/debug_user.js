
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env');
    console.log('Available Env:', Object.keys(process.env));
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkUser(email) {
    console.log(`Checking profile for: ${email}`);

    // Check Profiles Table
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('email', email) // Case insensitive match
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
    } else {
        console.log('--- Profile Data ---');
        console.log(profile);
        console.log('--------------------');

        if (profile) {
            if (profile.account_type === 'personal') {
                console.log('✅ Account Type is PERSONAL. Branding SHOULD be:', profile.full_name);
            } else {
                console.log('❌ Account Type is:', profile.account_type, '(Expected: personal)');
                console.log('   Branding defaults to: Family Estate');

                // AUTO FIX
                console.log('Attempting to FIX account type to personal...');
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({ account_type: 'personal' })
                    .eq('id', profile.id);

                if (updateError) console.error('Update failed:', updateError);
                else console.log('✅ Update successful! Please refresh the page.');
            }
        } else {
            console.log('❌ No profile found for this user.');
        }
    }
}

checkUser('gsouleman@gmail.com');
