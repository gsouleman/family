
const getApiUrl = () => {
    // @ts-ignore
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
    // Documents
    getDocuments: async () => {
        const res = await fetch(`${API_URL}/documents`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch documents');
        return res.json();
    },

    createDocument: async (data: any) => {
        const res = await fetch(`${API_URL}/documents`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create document');
        return res.json();
    },

    deleteDocument: async (id: string) => {
        const res = await fetch(`${API_URL}/documents/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (!res.ok) throw new Error('Failed to delete document');
        return res.json();
    },

    // Transactions
    getTransactions: async () => {
        const res = await fetch(`${API_URL}/transactions`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch transactions');
        return res.json();
    },

    createTransaction: async (data: any) => {
        const res = await fetch(`${API_URL}/transactions`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create transaction');
        return res.json();
    },

    // Distributions (Calculator)
    getDistributions: async () => {
        const res = await fetch(`${API_URL}/distributions`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch distributions');
        return res.json();
    },

    createDistribution: async (data: any) => {
        const res = await fetch(`${API_URL}/distributions`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create distribution');
        return res.json();
    },

    // Notifications
    getNotifications: async () => {
        const res = await fetch(`${API_URL}/notifications`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch notifications');
        return res.json();
    },

    createNotification: async (data: any) => {
        const res = await fetch(`${API_URL}/notifications`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create notification');
        return res.json();
    },

    markNotificationRead: async (id: string) => {
        const res = await fetch(`${API_URL}/notifications/${id}/read`, {
            method: 'PUT',
            headers: getHeaders(),
        });
        if (!res.ok) throw new Error('Failed to mark notification as read');
        return res.json();
    },
};
