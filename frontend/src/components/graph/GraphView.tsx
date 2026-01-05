import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import { useInvestigationStore } from '../../store/useInvestigationStore';
import { cytoscapeStyles } from './cytoscapeStyles';

const GraphView: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cyRef = useRef<cytoscape.Core | null>(null);
    const { nodes, edges, setSelectedEntity } = useInvestigationStore();

    useEffect(() => {
        if (!containerRef.current) return;

        const cy = cytoscape({
            container: containerRef.current,
            style: cytoscapeStyles,
            layout: { name: 'cose', animate: true },
        });

        cy.on('tap', 'node', (evt) => {
            const nodeData = evt.target.data('originalData');
            setSelectedEntity(nodeData);
        });

        cyRef.current = cy;

        return () => {
            cy.destroy();
        };
    }, []);

    useEffect(() => {
        if (!cyRef.current) return;

        const cy = cyRef.current;

        // Transform store data to cytoscape format
        const elements = [
            ...nodes.map(n => ({
                data: {
                    id: n.id,
                    label: n.properties.full_name || n.properties.msisdn || n.properties.account_id || n.id,
                    type: n.type,
                    risk_flag: n.risk_flag,
                    originalData: n
                }
            })),
            ...edges.map(e => ({
                data: {
                    id: e.id,
                    source: e.source,
                    target: e.target,
                    type: e.type
                }
            }))
        ];

        cy.elements().remove();
        cy.add(elements);
        cy.layout({ name: 'cose', animate: true }).run();
    }, [nodes, edges]);

    return (
        <div
            ref={containerRef}
            style={{ width: '100%', height: '100%', background: '#0f1419' }}
        />
    );
};

export default GraphView;
