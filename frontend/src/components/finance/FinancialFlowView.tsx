import React, { useEffect, useState } from 'react';
import { useInvestigationStore } from '../../store/useInvestigationStore';
import { api } from '../../services/api';
import { DollarSign, ArrowRight, TrendingDown, Landmark, Search } from 'lucide-react';

const FinancialFlowView: React.FC = () => {
    const { selectedEntity } = useInvestigationStore();
    const [trace, setTrace] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFinance = async () => {
            if (!selectedEntity || selectedEntity.type !== 'Account') return;
            setLoading(true);
            try {
                const accountId = selectedEntity.properties.account_id || selectedEntity.id;
                const response = await api.traceMoney(accountId);
                setTrace(response.data);
            } catch (error) {
                console.error('Failed to fetch financial trace:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFinance();
    }, [selectedEntity]);

    if (!selectedEntity || selectedEntity.type !== 'Account') {
        return (
            <div className="flex-center h-full text-center p-8">
                <div className="text-muted">
                    <Landmark size={48} className="mx-auto mb-4 opacity-20" />
                    <p>Select an <strong>Account</strong> to trace financial flows</p>
                </div>
            </div>
        );
    }

    if (loading) return <div className="flex-center h-full text-muted mono">Tracing mult-hop transactions...</div>;

    return (
        <div className="finance-view h-full flex flex-col p-6 overflow-auto">
            <div className="view-header mb-8">
                <h2 className="text-xl font-bold flex items-center gap-3">
                    <DollarSign className="text-primary" />
                    Financial Flow Trace: {selectedEntity.properties.account_id}
                </h2>
                <p className="text-muted text-sm mt-1">Multi-hop money laundering detection and flow analysis</p>
            </div>

            {!trace || trace.length === 0 ? (
                <div className="panel glass p-12 text-center text-muted">
                    No significant outgoing transfers detected for this account.
                </div>
            ) : (
                <div className="trace-timeline flex flex-col gap-6 relative">
                    {trace.map((step: any, idx: number) => (
                        <div key={idx} className="trace-step flex items-center gap-8 group">
                            <div className="step-badge glass flex-center w-12 h-12 rounded-full font-bold mono">
                                {idx + 1}
                            </div>

                            <div className="step-card panel glass p-5 flex-1 hover:border-primary transition-colors">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-2">
                                        <Landmark size={14} className="text-muted" />
                                        <span className="text-xs text-muted mono">Account</span>
                                        <span className="font-bold">{step.accountId}</span>
                                    </div>
                                    <div className="amount font-bold text-primary">$ {step.amount.toLocaleString()}</div>
                                </div>

                                {idx < trace.length - 1 && (
                                    <div className="transfer-info flex items-center gap-3 mt-4 text-muted">
                                        <ArrowRight size={16} />
                                        <span className="text-xs italic">Transferred to next hop</span>
                                        <TrendingDown size={14} className="text-danger" />
                                    </div>
                                )}
                            </div>

                            <button className="btn btn-ghost btn-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                <Search size={14} /> Pivot
                            </button>
                        </div>
                    ))}

                    <div className="view-summary mt-10 p-5 panel glass bg-primary/5">
                        <div className="font-bold mono text-xs uppercase mb-2 text-primary">Flow Insights</div>
                        <p className="text-sm">
                            Money traversed <strong>{trace.length} hops</strong> across different entities.
                            Loss of value between hops suggests potential transaction fees or fragmentation patterns.
                        </p>
                    </div>
                </div>
            )}

            <style>{`
                .trace-step::after {
                    content: '';
                    position: absolute;
                    left: 23px;
                    top: 48px;
                    bottom: -24px;
                    width: 2px;
                    background: var(--border);
                    z-index: -1;
                }
                .trace-step:last-child::after { display: none; }
                .step-badge { background: var(--bg-accent); border: 2px solid var(--border); }
                .finance-view .btn-xs { font-size: 0.75rem; padding: 4px 8px; }
            `}</style>
        </div>
    );
};

export default FinancialFlowView;
