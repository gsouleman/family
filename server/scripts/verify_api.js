"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const BASE_URL = 'http://localhost:3001/api';
async function testAPI() {
    console.log('Starting API Verification...');
    try {
        // 1. Create an Asset
        console.log('Testing POST /api/assets...');
        const assetRes = await (0, node_fetch_1.default)(`${BASE_URL}/assets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'API Test Asset',
                category: 'cash',
                value: 1000,
                status: 'active'
            })
        });
        if (!assetRes.ok)
            throw new Error(`Asset creation failed: ${assetRes.status} ${assetRes.statusText} - ${await assetRes.text()}`);
        const asset = await assetRes.json();
        console.log('✅ Asset created:', asset.id);
        // 2. Get Assets
        console.log('Testing GET /api/assets...');
        const assetsRes = await (0, node_fetch_1.default)(`${BASE_URL}/assets`);
        const assets = await assetsRes.json();
        if (assets.length === 0)
            throw new Error('No assets found');
        console.log('✅ Fetched assets:', assets.length);
        // 3. Create Heir
        console.log('Testing POST /api/heirs...');
        const heirRes = await (0, node_fetch_1.default)(`${BASE_URL}/heirs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'API Test Heir',
                relation: 'son'
            })
        });
        if (!heirRes.ok)
            throw new Error(`Heir creation failed: ${heirRes.status} ${heirRes.statusText}`);
        const heir = await heirRes.json();
        console.log('✅ Heir created:', heir.id);
        console.log('🎉 API Verification Successful!');
    }
    catch (error) {
        console.error('❌ Verification Failed:', error);
        process.exit(1);
    }
}
testAPI();
