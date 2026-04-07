import React, { useState, useEffect, useRef, useContext } from 'react';
import { Search, Plus, CheckCircle, RefreshCw, X } from 'lucide-react';
import { AnimeContext } from '../context/AnimeContext';
import { useDebounce } from '../hooks/useDebounce';

export const SmartSearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const debouncedQuery = useDebounce(query, 500);
  const { state, dispatch } = useContext(AnimeContext);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchAnime = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const res = await fetch(`https://api.jikan.moe/v4/anime?q=${debouncedQuery}&sfw=true&limit=6`);
        const data = await res.json();
        setResults(data.data || []);
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
      }
      setIsSearching(false);
    };

    fetchAnime();
  }, [debouncedQuery]);

  const handleAdd = (anime) => {
    dispatch({
      type: 'ADD_ANIME',
      payload: {
        mal_id: anime.mal_id,
        title: anime.title,
        image: anime.images.jpg.image_url,
        episodes: anime.episodes
      }
    });
    setQuery('');
    setShowDropdown(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md z-50">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
        <div className="relative flex items-center bg-slate-900/80 border border-white/10 rounded-full backdrop-blur-md">
          <Search className="absolute left-4 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search anime to add..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value.length > 0) setShowDropdown(true);
            }}
            onFocus={() => {
              if (results.length > 0) setShowDropdown(true);
            }}
            className="w-full bg-transparent text-white px-12 py-3 focus:outline-none placeholder-slate-400 text-sm"
          />
          {query && (
            <button 
              onClick={() => { setQuery(''); setResults([]); setShowDropdown(false); }}
              className="absolute right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          )}
          {isSearching && (
            <RefreshCw className="absolute right-10 text-indigo-400 animate-spin" size={16} />
          )}
        </div>
      </div>

      {showDropdown && (query.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {results.length > 0 ? (
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {results.map((anime) => {
                const isInList = state.list.some(a => a.mal_id === anime.mal_id);
                return (
                  <div key={anime.mal_id} className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                    <img src={anime.images.jpg.image_url} alt={anime.title} className="w-10 h-14 object-cover rounded-md shadow-md" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm font-semibold truncate" title={anime.title}>{anime.title}</h4>
                      <span className="text-slate-400 text-xs">{anime.episodes ? `${anime.episodes} Episodes` : 'Ongoing'}</span>
                    </div>
                    <button 
                      onMouseDown={(e) => { e.preventDefault(); handleAdd(anime); }}
                      disabled={isInList}
                      className={`p-2 rounded-full transition-all flex-shrink-0 ${
                        isInList 
                          ? 'bg-white/5 text-slate-500 cursor-not-allowed' 
                          : 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500 hover:text-white border border-indigo-500/30'
                      }`}
                    >
                      {isInList ? <CheckCircle size={16} /> : <Plus size={16} />}
                    </button>
                  </div>
                )
              })}
            </div>
          ) : (
            !isSearching && (
              <div className="p-6 text-center text-slate-400 text-sm">
                No results found for "{query}"
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};