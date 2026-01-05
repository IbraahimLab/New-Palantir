import React, { useEffect, useState } from 'react';
import { useInvestigationStore } from '../../store/useInvestigationStore';
import { api } from '../../services/api';
import { Briefcase, Plus, Folder, Clock } from 'lucide-react';
import type { Case } from '../../types';

const CaseWorkspace: React.FC = () => {
    const { cases, setCases, activeCase, setActiveCase, addGraphData, addToast } = useInvestigationStore();
    const [loading, setLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newCase, setNewCase] = useState({ name: '', description: '' });

    useEffect(() => {
        const fetchCases = async () => {
            setLoading(true);
            try {
                const response = await api.listCases();
                setCases(response.data);
            } catch (error) {
                console.error('Failed to fetch cases:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCases();
    }, []);

    const handleCreateCase = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.createCase(newCase);
            setCases([...cases, response.data]);
            setActiveCase(response.data);
            setIsCreating(false);
            setNewCase({ name: '', description: '' });
        } catch (error) {
            console.error('Failed to create case:', error);
        }
    };

    const handleLoadCaseEntities = async (caseId: string) => {
        setLoading(true);
        try {
            const response = await api.getCaseEntities(caseId);
            const entities = await Promise.all(response.data.map(async (ce: any) => {
                const entityRes = await api.getEntity(ce.entity_type, ce.entity_id);
                return entityRes.data;
            }));
            addGraphData({ nodes: entities, edges: [] });
            addToast(`Loaded ${entities.length} entities from case`, 'success');
        } catch (error) {
            console.error('Failed to load case entities:', error);
            addToast('Failed to load case entities.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="case-workspace h-full flex flex-col">
            <div className="workspace-header glass p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Briefcase className="text-primary" size={20} />
                    <h2 className="font-bold mono text-lg">Investigative Cases</h2>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => setIsCreating(true)}>
                    <Plus size={16} /> New Case
                </button>
            </div>

            <div className="workspace-content flex-1 overflow-auto p-4">
                {isCreating && (
                    <div className="create-case-form panel glass p-4 mb-4">
                        <h3 className="text-sm font-bold mb-3 uppercase mono">Initialize New Investigation</h3>
                        <form onSubmit={handleCreateCase}>
                            <input
                                type="text"
                                placeholder="Case Name (e.g. OP-GOTHAM-01)"
                                className="search-input glass mb-3"
                                value={newCase.name}
                                onChange={e => setNewCase({ ...newCase, name: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Brief objective description..."
                                className="search-input glass mb-3 h-24 p-l-2 py-2"
                                value={newCase.description}
                                onChange={e => setNewCase({ ...newCase, description: e.target.value })}
                            ></textarea>
                            <div className="flex gap-2">
                                <button type="submit" className="btn btn-primary flex-1">Create</button>
                                <button type="button" className="btn btn-ghost" onClick={() => setIsCreating(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div className="flex-center p-8 text-muted mono">Consulting Supabase records...</div>
                ) : cases.length === 0 ? (
                    <div className="text-center p-12 text-muted">
                        <Folder size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No investigations found. Initialize one to start tracking entities.</p>
                    </div>
                ) : (
                    <div className="case-grid">
                        {cases.map((c: Case) => (
                            <div
                                key={c.id}
                                className={`case-card panel glass p-4 cursor-pointer transition-all ${activeCase?.id === c.id ? 'active-case' : ''}`}
                                onClick={() => setActiveCase(c)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-sm truncate">{c.name}</h4>
                                    <span className={`status-tag text-xs mono ${c.status}`}>
                                        {c.status}
                                    </span>
                                </div>
                                <p className="text-xs text-muted mb-3 line-clamp-2">{c.description}</p>
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-3 text-xs text-muted mono">
                                        <Clock size={12} /> {new Date(c.created_at).toLocaleDateString()}
                                    </div>
                                    <button
                                        className="btn btn-ghost btn-xs text-primary"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleLoadCaseEntities(c.id);
                                        }}
                                    >
                                        Load Graph
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>


            <style>{`
                .case-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
                .case-card:hover { border-color: var(--primary); transform: translateY(-2px); }
                .active-case { border-color: var(--primary); background: rgba(59, 130, 246, 0.05); }
                .status-tag { padding: 2px 6px; border-radius: 4px; text-transform: uppercase; font-weight: 800; }
                .status-tag.OPEN { background: rgba(59, 130, 246, 0.2); color: var(--primary); }
                .status-tag.CLOSED { background: rgba(16, 185, 129, 0.2); color: var(--success); }
                .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
                .mb-3 { margin-bottom: 0.75rem; }
                .mx-auto { margin-left: auto; margin-right: auto; }
            `}</style>
        </div>
    );
};

export default CaseWorkspace;
