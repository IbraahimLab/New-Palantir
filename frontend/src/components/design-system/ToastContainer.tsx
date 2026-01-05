import React from 'react';
import { useInvestigationStore, type Toast } from '../../store/useInvestigationStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';

const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useInvestigationStore();

    const getIcon = (type: Toast['type']) => {
        switch (type) {
            case 'success': return <CheckCircle className="text-emerald-500" size={18} />;
            case 'error': return <XCircle className="text-rose-500" size={18} />;
            case 'warning': return <AlertTriangle className="text-amber-500" size={18} />;
            default: return <Info className="text-sky-500" size={18} />;
        }
    };

    return (
        <div className="toast-container fixed bottom-6 right-6 z-[1000] flex flex-col gap-3 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        className={`toast-item glass pointer-events-auto flex items-center gap-4 p-4 rounded-xl border border-white/10 shadow-2xl min-w-[300px] ${toast.type}`}
                    >
                        <div className="toast-icon">
                            {getIcon(toast.type)}
                        </div>
                        <div className="toast-content flex-1">
                            <p className="text-sm font-medium">{toast.message}</p>
                        </div>
                        <button
                            className="toast-close text-muted hover:text-white transition-colors"
                            onClick={() => removeToast(toast.id)}
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>

            <style>{`
                .toast-item {
                    background: rgba(15, 20, 25, 0.9);
                    backdrop-filter: blur(12px);
                }
                .toast-item.success { border-left: 4px solid var(--success); }
                .toast-item.error { border-left: 4px solid var(--danger); }
                .toast-item.warning { border-left: 4px solid var(--accent); }
                .toast-item.info { border-left: 4px solid var(--primary); }
            `}</style>
        </div>
    );
};

export default ToastContainer;
