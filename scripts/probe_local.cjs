
// const fetch = require('node-fetch');

async function main() {
    const userId = 'cbfa24ff-1242-41d1-93f3-840d7257ad92';
    const url = `http://localhost:3000/api/users/${userId}`;

    console.log(`Probing LOCAL URL: ${url}`);

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': userId,
                'x-user-email': 'test@test.com'
            },
            body: JSON.stringify({
                full_name: "Test Local Update",
                phone: "+15550199",
                is_2fa_enabled: true,
                two_factor_method: 'phone'
            })
        });

        console.log(`STATUS: ${response.status}`);
        const text = await response.text();
        console.log(`BODY: ${text}`);

    } catch (error) {
        console.error("Probe failed:", error);
    }
}

main();
