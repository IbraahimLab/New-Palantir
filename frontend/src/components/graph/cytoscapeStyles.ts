export const cytoscapeStyles = [
    {
        selector: 'node',
        style: {
            'background-color': '#1e293b',
            'label': 'data(label)',
            'color': '#e2e8f0',
            'font-size': '12px',
            'text-valign': 'bottom',
            'text-halign': 'center',
            'text-margin-y': '4px',
            'width': '40px',
            'height': '40px',
            'border-width': '2px',
            'border-color': '#3b82f6',
        }
    },
    {
        selector: 'node[type = "Person"]',
        style: {
            'background-color': '#111827',
            'border-color': '#3b82f6',
            'shape': 'round-rectangle'
        }
    },
    {
        selector: 'node[type = "Phone"]',
        style: {
            'background-color': '#064e3b',
            'border-color': '#10b981',
            'shape': 'ellipse'
        }
    },
    {
        selector: 'node[risk_flag = "HIGH"]',
        style: {
            'border-color': '#ef4444',
            'border-width': '4px'
        }
    },
    {
        selector: 'edge',
        style: {
            'width': 2,
            'line-color': '#475569',
            'target-arrow-color': '#475569',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(type)',
            'color': '#94a3b8',
            'font-size': '10px',
            'text-rotation': 'autorotate',
            'text-margin-y': '-10px'
        }
    },
    {
        selector: ':selected',
        style: {
            'background-color': '#f59e0b',
            'line-color': '#f59e0b',
            'target-arrow-color': '#f59e0b',
            'border-color': '#fff',
            'border-width': '3px'
        }
    }
];
