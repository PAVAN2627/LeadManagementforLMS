

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

    // Analytics
    getAnalytics: async (): Promise<any> => {
        const response = await fetch(`${API_URL}/analytics`, {
            method: 'GET',
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch analytics');
        return response.json();
    },

    // Notifications
    getNotifications: async (): Promise<{ notifications: any[], unreadCount: number }> => {
        const response = await fetch(`${API_URL}/notifications`, {
            method: 'GET',
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch notifications');
        return response.json();
    },

    markNotificationsRead: async (notificationId?: string): Promise<void> => {
        const response = await fetch(`${API_URL}/notifications`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ notificationId }),
        });
        if (!response.ok) throw new Error('Failed to mark notifications as read');
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

    getLeadNotes: async (id: string): Promise<any[]> => {
        const response = await fetch(`${API_URL}/leads/${id}/notes`, {
            method: 'GET',
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch lead notes');
        return response.json();
    },

    addLeadNote: async (id: string, content: string): Promise<any> => {
        const response = await fetch(`${API_URL}/leads/${id}/notes`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ content }),
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Failed to add note');
        }
        return response.json();
    },
};
