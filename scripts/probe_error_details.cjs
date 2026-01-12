
const https = require('https');

// Payload from the user's failed request
const payload = JSON.stringify({
    "full_name": "Family Estate",
    "phone": "00237675299868",
    "is_2fa_enabled": true,
    "two_factor_method": "phone",
    "role": "admin",
    "account_type": "family",
    "status": "active"
});

const options = {
    hostname: 'family-assets-backend.onrender.com',
    path: '/api/users/cbfa24ff-1242-41d1-93f3-840d7257ad92', // ID from user logs
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length
        // Note: I'm not sending Auth headers, so this might fail with 401 if middleware strictness changed. 
        // But the user got 500, so likely 401 isn't the issue, or the 500 happens before auth? 
        // Wait, middleware is global.
        // If I get 401, that confirms the server is reachable and logic is running.
        // If I get 500, I see the error.
    }
};

console.log('--- START PROBE ---');
const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log('HEADERS:', JSON.stringify(res.headers, null, 2));

    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log('BODY_RAW:', body);
        try {
            const json = JSON.parse(body);
            console.log('BODY_JSON:', JSON.stringify(json, null, 2));
        } catch (e) {
            console.log('BODY is not JSON (or empty)');
        }
        console.log('--- END PROBE ---');
    });
});

req.on('error', (e) => {
    console.error(`REQUEST ERROR: ${e.message}`);
});

req.write(payload);
req.end();
