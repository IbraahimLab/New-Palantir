export interface Entity {
    id: string;
    type: string;
    properties: Record<string, any>;
    risk_flag?: string;
    _source?: string;
}

export interface Relationship {
    id: string;
    source: string;
    target: string;
    type: string;
    properties: Record<string, any>;
}

export interface GraphData {
    nodes: Entity[];
    edges: Relationship[];
}

export interface Case {
    id: string;
    name: string;
    description: string;
    status: string;
    created_at: string;
}

export interface AuditLog {
    id: string;
    user_id: string;
    action: string;
    resource_type: string;
    resource_id: string;
    timestamp: string;
    details: any;
}

export interface SearchResult {
    id: string;
    type: string;
    display_name: string;
    properties: Record<string, any>;
}
