import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const api = {
    // Entities
    getEntity: (type: string, id: string) => apiClient.get(`/entities/${type}/${id}`),
    expandEntity: (type: string, id: string, depth: number = 1) =>
        apiClient.get(`/entities/${type}/${id}/expand`, { params: { depth } }),

    // Search
    search: (query: string) => apiClient.get('/search/', { params: { q: query } }),
    searchByType: (type: string, query: string) =>
        apiClient.get(`/search/type/${type}`, { params: { q: query } }),

    // Analytics
    getTimeline: (type: string, id: string) => apiClient.get(`/analytics/timeline/${type}/${id}`),
    getSightings: (type: string, id: string) => apiClient.get(`/analytics/geo/sightings/${type}/${id}`),
    getTopContacts: (phoneId: string) => apiClient.get(`/analytics/comms/frequent/${phoneId}`),
    traceMoney: (accountId: string, depth: number = 3) =>
        apiClient.get(`/analytics/finance/trace/${accountId}`, { params: { depth } }),

    // Cases
    listCases: () => apiClient.get('/cases/'),
    getCase: (id: string) => apiClient.get(`/cases/${id}`),
    createCase: (data: any) => apiClient.post('/cases/', data),
    addEntityToCase: (caseId: string, data: any) => apiClient.post(`/cases/${caseId}/entities`, data),

    // Documents
    getDocument: (id: string) => apiClient.get(`/documents/${id}`),
    getMentions: (id: string) => apiClient.get(`/documents/${id}/mentions`),
    searchDocuments: (query: string) => apiClient.get('/documents/search', { params: { q: query } }),
};
