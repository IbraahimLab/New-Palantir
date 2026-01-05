import React, { useEffect, useState } from 'react';
import { useInvestigationStore } from '../../store/useInvestigationStore';
import { api } from '../../services/api';
import { FileText, Shield, ExternalLink } from 'lucide-react';

const DocumentViewer: React.FC = () => {
    const { selectedEntity } = useInvestigationStore();
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDocs = async () => {
            if (!selectedEntity) return;
            setLoading(true);
            try {
                const response = await api.getMentions(selectedEntity.id);
                setDocuments(response.data);
            } catch (error) {
                console.error('Failed to fetch document mentions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDocs();
    }, [selectedEntity]);

    if (!selectedEntity) return null;

    if (loading) return <div className="p-4 text-xs text-muted mono">Discoverying mentions...</div>;

    if (documents.length === 0) return null;

    return (
        <div className="document-section mt-6">
            <h4 className="section-title text-xs mono mb-4 flex items-center gap-2">
                <FileText size={14} /> Linked Documents
            </h4>

            <div className="doc-list flex flex-col gap-3">
                {documents.map((doc, idx) => (
                    <div key={idx} className="doc-card glass p-3 border-l-4 border-l-primary relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-2">
                            <div className="doc-id font-bold text-xs mono">{doc.document_id}</div>
                            <span className={`classification-tag text-[10px] px-1.5 py-0.5 rounded ${doc.classification}`}>
                                {doc.classification}
                            </span>
                        </div>

                        <p className="mention-text text-sm italic mb-3 line-clamp-3">
                            "...{doc.mention}..."
                        </p>

                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Shield size={12} className="text-muted" />
                                <span className="text-[10px] text-muted">Handled by: {doc.handled_by || 'System'}</span>
                            </div>
                            <button className="btn btn-ghost btn-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                <ExternalLink size={12} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .classification-tag { font-weight: 800; background: rgba(59, 130, 246, 0.1); color: var(--primary); }
                .classification-tag.SENSITIVE_PII { background: rgba(239, 68, 68, 0.1); color: var(--danger); }
                .classification-tag.RESTRICTED { background: rgba(245, 158, 11, 0.1); color: var(--accent); }
                .mention-text { color: var(--text-muted); border-left: 2px solid var(--border); padding-left: 8px; }
                .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
            `}</style>
        </div>
    );
};

export default DocumentViewer;
