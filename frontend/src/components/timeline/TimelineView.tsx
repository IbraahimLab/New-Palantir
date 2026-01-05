import React, { useEffect, useState } from 'react';
import { useInvestigationStore } from '../../store/useInvestigationStore';
import { api } from '../../services/api';
import { Clock, Phone, ArrowRight, DollarSign, MapPin } from 'lucide-react';

const TimelineView: React.FC = () => {
    const { selectedEntity } = useInvestigationStore();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTimeline = async () => {
            if (!selectedEntity) return;
            setLoading(true);
            try {
                const response = await api.getTimeline(selectedEntity.type, selectedEntity.id);
                setEvents(response.data);
            } catch (error) {
                console.error('Failed to fetch timeline:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTimeline();
    }, [selectedEntity]);

    if (!selectedEntity) {
        return (
            <div className="flex-center h-full text-muted">
                Select an entity to view its timeline
            </div>
        );
    }

    if (loading) return <div className="flex-center h-full text-muted mono">Loading timeline...</div>;

    return (
        <div className="timeline-container">
            <div className="timeline-header glass">
                <Clock size={16} /> Chronological Events for {selectedEntity.properties.full_name || selectedEntity.id}
            </div>

            <div className="timeline-list">
                {events.length === 0 ? (
                    <div className="text-center p-8 text-muted">No temporal events found for this entity.</div>
                ) : (
                    events.map((event, idx) => (
                        <div key={idx} className="timeline-item">
                            <div className="timeline-marker"></div>
                            <div className="timeline-content panel glass">
                                <div className="event-time text-xs mono text-primary">
                                    {new Date(event.timestamp).toLocaleString()}
                                </div>
                                <div className="event-main">
                                    <span className="event-type-icon">{getIcon(event.type)}</span>
                                    <span className="event-description">{event.description}</span>
                                </div>
                                {event.details && (
                                    <div className="event-details text-xs text-muted mt-2">
                                        {Object.entries(event.details).map(([k, v]) => (
                                            <span key={k} className="mr-3">{k}: {String(v)}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style>{`
        .timeline-container { height: 100%; display: flex; flex-direction: column; overflow: hidden; }
        .timeline-header { padding: 12px 16px; font-size: 0.875rem; font-weight: 600; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid var(--border); }
        .timeline-list { flex: 1; overflow-y: auto; padding: 24px; position: relative; }
        .timeline-list::before { content: ''; position: absolute; left: 31px; top: 0; bottom: 0; width: 2px; background: var(--border); }
        
        .timeline-item { position: relative; padding-left: 40px; margin-bottom: 20px; }
        .timeline-marker { position: absolute; left: 7px; top: 12px; width: 10px; height: 10px; border-radius: 50%; background: var(--primary); border: 2px solid var(--bg-main); z-index: 10; }
        
        .timeline-content { padding: 12px 16px; }
        .event-time { margin-bottom: 4px; }
        .event-main { display: flex; align-items: center; gap: 8px; font-weight: 500; font-size: 0.875rem; }
        .event-type-icon { color: var(--primary); }
        .mr-3 { margin-right: 12px; }
      `}</style>
        </div>
    );
};

const getIcon = (type: string) => {
    if (type.includes('CALL')) return <Phone size={14} />;
    if (type.includes('TRANS')) return <DollarSign size={14} />;
    if (type.includes('SIGHT')) return <MapPin size={14} />;
    return <ArrowRight size={14} />;
};

export default TimelineView;
