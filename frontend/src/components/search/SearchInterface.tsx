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
                {query && <X size={18} className="clear-icon" onClick={() => { setQuery(''); setSearchResults([]); }} />}
            </form>

            {searchResults.length > 0 && (
                <div className="results-dropdown panel glass">
                    {searchResults.map((result: any) => (
                        <div
                            key={`${result.type}-${result.id}`}
                            className="result-item"
                            onClick={() => handleResultClick(result)}
                        >
                            <div className="result-type text-xs mono text-muted">{result.type}</div>
                            <div className="result-name">{result.display_name}</div>
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
        .clear-icon { position: absolute; right: 12px; color: var(--text-muted); cursor: pointer; }
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
          padding: 8px 0;
        }
        .result-item {
          padding: 8px 16px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .result-item:hover { background: rgba(255, 255, 255, 0.05); }
        .result-type { margin-bottom: 2px; }
        .result-name { font-weight: 500; font-size: 0.875rem; }
      `}</style>
        </div>
    );
};

export default SearchInterface;
