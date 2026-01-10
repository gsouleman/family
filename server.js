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

    if (!fs.existsSync(path.join(__dirname, 'dist'))) {
        console.log('Dist directory DOES NOT EXIST. Attempting to build...');
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
    let url = process.env.VITE_API_URL;
    if (url && !url.startsWith('http')) {
        url = `https://${url}`;
    }
    return url || 'http://localhost:3000'; // Fallback
};

const backendUrl = getBackendUrl();
console.log(`Setting up API proxy to: ${backendUrl}`);

app.use('/api', createProxyMiddleware({
    target: backendUrl,
    changeOrigin: true,
    pathRewrite: {
        '^/api': '', // Remove /api prefix when forwarding if backend expects root, BUT backend likely expects /api. 
        // Wait, backend routes are /api/assets.
        // If frontend calls /api/assets, and we use /api proxy.
        // If we don't rewrite, it sends /api/assets to target.
        // If backend is https://backend.com and has routes /api/..., then target should be https://backend.com and we keep /api.
        // If backend is https://backend.com/api, then we might duplicate.
        // Render 'host' is just domain. So backendUrl is https://domain.com.
        // So we keep /api.
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
