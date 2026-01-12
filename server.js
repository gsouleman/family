import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// DEBUG: Log current directory structure
import fs from 'fs';
import { execSync } from 'child_process';
console.log('Current directory:', __dirname);
try {
    console.log('Root contents:', fs.readdirSync(__dirname));

    const distPath = path.join(__dirname, 'dist');
    const indexPath = path.join(distPath, 'index.html');

    if (!fs.existsSync(distPath) || !fs.existsSync(indexPath)) {
        console.log('Dist directory or index.html DOES NOT EXIST. Attempting to build...');
        try {
            console.log('Running: npm run build');
            execSync('npm run build', { stdio: 'inherit' });
            console.log('Build complete.');
        } catch (buildError) {
            console.error('Build FAILED:', buildError);
        }
    }

    if (fs.existsSync(path.join(__dirname, 'dist'))) {
        console.log('Dist contents:', fs.readdirSync(path.join(__dirname, 'dist')));
    } else {
        console.log('Dist directory DOES NOT EXIST');
    }
} catch (e) {
    console.error('Error referencing files:', e);
}

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Proxy API requests to Backend
import { createProxyMiddleware } from 'http-proxy-middleware';

const getBackendUrl = () => {
    // Check BACKEND_URL first, then VITE_API_URL
    let url = process.env.BACKEND_URL || process.env.VITE_API_URL;
    if (url && (url.includes('postgres') || url.includes('@'))) {
        console.error('❌ CRITICAL CONFIG ERROR: usage of Database Connection String detected in BACKEND_URL/VITE_API_URL!');
        console.error('   You have pasted your DATABASE_URL into the Environment Variable meant for the BACKEND SERVICE URL.');
        console.error('   Please set BACKEND_URL to the https://... address of your Backend Web Service on Render.');
    }

    if (url && !url.startsWith('http')) {
        url = `https://${url}`;
    }
    return url || 'http://localhost:3000'; // Fallback
};

const backendUrl = getBackendUrl();
console.log(`Setting up API proxy to: ${backendUrl}`);

// Debug: Log all available environment variable KEYS (not values) to avoid leaking secrets, but verify presence
console.log('Available Env Vars:', Object.keys(process.env).sort());

if (!process.env.BACKEND_URL && !process.env.VITE_API_URL) {
    console.warn('⚠️  WARNING: BACKEND_URL (or VITE_API_URL) is not defined! Proxy is defaulting to localhost. Ensure this is set in Render Dashboard!');
}

app.use('/api', createProxyMiddleware({
    target: backendUrl,
    changeOrigin: true,
    pathRewrite: {
        '^/': '/api/', // Rewrite root (which is stripped by app.use) back to /api/ logic
    },
    onProxyReq: (proxyReq, req, res) => {
        // console.log('Proxying:', req.method, req.url, '->', backendUrl + req.url);
    },
    onError: (err, req, res) => {
        console.error('Proxy Error:', err);
        res.status(500).json({ error: 'Proxy Error', details: err.message });
    }
}));

// Handle client-side routing by serving index.html for all non-file requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Frontend server running on port ${PORT}`);
});
