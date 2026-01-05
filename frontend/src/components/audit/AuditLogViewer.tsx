import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Shield, User, Activity, Search, Filter } from 'lucide-react';

const AuditLogViewer: React.FC = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                const response = await api.getAuditLogs();
                setLogs(response.data);
            } catch (error) {
                console.error('Failed to fetch audit logs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log =>
        log.action.toLowerCase().includes(filter.toLowerCase()) ||
        log.entity_id?.toLowerCase().includes(filter.toLowerCase()) ||
        log.user_id?.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="audit-viewer h-full flex flex-col p-6">
            <div className="view-header mb-6 flex justify-between items-end">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-3">
                        <Shield className="text-primary" />
                        Security Audit Trail
                    </h2>
                    <p className="text-muted text-sm mt-1">Immutable record of all investigative actions and PII access</p>
                </div>
                <div className="flex gap-4">
                    <div className="search-box glass flex items-center px-3 py-1.5 rounded-lg border border-border">
                        <Search size={14} className="text-muted mr-2" />
                        <input
                            type="text"
                            placeholder="Filter logs..."
                            className="bg-transparent border-none outline-none text-xs mono"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-ghost btn-sm">
                        <Filter size={14} /> Export CSV
                    </button>
                </div>
            </div>

            <div className="logs-container panel glass flex-1 overflow-hidden flex flex-col">
                <div className="logs-header border-bottom flex font-bold text-xs uppercase mono text-muted p-4 bg-bg-accent">
                    <div className="w-48">Timestamp</div>
                    <div className="w-40">User</div>
                    <div className="w-40">Action</div>
                    <div className="flex-1">Entity / Resource</div>
                </div>

                <div className="logs-list flex-1 overflow-auto">
                    {loading ? (
                        <div className="flex-center p-12 text-muted mono">Querying compliance vault...</div>
                    ) : filteredLogs.length === 0 ? (
                        <div className="flex-center p-12 text-muted italic">No matching audit records found.</div>
                    ) : (
                        filteredLogs.map((log, idx) => (
                            <div key={idx} className="log-row border-bottom flex text-sm py-4 px-4 hover:bg-white/5 transition-colors items-center">
                                <div className="w-48 text-muted mono text-[11px]">
                                    {new Date(log.timestamp).toLocaleString()}
                                </div>
                                <div className="w-40 flex items-center gap-2">
                                    <div className="user-avatar w-6 h-6 rounded-full bg-primary/20 flex-center">
                                        <User size={12} className="text-primary" />
                                    </div>
                                    <span className="mono text-[11px]">{log.user_id}</span>
                                </div>
                                <div className="w-40">
                                    <span className={`action-badge text-[10px] font-bold uppercase mono px-2 py-0.5 rounded ${log.action}`}>
                                        {log.action.replace(/_/g, ' ')}
                                    </span>
                                </div>
                                <div className="flex-1 mono text-[11px] text-muted flex items-center gap-2">
                                    <Activity size={12} />
                                    {log.entity_type && <span>{log.entity_type}:</span>}
                                    <span className="text-text-main font-bold">{log.entity_id || 'System'}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <style>{`
                .border-bottom { border-bottom: 1px solid var(--border); }
                .action-badge { background: rgba(59, 130, 246, 0.1); color: var(--primary); }
                .action-badge.PII_ACCESS { background: rgba(239, 68, 68, 0.1); color: var(--danger); }
                .action-badge.MERGE_ENTITY { background: rgba(245, 158, 11, 0.1); color: var(--accent); }
                .action-badge.EXPAND_GRAPH { background: rgba(16, 185, 129, 0.1); color: var(--success); }
                .user-avatar { border: 1px solid rgba(59, 130, 246, 0.3); }
            `}</style>
        </div>
    );
};

export default AuditLogViewer;
