import React, { useState, useContext, useEffect } from 'react';
import { Tv, ListVideo, PlayCircle, CheckCircle, Clock, XCircle, MonitorPlay } from 'lucide-react';
import { AnimeContext } from '../context/AnimeContext';
import { SmartSearchBar } from './SmartSearchBar';
import { AnimeCard } from './AnimeCard';
import { GlassCard } from './GlassCard';
import { supabase } from '../supabaseClient'; // Imported Supabase client
import { logError } from '../lib/errors';

export const TrackerApp = () => {
  const [listFilter, setListFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  // Added 'dispatch' here so we can send the database data into your React state
  const { state, dispatch } = useContext(AnimeContext); 
  const myList = state.list || [];

  // --- NEW SUPABASE FETCH LOGIC ---
  useEffect(() => {
    const fetchMyWatchlist = async () => {
      setIsLoading(true);
      // 1. Get the currently logged-in user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // 2. Ask Supabase for every anime matching this user's ID
        const { data, error } = await supabase
          .from('tracked_anime')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          logError('Fetch watchlist', error);
        } else if (data) {
          // 3. Map Supabase fields to Context format
          const mappedData = data.map(anime => ({
            ...anime,
            watchedEpisodes: anime.episodes_watched,
            status: anime.status.charAt(0).toUpperCase() + anime.status.slice(1), // 'watching' -> 'Watching'
            image: anime.image || `https://cdn.myanimelist.net/images/anime/${anime.mal_id}.jpg`,
            episodes: anime.episodes || null,
            rewatches: anime.rewatches || 0,
            rating: anime.rating || 0,
            addedAt: anime.created_at
          }));
          
          // 4. Send the data to your global state so the UI updates!
          dispatch({
            type: 'SET_INITIAL_LIST',
            payload: mappedData
          });
        }
      }
      setIsLoading(false);
    };

    fetchMyWatchlist();
  }, [dispatch]);
  // ---------------------------------

  const filteredList = myList.filter(anime => 
    listFilter === 'All' ? true : anime.status === listFilter
  );

  const stats = myList.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen text-slate-100 font-sans relative overflow-x-hidden selection:bg-indigo-500/30">
      
      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-bg {
          background-size: 200% 200%;
          animation: gradient-x 20s ease infinite;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.5); border-radius: 10px; }
      `}</style>

      <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] animate-bg pointer-events-none" />
      <div className="fixed inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none mix-blend-overlay" />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        
        <header className="sticky top-0 z-40 p-4 sm:p-6 backdrop-blur-xl bg-slate-900/30 border-b border-white/10 shadow-2xl">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                <Tv className="text-white" size={22} />
              </div>
              <h1 className="text-2xl font-black text-white tracking-wide drop-shadow-md">
                Anime<span className="text-indigo-400 font-light">Tracker</span>
              </h1>
            </div>
            
            <SmartSearchBar />
          </div>
        </header>

        <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
          
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            <div className="flex flex-wrap gap-3 mb-10 pb-4 border-b border-white/10">
              {[
                { name: 'All', icon: <ListVideo size={16} /> },
                { name: 'Watching', icon: <PlayCircle size={16} className="text-blue-400"/> },
                { name: 'Completed', icon: <CheckCircle size={16} className="text-purple-400"/> },
                { name: 'Plan to Watch', icon: <Clock size={16} className="text-amber-400"/> },
                { name: 'Dropped', icon: <XCircle size={16} className="text-red-400"/> }
              ].map(filter => (
                <button
                  key={filter.name}
                  onClick={() => setListFilter(filter.name)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all backdrop-blur-md ${
                    listFilter === filter.name 
                      ? 'bg-white/15 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/20' 
                      : 'bg-black/20 text-slate-400 border border-transparent hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {filter.icon} {filter.name} 
                  <span className="bg-black/40 text-slate-300 text-xs px-2 py-0.5 rounded-lg ml-1.5">
                    {filter.name === 'All' ? myList.length : (stats[filter.name] || 0)}
                  </span>
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <GlassCard key={i} className="flex flex-col sm:flex-row gap-5 p-5">
                    <div className="relative w-full sm:w-36 h-64 sm:h-52 shrink-0 rounded-xl overflow-hidden">
                      <div className="w-full h-full bg-slate-800 animate-pulse" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="h-6 bg-slate-800 rounded w-3/4 animate-pulse mb-2" />
                        <div className="h-4 bg-slate-800 rounded w-1/2 animate-pulse" />
                      </div>
                      <div className="h-8 bg-slate-800 rounded w-1/3 animate-pulse" />
                    </div>
                  </GlassCard>
                ))}
              </div>
            ) : filteredList.length === 0 ? (
              <GlassCard className="text-center py-24 px-4 border-dashed border-white/20 max-w-2xl mx-auto">
                <div className="bg-white/5 p-6 rounded-full inline-block mb-6 shadow-inner border border-white/10">
                  <MonitorPlay className="text-indigo-400/50" size={56} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">Your Collection is Empty</h3>
                <p className="text-slate-400 mb-8 max-w-md mx-auto text-lg">
                  {listFilter === 'All' 
                    ? "Use the search bar at the top to find and add your favorite shows to your library."
                    : `No anime found in the "${listFilter}" category.`}
                </p>
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredList.map((anime, index) => (
                  <AnimeCard key={`${anime.mal_id}-${index}`} anime={anime} />
                ))}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};