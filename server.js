import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// DEBUG: Log current directory structure
import fs from 'fs';
console.log('Current directory:', __dirname);
try {
    console.log('Root contents:', fs.readdirSync(__dirname));
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

// Handle client-side routing by serving index.html for all non-file requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Frontend server running on port ${PORT}`);
});
