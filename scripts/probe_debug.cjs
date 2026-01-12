
const https = require('https');

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
    path: '/api/users/cbfa24ff-1242-41d1-93f3-840d7257ad92',
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length
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
            console.log('BODY is not JSON');
        }
        console.log('--- END PROBE ---');
    });
});

req.on('error', (e) => {
    console.error(`REQUEST ERROR: ${e.message}`);
});

req.write(payload);
req.end();
