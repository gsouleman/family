
import { supabase } from './supabase';

const getApiUrl = () => {
    // Force usage of the Render Backend for Data
    // User requested: https://family-assets-backend.onrender.com
    // We hardcode it here or use env var if present.
    // Prefer Env Var for flexibility, but default to the requested URL.
    // @ts-ignore
    let url = import.meta.env.VITE_API_URL || 'https://family-assets-backend.onrender.com';

    // If no env var (prod build without baked env), use relative /api
    if (!url) {
        return '/api';
    }

    if (!url.startsWith('http') && !url.startsWith('/')) {
        url = `https://${url}`;
    }
    // Ensure it ends with /api
    if (!url.endsWith('/api')) {
        url = `${url}/api`;
    }
    return url;
};

const API_URL = getApiUrl();
console.log('🔗 Connecting to Backend API:', API_URL);

// Helper to get headers with Auth
const getHeaders = async () => {
    const headers: any = {
        'Content-Type': 'application/json',
    };

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
        headers['X-User-ID'] = session.user.id;
        if (session.user.email) headers['X-User-Email'] = session.user.email;
        // Try getting name from metadata or user object
        const name = session.user.user_metadata?.full_name;
        if (name) headers['X-User-Name'] = encodeURIComponent(name);
    }

    return headers;
};

// Helper to handle response
const handleResponse = async (res: Response, errorMessage: string) => {
    if (!res.ok) {
        let serverError = `${errorMessage} (${res.status} ${res.statusText})`;
        try {
            const data = await res.json();
            if (data && data.error) {
                serverError = data.error;
                if (data.debug_message) {
                    serverError += ` | DEBUG: ${data.debug_message}`;
                    console.error('SERVER STACK:', data.debug_stack);
                }
            }
        } catch (e) {
            // Ignore json parse error, use default message with status
        }
        throw new Error(serverError);
    }
    return res.json();
};

const request = async (endpoint: string, options: RequestInit = {}) => {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...headers,
            ...options.headers,
        },
    });
    return res;
};

export const api = {
    // Assets
    getAssets: async () => {
        const res = await request('/assets');
        return handleResponse(res, 'Failed to fetch assets');
    },

    createAsset: async (data: any) => {
        const res = await request('/assets', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return handleResponse(res, 'Failed to create asset');
    },

    updateAsset: async (id: string, data: any) => {
        const res = await request(`/assets/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return handleResponse(res, 'Failed to update asset');
    },

    deleteAsset: async (id: string) => {
        const res = await request(`/assets/${id}`, {
            method: 'DELETE',
        });
        return handleResponse(res, 'Failed to delete asset');
    },

    // Heirs
    getHeirs: async () => {
        const res = await request('/heirs');
        return handleResponse(res, 'Failed to fetch heirs');
    },

    createHeir: async (data: any) => {
        const res = await request('/heirs', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return handleResponse(res, 'Failed to create heir');
    },

    updateHeir: async (id: string, data: any) => {
        const res = await request(`/heirs/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return handleResponse(res, 'Failed to update heir');
    },

    deleteHeir: async (id: string) => {
        const res = await request(`/heirs/${id}`, {
            method: 'DELETE',
        });
        return handleResponse(res, 'Failed to delete heir');
    },
    // Documents
    getDocuments: async () => {
        const res = await request('/documents');
        return handleResponse(res, 'Failed to fetch documents');
    },

    createDocument: async (data: any) => {
        const res = await request('/documents', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return handleResponse(res, 'Failed to create document');
    },

    deleteDocument: async (id: string) => {
        const res = await request(`/documents/${id}`, {
            method: 'DELETE',
        });
        return handleResponse(res, 'Failed to delete document');
    },

    // Transactions
    getTransactions: async () => {
        const res = await request('/transactions');
        return handleResponse(res, 'Failed to fetch transactions');
    },

    createTransaction: async (data: any) => {
        const res = await request('/transactions', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return handleResponse(res, 'Failed to create transaction');
    },

    // Distributions (Calculator)
    getDistributions: async () => {
        const res = await request('/distributions');
        return handleResponse(res, 'Failed to fetch distributions');
    },

    createDistribution: async (data: any) => {
        const res = await request('/distributions', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return handleResponse(res, 'Failed to create distribution');
    },

    // Notifications
    getNotifications: async () => {
        const res = await request('/notifications');
        return handleResponse(res, 'Failed to fetch notifications');
    },

    createNotification: async (data: any) => {
        const res = await request('/notifications', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return handleResponse(res, 'Failed to create notification');
    },

    markNotificationRead: async (id: string) => {
        const res = await request(`/notifications/${id}/read`, {
            method: 'PUT',
        });
        return handleResponse(res, 'Failed to mark notification as read');
    },

    // Ledger
    getLedgerEntries: async () => {
        const res = await request('/ledger');
        return handleResponse(res, 'Failed to fetch ledger entries');
    },

    createLedgerEntry: async (data: any) => {
        const res = await request('/ledger', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return handleResponse(res, 'Failed to create ledger entry');
    },

    updateLedgerEntry: async (id: string, data: any) => {
        const res = await request(`/ledger/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return handleResponse(res, 'Failed to update ledger entry');
    },

    deleteLedgerEntry: async (id: string) => {
        const res = await request(`/ledger/${id}`, {
            method: 'DELETE',
        });
        return handleResponse(res, 'Failed to delete ledger entry');
    },

    // User Management (Admin)
    getUsers: async () => {
        const res = await request('/users');
        return handleResponse(res, 'Failed to fetch users');
    },

    createUser: async (data: any) => {
        const res = await request('/users', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return handleResponse(res, 'Failed to create user');
    },

    updateUser: async (id: string, data: any) => {
        const res = await request(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return handleResponse(res, 'Failed to update user');
    },

    deleteUser: async (id: string) => {
        const res = await request(`/users/${id}`, {
            method: 'DELETE',
        });
        return handleResponse(res, 'Failed to delete user');
    },

    getProfile: async () => {
        const res = await request('/users/me');
        return handleResponse(res, 'Failed to fetch user profile');
    },

    // Generic methods for flexibility
    get: async (endpoint: string) => {
        const res = await request(endpoint);
        return handleResponse(res, `Failed to GET ${endpoint}`);
    },

    post: async (endpoint: string, data: any) => {
        const res = await request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return handleResponse(res, `Failed to POST ${endpoint}`);
    },

    put: async (endpoint: string, data: any) => {
        const res = await request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return handleResponse(res, `Failed to PUT ${endpoint}`);
    },

    delete: async (endpoint: string) => {
        const res = await request(endpoint, {
            method: 'DELETE',
        });
        return handleResponse(res, `Failed to DELETE ${endpoint}`);
    },

    getBaseUrl: () => API_URL,
};
