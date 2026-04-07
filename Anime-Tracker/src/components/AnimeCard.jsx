import React, { useContext } from 'react';
import { Trash2, Plus, Star, RefreshCw } from 'lucide-react';
import { AnimeContext } from '../context/AnimeContext';
import { GlassCard } from './GlassCard';

export const AnimeCard = ({ anime }) => {
  const { dispatch } = useContext(AnimeContext);
  
  const progressPercent = anime.episodes 
    ? Math.min(100, Math.round((anime.watchedEpisodes / anime.episodes) * 100)) 
    : 0;

  return (
    <GlassCard className="flex flex-col sm:flex-row gap-5 p-5 relative group hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/20 hover:border-white/20 hover:bg-white/10 z-10">
      
      <button 
        onClick={() => dispatch({ type: 'REMOVE_ANIME', payload: { id: anime.mal_id } })}
        className="absolute top-4 right-4 text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all bg-black/40 backdrop-blur-md p-2 rounded-full border border-transparent hover:border-red-400/50 z-20"
      >
        <Trash2 size={16} />
      </button>

      <div className="relative w-full sm:w-36 h-64 sm:h-52 shrink-0 rounded-xl overflow-hidden">
        <img 
          src={anime.image} 
          alt={anime.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] pointer-events-none" />
      </div>

      <div className="flex-1 flex flex-col justify-between z-10">
        <div>
          <h3 className="text-lg font-bold text-white mb-2 leading-tight pr-8 tracking-wide drop-shadow-md">
            {anime.title}
          </h3>
          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <select 
              value={anime.status}
              onChange={(e) => dispatch({ type: 'UPDATE_STATUS', payload: { id: anime.mal_id, status: e.target.value } })}
              className="bg-black/40 text-slate-200 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 cursor-pointer backdrop-blur-md transition-all appearance-none"
              style={{ WebkitAppearance: 'none' }}
            >
              <option value="Watching" className="bg-slate-900">Watching</option>
              <option value="Completed" className="bg-slate-900">Completed</option>
              <option value="Plan to Watch" className="bg-slate-900">Plan to Watch</option>
              <option value="Dropped" className="bg-slate-900">Dropped</option>
            </select>

            <span className="text-xs font-semibold text-slate-300 bg-black/30 border border-white/10 px-2.5 py-1.5 rounded-lg backdrop-blur-md">
              {anime.episodes ? `${anime.episodes} EPS` : 'ONGOING'}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {['Watching', 'Plan to Watch', 'Dropped'].includes(anime.status) && (
            <div className="bg-black/20 backdrop-blur-md p-3 rounded-xl border border-white/5">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-medium text-slate-300 tracking-wide uppercase">
                  Progress <span className="text-white ml-1 font-bold">{anime.watchedEpisodes}</span> / {anime.episodes || '?'}
                </span>
                <button 
                  onClick={() => dispatch({ type: 'INCREMENT_EPISODE', payload: { id: anime.mal_id } })}
                  disabled={anime.episodes && anime.watchedEpisodes >= anime.episodes}
                  className="flex items-center gap-1 bg-indigo-500/80 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-indigo-400/50 transition-all shadow-lg shadow-indigo-500/20"
                >
                  <Plus size={14} /> 1 Ep
                </button>
              </div>
              
              <div className="w-full bg-slate-900/80 rounded-full h-1.5 overflow-hidden shadow-inner">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-400 h-1.5 rounded-full transition-all duration-700 ease-out relative" 
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 blur-[2px] rounded-full"></div>
                </div>
              </div>
            </div>
          )}

          {anime.status === 'Completed' && (
            <div className="flex flex-wrap gap-6 bg-black/20 backdrop-blur-md p-3.5 rounded-xl border border-purple-500/20">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-purple-300 uppercase tracking-widest">Rating</label>
                <div className="flex items-center gap-1.5">
                  <Star size={14} className={anime.rating > 0 ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" : "text-slate-600"} />
                  <select 
                    value={anime.rating}
                    onChange={(e) => dispatch({ type: 'UPDATE_RATING', payload: { id: anime.mal_id, rating: parseInt(e.target.value) } })}
                    className="bg-transparent text-white font-bold text-sm focus:outline-none cursor-pointer appearance-none"
                  >
                    <option value="0" className="bg-slate-900">Unrated</option>
                    {[1,2,3,4,5,6,7,8,9,10].map(num => <option key={num} value={num} className="bg-slate-900">{num} / 10</option>)}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 border-l border-white/10 pl-6">
                <label className="text-[10px] font-bold text-purple-300 uppercase tracking-widest">Rewatches</label>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white text-sm">{anime.rewatches}</span>
                  <button 
                    onClick={() => dispatch({ type: 'INCREMENT_REWATCH', payload: { id: anime.mal_id } })}
                    className="flex items-center gap-1 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md transition-colors"
                  >
                    <RefreshCw size={10} /> Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </GlassCard>
  );
};