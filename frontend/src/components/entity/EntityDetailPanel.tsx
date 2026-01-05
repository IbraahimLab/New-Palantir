import React from 'react';
import { useInvestigationStore } from '../../store/useInvestigationStore';
import { api } from '../../services/api';
import { Search, MapPin, Phone, User, ExternalLink } from 'lucide-react';
import EntityResolutionUI from './EntityResolutionUI';
import DocumentViewer from './DocumentViewer';

const EntityDetailPanel: React.FC = () => {
    const { selectedEntity, addGraphData, addToast, maskPII } = useInvestigationStore();

    if (!selectedEntity) {
        return (
            <div className="flex-center h-full text-muted text-sm">
                Select an entity to view details
            </div>
        );
    }

    const handleExpand = async () => {
        try {
            const response = await api.expandEntity(selectedEntity.type, selectedEntity.id);
            addGraphData(response.data);
            addToast(`Expanded network for ${selectedEntity.id}`, 'success');
        } catch (error) {
            console.error('Failed to expand entity:', error);
            addToast('Network expansion failed. Please check connection.', 'error');
        }
    };

    const renderIcon = () => {
        switch (selectedEntity.type) {
            case 'Person': return <User size={18} />;
            case 'Phone': return <Phone size={18} />;
            case 'Location': return <MapPin size={18} />;
            default: return <Search size={18} />;
        }
    };

    return (
        <div className="entity-detail">
            <div className="detail-header">
                <div className={`icon-wrapper ${selectedEntity.risk_flag}`}>
                    {renderIcon()}
                </div>
                <div className="header-text">
                    <div className="entity-type text-xs mono text-muted">{selectedEntity.type}</div>
                    <h3 className="entity-name">
                        {selectedEntity.properties.full_name || selectedEntity.properties.msisdn || selectedEntity.properties.name || selectedEntity.id}
                    </h3>
                    {selectedEntity.risk_flag && (
                        <span className={`badge risk-${selectedEntity.risk_flag}`}>
                            Risk: {selectedEntity.risk_flag}
                        </span>
                    )}
                </div>
            </div>

            <EntityResolutionUI />

            <div className="detail-section">
                <h4 className="section-title text-xs mono">Properties</h4>
                <div className="properties-list">
                    {Object.entries(selectedEntity.properties)
                        .filter(([key]) => !key.startsWith('_'))
                        .map(([key, value]) => (
                            <div key={key} className="property-item">
                                <span className="prop-key text-xs text-muted">{key.replace(/_/g, ' ')}</span>
                                <span className="prop-val text-sm">{maskPII(String(value), key)}</span>
                            </div>
                        ))}
                </div>
            </div>

            <div className="detail-section">
                <h4 className="section-title text-xs mono">Provenance</h4>
                <div className="provenance-info text-xs text-muted">
                    <div>Source: {selectedEntity.properties._source || 'Unknown'}</div>
                    <div>Ingested: {new Date(selectedEntity.properties._ingested_at).toLocaleDateString()}</div>
                </div>
            </div>

            <DocumentViewer />

            <div className="detail-actions">
                <button className="btn btn-primary w-full" onClick={handleExpand}>
                    <ExternalLink size={16} /> Expand Network
                </button>
            </div>

            <style>{`
        .entity-detail {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .detail-header {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border);
        }
        .icon-wrapper {
          padding: 10px;
          background: var(--bg-accent);
          border-radius: 8px;
          color: var(--primary);
        }
        .icon-wrapper.HIGH { color: var(--danger); }
        .header-text { flex: 1; }
        .entity-name { font-size: 1.125rem; font-weight: 700; margin-bottom: 4px; }
        .badge {
          font-size: 0.625rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }
        .risk-HIGH { background: rgba(239, 68, 68, 0.2); color: var(--danger); }
        
        .section-title {
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 12px;
        }
        .property-item {
          display: flex;
          flex-direction: column;
          margin-bottom: 8px;
        }
        .prop-key { text-transform: capitalize; margin-bottom: 2px; }
        .prop-val { color: var(--text-main); font-weight: 500; }
        .detail-actions { margin-top: auto; padding-top: 16px; }
        .w-full { width: 100%; justify-content: center; }
      `}</style>
        </div>
    );
};

export default EntityDetailPanel;
