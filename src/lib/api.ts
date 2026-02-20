

export interface ApiUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
    phone?: string;
    company?: string;
    bio?: string;
    department?: string;
    avatar?: string;
    location?: string;
    settings?: any;
    createdAt: string;
}

export interface ApiLead {
    _id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    source: string;
    status: "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "converted" | "lost";
    assignedTo: {
        _id: string;
        name: string;
        email: string;
        role: string;
    };
    date: string;
    notes?: string;
    location?: string;
    nextFollowUp?: string;
    createdAt: string;
    updatedAt: string;
}

// Helper to get token
const getToken = () => localStorage.getItem('token');

const API_URL = import.meta.env.VITE_API_URL || '/api';

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
});

export const api = {
    // Leads
    getLeads: async (): Promise<ApiLead[]> => {
        const response = await fetch(`${API_URL}/leads`, {
            method: 'GET',
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch leads');
        return response.json();
    },

    getLead: async (id: string): Promise<ApiLead> => {
        const response = await fetch(`${API_URL}/leads/${id}`, {
            method: 'GET',
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch lead');
        return response.json();
    },

    // Users
    getUsers: async (role?: string): Promise<ApiUser[]> => {
        const query = role ? `?role=${role}` : '';
        const response = await fetch(`${API_URL}/users${query}`, {
            method: 'GET',
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch users');
        return response.json();
    },

    getProfile: async (): Promise<ApiUser> => {
        const response = await fetch(`${API_URL}/auth/me`, {
            method: 'GET',
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        return data.user;
    },

    updateUser: async (id: string, data: Partial<ApiUser>): Promise<ApiUser> => {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Failed to update user');
        }
        return response.json();
    },

    createUser: async (data: Partial<ApiUser>): Promise<ApiUser> => {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create user');
        }
        return response.json();
    },

    createLead: async (data: Partial<ApiLead>): Promise<ApiLead> => {
        const response = await fetch(`${API_URL}/leads`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create lead');
        }
        return response.json();
    },

    updateLead: async (id: string, data: Partial<ApiLead>): Promise<ApiLead> => {
        const response = await fetch(`${API_URL}/leads/${id}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Failed to update lead');
        }
        return response.json();
    },

    deleteLead: async (id: string): Promise<void> => {
        const response = await fetch(`${API_URL}/leads/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to delete lead');
    },
};
