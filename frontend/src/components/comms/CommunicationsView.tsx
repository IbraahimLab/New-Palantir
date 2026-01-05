import React, { useEffect, useState } from 'react';
import { useInvestigationStore } from '../../store/useInvestigationStore';
import { api } from '../../services/api';
import { Phone, Users, MessageSquare, TrendingUp, Search } from 'lucide-react';

const CommunicationsView: React.FC = () => {
    const { selectedEntity } = useInvestigationStore();
    const [topContacts, setTopContacts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchComms = async () => {
            if (!selectedEntity || selectedEntity.type !== 'Phone') return;
            setLoading(true);
            try {
                // We use properties.msisdn as the phone ID
                const phoneId = selectedEntity.properties.msisdn || selectedEntity.id;
                const response = await api.getTopContacts(phoneId);
                setTopContacts(response.data);
            } catch (error) {
                console.error('Failed to fetch communications analysis:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchComms();
    }, [selectedEntity]);

    if (!selectedEntity || selectedEntity.type !== 'Phone') {
        return (
            <div className="flex-center h-full text-center p-8">
                <div className="text-muted">
                    <Phone size={48} className="mx-auto mb-4 opacity-20" />
                    <p>Select a <strong>Phone</strong> entity to analyze communication patterns</p>
                </div>
            </div>
        );
    }

    if (loading) return <div className="flex-center h-full text-muted mono">Analyzing CDR network...</div>;

    return (
        <div className="comms-view h-full flex flex-col p-6">
            <div className="view-header mb-6">
                <h2 className="text-xl font-bold flex items-center gap-3">
                    <TrendingUp className="text-primary" />
                    Communications Analysis: {selectedEntity.properties.msisdn}
                </h2>
                <p className="text-muted text-sm mt-1">Social network analysis based on Call Detail Records (CDR)</p>
            </div>

            <div className="analysis-grid gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {topContacts.length === 0 ? (
                    <div className="col-span-full panel glass p-12 text-center text-muted">
                        No communication history found for this device.
                    </div>
                ) : (
                    topContacts.map((contact, idx) => (
                        <div key={idx} className="contact-card panel glass p-5 flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="contact-avatar bg-accent flex-center rounded-full w-10 h-10">
                                        <Users size={20} className="text-primary" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">{contact.phone}</div>
                                        <div className="text-xs text-muted">Frequency: {contact.count} contacts</div>
                                    </div>
                                </div>
                                <div className="rank-badge text-xs mono text-muted"># {idx + 1}</div>
                            </div>

                            <div className="comms-stats flex gap-4 mt-auto">
                                <div className="stat flex items-center gap-2">
                                    <Phone size={14} className="text-muted" />
                                    <span className="text-xs font-bold">{contact.calls || 0}</span>
                                </div>
                                <div className="stat flex items-center gap-2">
                                    <MessageSquare size={14} className="text-muted" />
                                    <span className="text-xs font-bold">{contact.messages || 0}</span>
                                </div>
                            </div>

                            <button className="btn btn-ghost btn-xs w-full justify-center mt-2 group">
                                <Search size={14} className="group-hover:text-primary transition-colors" />
                                Inspect Network
                            </button>
                        </div>
                    ))
                )}
            </div>

            <style>{`
                .contact-card:hover { border-color: var(--primary); }
                .contact-avatar { background: rgba(59, 130, 246, 0.1); }
                .btn-xs { font-size: 0.75rem; padding: 4px 8px; }
                .col-span-full { grid-column: 1 / -1; }
            `}</style>
        </div>
    );
};

export default CommunicationsView;
