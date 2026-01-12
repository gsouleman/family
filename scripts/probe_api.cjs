
const https = require('https');
const fs = require('fs');

const data = JSON.stringify({
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
        'Content-Length': data.length
    }
};

console.log('Sending request to:', `https://${options.hostname}${options.path}`);

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log('BODY: ' + body);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
