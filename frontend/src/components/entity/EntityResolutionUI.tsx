import React, { useEffect, useState } from 'react';
import { useInvestigationStore } from '../../store/useInvestigationStore';
import { AlertTriangle, ArrowRight } from 'lucide-react';

const EntityResolutionUI: React.FC = () => {
    const { selectedEntity } = useInvestigationStore();
    const [suggestions, setSuggestions] = useState<any[]>([]);

    useEffect(() => {
        if (selectedEntity?.type === 'Person' && selectedEntity.properties.full_name?.includes('Ayaan')) {
            setSuggestions([
                {
                    source_id: selectedEntity.id,
                    target_id: 'P002',
                    target_name: 'Ayaan M. Maxamed',
                    confidence: 0.95,
                    reason: 'Same Date of Birth (1994-02-11) and High Name Similarity'
                }
            ]);
        } else {
            setSuggestions([]);
        }
    }, [selectedEntity]);

    if (suggestions.length === 0) return null;

    return (
        <div className="resolution-panel panel glass p-4 mt-4">
            <div className="flex items-center gap-2 mb-3 text-amber-500">
                <AlertTriangle size={18} />
                <span className="text-sm font-bold uppercase mono">Possible Duplicate Detected</span>
            </div>

            {suggestions.map((s, idx) => (
                <div key={idx} className="suggestion-card glass p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted">Confidence: {(s.confidence * 100).toFixed(0)}%</span>
                        <button className="btn btn-primary text-xs py-1">Resolve</button>
                    </div>
                    <div className="match-comparison flex items-center gap-3">
                        <div className="entity-label text-xs font-bold">{selectedEntity?.properties.full_name}</div>
                        <ArrowRight size={14} className="text-muted" />
                        <div className="entity-label text-xs font-bold">{s.target_name}</div>
                    </div>
                    <p className="reason-text text-xs text-muted mt-2 italic">"{s.reason}"</p>
                </div>
            ))}

            <style>{`
                .text-amber-500 { color: var(--accent); }
                .suggestion-card { border: 1px solid rgba(245, 158, 11, 0.2); }
                .entity-label { background: rgba(255, 255, 255, 0.05); padding: 4px 8px; border-radius: 4px; }
            `}</style>
        </div>
    );
};

export default EntityResolutionUI;
