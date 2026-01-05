import React, { useState } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { api } from '../../services/api';
import { useInvestigationStore } from '../../store/useInvestigationStore';

const SearchInterface: React.FC = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const { setSearchResults, searchResults, addGraphData, setSelectedEntity } = useInvestigationStore();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const response = await api.search(query);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResultClick = async (result: any) => {
        try {
            // When a result is clicked, we get full details and add to graph
            const response = await api.getEntity(result.type, result.id);
            const entity = response.data;

            addGraphData({ nodes: [entity], edges: [] });
            setSelectedEntity(entity);
            setQuery('');
            setSearchResults([]);
        } catch (error) {
            console.error('Failed to load entity:', error);
        }
    };

    return (
        <div className="search-container">
            <form onSubmit={handleSearch} className="search-form">
                <SearchIcon size={18} className="search-icon" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search entities (name, phone, account...)"
                    className="search-input glass"
                />
                <div className="search-actions">
                    {loading && <div className="loading-spinner" />}
                    {query && <X size={18} className="clear-icon" onClick={() => { setQuery(''); setSearchResults([]); }} />}
                </div>
            </form>

            {searchResults.length > 0 && (
                <div className="results-dropdown panel glass">
                    <div className="results-header text-xs mono px-4 py-2 border-b">
                        Found {searchResults.length} results
                    </div>
                    {searchResults.map((result: any) => (
                        <div
                            key={`${result.type}-${result.id}`}
                            className="result-item"
                            onClick={() => handleResultClick(result)}
                        >
                            <div className="flex justify-between items-center">
                                <span className="result-name">{result.display_name}</span>
                                <span className="result-type text-xs mono text-muted">{result.type}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
        .search-container { position: relative; width: 400px; }
        .search-form {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-icon { position: absolute; left: 12px; color: var(--text-muted); }
        .search-actions { position: absolute; right: 12px; display: flex; align-items: center; gap: 8px; }
        .clear-icon { color: var(--text-muted); cursor: pointer; }
        .loading-spinner {
            width: 14px;
            height: 14px;
            border: 2px solid rgba(59, 130, 246, 0.2);
            border-top-color: var(--primary);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .search-input {
          width: 100%;
          padding: 10px 40px;
          border-radius: 24px;
          outline: none;
          color: var(--text-main);
          font-size: 0.875rem;
        }
        .results-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          max-height: 400px;
          overflow-y: auto;
          z-index: 1000;
          padding: 0;
        }
        .results-header {
            background: rgba(255, 255, 255, 0.05);
            color: var(--text-muted);
            border-color: var(--border);
        }
        .result-item {
          padding: 10px 16px;
          cursor: pointer;
          transition: background 0.2s;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }
        .result-item:hover { background: rgba(59, 130, 246, 0.1); }
        .result-name { font-weight: 500; font-size: 0.875rem; }
      `}</style>
        </div>
    );
};

export default SearchInterface;
