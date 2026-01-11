
const getApiUrl = () => {
    // @ts-ignore
    let url = import.meta.env.VITE_API_URL;

    // If no env var (prod build without baked env), use relative /api
    if (!url) {
        return '/api';
    }

    if (!url.startsWith('http')) {
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

// Helper to handle response
const handleResponse = async (res: Response, errorMessage: string) => {
    if (!res.ok) {
        let serverError = `${errorMessage} (${res.status} ${res.statusText})`;
        try {
            const data = await res.json();
            if (data && data.error) {
                serverError = data.error;
            }
        } catch (e) {
            // Ignore json parse error, use default message with status
        }
        throw new Error(serverError);
    }
    return res.json();
};

export const api = {
    // Assets
    getAssets: async () => {
        const res = await fetch(`${API_URL}/assets`, { headers: getHeaders() });
        return handleResponse(res, 'Failed to fetch assets');
    },

    createAsset: async (data: any) => {
        const res = await fetch(`${API_URL}/assets`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res, 'Failed to create asset');
    },

    updateAsset: async (id: string, data: any) => {
        const res = await fetch(`${API_URL}/assets/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res, 'Failed to update asset');
    },

    deleteAsset: async (id: string) => {
        const res = await fetch(`${API_URL}/assets/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse(res, 'Failed to delete asset');
    },

    // Heirs
    getHeirs: async () => {
        const res = await fetch(`${API_URL}/heirs`, { headers: getHeaders() });
        return handleResponse(res, 'Failed to fetch heirs');
    },

    createHeir: async (data: any) => {
        const res = await fetch(`${API_URL}/heirs`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res, 'Failed to create heir');
    },

    updateHeir: async (id: string, data: any) => {
        const res = await fetch(`${API_URL}/heirs/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res, 'Failed to update heir');
    },

    deleteHeir: async (id: string) => {
        const res = await fetch(`${API_URL}/heirs/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse(res, 'Failed to delete heir');
    },
    // Documents
    getDocuments: async () => {
        const res = await fetch(`${API_URL}/documents`, { headers: getHeaders() });
        return handleResponse(res, 'Failed to fetch documents');
    },

    createDocument: async (data: any) => {
        const res = await fetch(`${API_URL}/documents`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res, 'Failed to create document');
    },

    deleteDocument: async (id: string) => {
        const res = await fetch(`${API_URL}/documents/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse(res, 'Failed to delete document');
    },

    // Transactions
    getTransactions: async () => {
        const res = await fetch(`${API_URL}/transactions`, { headers: getHeaders() });
        return handleResponse(res, 'Failed to fetch transactions');
    },

    createTransaction: async (data: any) => {
        const res = await fetch(`${API_URL}/transactions`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res, 'Failed to create transaction');
    },

    // Distributions (Calculator)
    getDistributions: async () => {
        const res = await fetch(`${API_URL}/distributions`, { headers: getHeaders() });
        return handleResponse(res, 'Failed to fetch distributions');
    },

    createDistribution: async (data: any) => {
        const res = await fetch(`${API_URL}/distributions`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res, 'Failed to create distribution');
    },

    // Notifications
    getNotifications: async () => {
        const res = await fetch(`${API_URL}/notifications`, { headers: getHeaders() });
        return handleResponse(res, 'Failed to fetch notifications');
    },

    createNotification: async (data: any) => {
        const res = await fetch(`${API_URL}/notifications`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res, 'Failed to create notification');
    },

    markNotificationRead: async (id: string) => {
        const res = await fetch(`${API_URL}/notifications/${id}/read`, {
            method: 'PUT',
            headers: getHeaders(),
        });
        return handleResponse(res, 'Failed to mark notification as read');
    },

    // Ledger
    getLedgerEntries: async () => {
        const res = await fetch(`${API_URL}/ledger`, { headers: getHeaders() });
        return handleResponse(res, 'Failed to fetch ledger entries');
    },

    createLedgerEntry: async (data: any) => {
        const res = await fetch(`${API_URL}/ledger`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res, 'Failed to create ledger entry');
    },

    updateLedgerEntry: async (id: string, data: any) => {
        const res = await fetch(`${API_URL}/ledger/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res, 'Failed to update ledger entry');
    },

    deleteLedgerEntry: async (id: string) => {
        const res = await fetch(`${API_URL}/ledger/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse(res, 'Failed to delete ledger entry');
    },

    // Generic methods for flexibility
    get: async (endpoint: string) => {
        const res = await fetch(`${API_URL}${endpoint}`, { headers: getHeaders() });
        return handleResponse(res, `Failed to GET ${endpoint}`);
    },

    post: async (endpoint: string, data: any) => {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res, `Failed to POST ${endpoint}`);
    },

    put: async (endpoint: string, data: any) => {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res, `Failed to PUT ${endpoint}`);
    },

    delete: async (endpoint: string) => {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse(res, `Failed to DELETE ${endpoint}`);
    },

    getBaseUrl: () => API_URL,
};
