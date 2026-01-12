
// import fetch from 'node-fetch'; // using native fetch in Node 18+

async function main() {
    console.log('🧪 Starting Local Backend Verification (API Only)...');

    // Use a random UUID that likely matches regex but won't exist
    const dummyId = '00000000-0000-0000-0000-000000000000';

    const updateData = {
        full_name: 'Test Verifier',
        phone: '+15550000000',
        is_2fa_enabled: true,
        two_factor_method: 'sms'
    };

    console.log(`📡 Sending PUT request to local backend users/${dummyId}...`);

    try {
        const response = await fetch(`http://localhost:3000/api/users/${dummyId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });

        const data = await response.json();

        console.log(`✅ Response Status: ${response.status}`);
        console.log('📦 Parameters:', JSON.stringify(data, null, 2));

        if (response.status === 500) {
            console.log('⚠️  Got 500 Error. Checking details...');
            // Check if details mention "column"
            const details = JSON.stringify(data);
            if (details.includes('column') && details.includes('does not exist')) {
                console.error('🚨 DIAGNOSIS: Local DB is missing 2FA columns!');
            } else if (details.includes('Foreign key constrain')) {
                console.log('✅ DIAGNOSIS: Columns exist! (Failed on FK constraint as expected for dummy ID)');
            } else {
                console.log('⚠️  Unknown 500 error.');
            }
        } else if (response.status === 200) {
            console.log('✅ Success! (User created/updated)');
        } else {
            console.log('ℹ️  Other response.');
        }

    } catch (error) {
        console.error('❌ Network Error (Backend likely not running):', error);
    }
}

main();
