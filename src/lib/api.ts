
import { Lead } from "@/models/Lead"; // Frontend may use interface from LeadsTable, let's align types.
// Actually, let's define the API response types or use the ones from models if possible.
// For frontend, we usually define interfaces matching the JSON response.

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
    nextFollowUp?: string;
    createdAt: string;
    updatedAt: string;
}

// Helper to get token
const getToken = () => localStorage.getItem('token');

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
});

export const api = {
    // Leads
    getLeads: async (): Promise<ApiLead[]> => {
        const response = await fetch('/api/leads', {
            method: 'GET',
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch leads');
        return response.json();
    },

    getLead: async (id: string): Promise<ApiLead> => {
        const response = await fetch(`/api/leads/${id}`, {
            method: 'GET',
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch lead');
        return response.json();
    },

    createLead: async (data: Partial<ApiLead>): Promise<ApiLead> => {
        const response = await fetch('/api/leads', {
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
        const response = await fetch(`/api/leads/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update lead');
        return response.json();
    },

    deleteLead: async (id: string): Promise<void> => {
        const response = await fetch(`/api/leads/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to delete lead');
    },
};
