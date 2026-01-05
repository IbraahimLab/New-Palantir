import { create } from 'zustand';
import type { Entity, Relationship, Case, GraphData } from '../types';

export interface Toast {
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
}

interface InvestigationState {
    // Graph State
    nodes: Entity[];
    edges: Relationship[];
    selectedEntity: Entity | null;

    // Case State
    activeCase: Case | null;
    cases: Case[];

    // UI State
    viewMode: 'graph' | 'timeline' | 'map' | 'comms' | 'finance';
    navigation: 'knowledge' | 'cases' | 'audit';
    isSearching: boolean;
    searchResults: any[];
    toasts: Toast[];
    userRole: 'analyst' | 'investigator';

    // Actions
    setNodes: (nodes: Entity[]) => void;
    setEdges: (edges: Relationship[]) => void;
    addGraphData: (data: GraphData) => void;
    setSelectedEntity: (entity: Entity | null) => void;
    setActiveCase: (caseObj: Case | null) => void;
    setCases: (cases: Case[]) => void;
    setViewMode: (mode: 'graph' | 'timeline' | 'map' | 'comms' | 'finance') => void;
    setNavigation: (nav: 'knowledge' | 'cases' | 'audit') => void;
    setUserRole: (role: 'analyst' | 'investigator') => void;
    setSearchResults: (results: any[]) => void;
    addToast: (message: string, type: Toast['type']) => void;
    removeToast: (id: string) => void;
    maskPII: (value: string, property: string) => string;
    clearGraph: () => void;
}

export const useInvestigationStore = create<InvestigationState>((set) => ({
    nodes: [],
    edges: [],
    selectedEntity: null,
    activeCase: null,
    cases: [],
    viewMode: 'graph',
    navigation: 'knowledge',
    isSearching: false,
    searchResults: [],
    toasts: [],
    userRole: 'analyst',

    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),

    addGraphData: (data) => set((state) => {
        // Deduplicate nodes and edges
        const nodeIds = new Set(state.nodes.map(n => n.id));
        const edgeIds = new Set(state.edges.map(e => e.id));

        const newNodes = [...state.nodes, ...data.nodes.filter(n => !nodeIds.has(n.id))];
        const newEdges = [...state.edges, ...data.edges.filter(e => !edgeIds.has(e.id))];

        return { nodes: newNodes, edges: newEdges };
    }),

    setSelectedEntity: (entity) => set({ selectedEntity: entity }),
    setActiveCase: (caseObj) => set({ activeCase: caseObj }),
    setCases: (cases) => set({ cases }),
    setViewMode: (mode) => set({ viewMode: mode }),
    setNavigation: (nav) => set({ navigation: nav }),
    setUserRole: (role) => set({ userRole: role }),
    setSearchResults: (results) => set({ searchResults: results, isSearching: results.length > 0 }),

    addToast: (message, type) => set((state) => ({
        toasts: [...state.toasts, { id: Math.random().toString(36).substring(2), message, type }]
    })),

    removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter(t => t.id !== id)
    })),

    maskPII: (value, property) => {
        const { userRole } = useInvestigationStore.getState();
        if (userRole === 'investigator') return value;
        const piiProperties = ['dob', 'home_address', 'ssn', 'msisdn', 'account_id', 'email', 'phone'];
        if (piiProperties.includes(property.toLowerCase())) {
            if (value.length <= 4) return '****';
            return `****${value.substring(value.length - 4)}`;
        }
        return value;
    },

    clearGraph: () => set({ nodes: [], edges: [], selectedEntity: null }),
}));
