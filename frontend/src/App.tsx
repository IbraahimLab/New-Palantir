import React from 'react';
import './index.css';
import { useInvestigationStore } from './store/useInvestigationStore';
import GraphView from './components/graph/GraphView';
import EntityDetailPanel from './components/entity/EntityDetailPanel';
import SearchInterface from './components/search/SearchInterface';
import TimelineView from './components/timeline/TimelineView';
import MapView from './components/map/MapView';
import CaseWorkspace from './components/cases/CaseWorkspace';
import CommunicationsView from './components/comms/CommunicationsView';
import FinancialFlowView from './components/finance/FinancialFlowView';
import AuditLogViewer from './components/audit/AuditLogViewer';
import ToastContainer from './components/design-system/ToastContainer';
import { Network, Clock, Map as MapIcon, Database, Layers, ShieldCheck, Share2, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const {
    viewMode, setViewMode,
    navigation, setNavigation,
    userRole, setUserRole,
    nodes, clearGraph
  } = useInvestigationStore();

  const renderView = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{ height: '100%', width: '100%' }}
        >
          {(() => {
            switch (viewMode) {
              case 'graph': return <GraphView />;
              case 'timeline': return <TimelineView />;
              case 'map': return <MapView />;
              case 'comms': return <CommunicationsView />;
              case 'finance': return <FinancialFlowView />;
              default: return <GraphView />;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    );
  };

  const renderMainContent = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={navigation}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex gap-3 overflow-hidden"
        >
          {navigation === 'cases' ? (
            <CaseWorkspace />
          ) : navigation === 'audit' ? (
            <AuditLogViewer />
          ) : (
            <>
              <section className="viewport panel glass">
                <header className="viewport-header">
                  <div className="view-selector">
                    <button
                      className={`btn btn-ghost ${viewMode === 'graph' ? 'active' : ''}`}
                      onClick={() => setViewMode('graph')}
                    >
                      <Network size={16} /> Graph
                    </button>
                    <button
                      className={`btn btn-ghost ${viewMode === 'timeline' ? 'active' : ''}`}
                      onClick={() => setViewMode('timeline')}
                    >
                      <Clock size={16} /> Timeline
                    </button>
                    <button
                      className={`btn btn-ghost ${viewMode === 'map' ? 'active' : ''}`}
                      onClick={() => setViewMode('map')}
                    >
                      <MapIcon size={16} /> Map
                    </button>
                    <div className="v-divider"></div>
                    <button
                      className={`btn btn-ghost ${viewMode === 'comms' ? 'active' : ''}`}
                      onClick={() => setViewMode('comms')}
                    >
                      <Share2 size={16} /> Comms
                    </button>
                    <button
                      className={`btn btn-ghost ${viewMode === 'finance' ? 'active' : ''}`}
                      onClick={() => setViewMode('finance')}
                    >
                      <DollarSign size={16} /> Finance
                    </button>
                  </div>
                </header>
                <div className="view-content">
                  {renderView()}
                </div>
              </section>

              <section className="detail-panel panel glass">
                <div className="panel-header">Entity Details</div>
                <div className="panel-content">
                  <EntityDetailPanel />
                </div>
              </section>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="app-container">
      <header className="app-header glass">
        <div className="header-left">
          <div className="logo mono">MINI GOTHAM</div>
          <div className="v-divider"></div>
          <nav className="main-nav">
            <button
              className={`nav-item ${navigation === 'knowledge' ? 'active' : ''}`}
              onClick={() => setNavigation('knowledge')}
            >
              <Database size={16} /> Knowledge Graph
            </button>
            <button
              className={`nav-item ${navigation === 'cases' ? 'active' : ''}`}
              onClick={() => setNavigation('cases')}
            >
              <Layers size={16} /> Investigations
            </button>
            <button
              className={`nav-item ${navigation === 'audit' ? 'active' : ''}`}
              onClick={() => setNavigation('audit')}
            >
              <ShieldCheck size={16} /> Audit Logs
            </button>
          </nav>
        </div>
        <div className="header-center">
          <SearchInterface />
        </div>
        <div className="header-right">
          <div className="role-switcher glass px-2 py-1 rounded-lg flex gap-1 mr-4">
            <button
              className={`btn btn-xs ${userRole === 'analyst' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setUserRole('analyst')}
            >
              Analyst
            </button>
            <button
              className={`btn btn-xs ${userRole === 'investigator' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setUserRole('investigator')}
            >
              Investigator
            </button>
          </div>
          <button className="btn btn-ghost text-xs" onClick={clearGraph}>Clear</button>
          <button className="btn btn-primary">Save Case</button>
        </div>
      </header>

      <main className="main-workspace">
        <section className="sidebar panel glass">
          <div className="panel-header">Investigation Explorer</div>
          <div className="panel-content explorer-list">
            <div className="stats text-xs mono text-muted mb-4">
              {nodes.length} Entities in workspace
            </div>
            {nodes.length === 0 ? (
              <p className="text-muted text-sm text-center mt-8">Search for an entity to begin</p>
            ) : (
              <div className="entity-pills">
                {nodes.map(node => (
                  <div key={node.id} className="entity-pill glass">
                    <span className="text-xs mono">{node.type.substring(0, 1)}</span>
                    <span className="truncate">{node.properties.full_name || node.properties.msisdn || node.id}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {renderMainContent()}
      </main>

      <style>{`
        .app-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
        }
        .app-header {
          height: var(--header-height);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          z-index: 100;
        }
        .header-left { display: flex; align-items: center; gap: 20px; }
        .v-divider { width: 1px; height: 24px; background: var(--border); }
        .main-nav { display: flex; gap: 8px; }
        .nav-item {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 0.8125rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
        }
        .nav-item.active { color: var(--primary); background: rgba(59, 130, 246, 0.1); }
        
        .header-right { display: flex; gap: 12px; }
        
        .logo {
          font-weight: 800;
          letter-spacing: 2px;
          color: var(--primary);
        }
        .main-workspace {
          flex: 1;
          display: flex;
          padding: 12px;
          gap: 12px;
          overflow: hidden;
        }
        .sidebar {
          width: var(--sidebar-width);
          display: flex;
          flex-direction: column;
        }
        .viewport {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .viewport-header {
          padding: 8px 16px;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: center;
          background: rgba(255, 255, 255, 0.02);
        }
        .detail-panel {
          width: 400px;
          display: flex;
          flex-direction: column;
        }
        .panel-header {
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
          font-weight: 700;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.02);
        }
        .panel-content {
          padding: 16px;
          flex: 1;
          overflow-y: auto;
        }
        .explorer-list { display: flex; flex-direction: column; }
        .entity-pills { display: flex; flex-direction: column; gap: 6px; }
        .entity-pill {
          padding: 8px 12px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.8125rem;
        }
        .view-selector {
          display: flex;
          gap: 4px;
          padding: 2px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
        }
        .view-selector .btn {
          padding: 6px 12px;
          font-size: 0.75rem;
        }
        .view-selector .btn.active {
          background: var(--primary);
          color: white;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }
        .view-content {
          flex: 1;
          background: var(--bg-main);
          position: relative;
          overflow: hidden;
        }
        .mb-4 { margin-bottom: 1rem; }
        .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      `}</style>
      <ToastContainer />
    </div>
  );
};

export default App;
