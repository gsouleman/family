
const getApiUrl = () => {
    let url = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    if (url && !url.startsWith('http')) {
        url = `https://${url}`;
    }
    return url;
};

const API_URL = getApiUrl();

// Helper to get headers
const getHeaders = () => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    // In a real app, get this from AuthContext
    // For now, we rely on the backend middleware to handle default user or user ID
    // headers['X-User-ID'] = ... 

    return headers;
};

export const api = {
    // Assets
    getAssets: async () => {
        const res = await fetch(`${API_URL}/assets`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch assets');
        return res.json();
    },

    createAsset: async (data: any) => {
        const res = await fetch(`${API_URL}/assets`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create asset');
        return res.json();
    },

    updateAsset: async (id: string, data: any) => {
        const res = await fetch(`${API_URL}/assets/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update asset');
        return res.json();
    },

    deleteAsset: async (id: string) => {
        const res = await fetch(`${API_URL}/assets/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (!res.ok) throw new Error('Failed to delete asset');
        return res.json();
    },

    // Heirs
    getHeirs: async () => {
        const res = await fetch(`${API_URL}/heirs`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch heirs');
        return res.json();
    },

    createHeir: async (data: any) => {
        const res = await fetch(`${API_URL}/heirs`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create heir');
        return res.json();
    },

    updateHeir: async (id: string, data: any) => {
        const res = await fetch(`${API_URL}/heirs/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update heir');
        return res.json();
    },

    deleteHeir: async (id: string) => {
        const res = await fetch(`${API_URL}/heirs/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (!res.ok) throw new Error('Failed to delete heir');
        return res.json();
    },
};
