import React, { useContext, useState } from 'react';
import { Trash2, Plus, Star, RefreshCw, Loader2 } from 'lucide-react';
import { AnimeContext } from '../context/AnimeContext';
import { GlassCard } from './GlassCard';
import { supabase } from '../supabaseClient';
import { validateStatus, validateRating, validateEpisodes, validateRewatches } from '../lib/validate';
import { sanitizeError, logError } from '../lib/errors';
import toast from 'react-hot-toast';

export const AnimeCard = ({ anime }) => {
  const { dispatch } = useContext(AnimeContext);
  const [deleting, setDeleting] = useState(false);
  const [incrementing, setIncrementing] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);
  const [changingRating, setChangingRating] = useState(false);
  const [incrementingRewatch, setIncrementingRewatch] = useState(false);
  
  // Added the Supabase deletion logic
  const handleRemove = async () => {
    // Verify the user is logged in
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("You must be logged in to delete anime!");
      return;
    }

    setDeleting(true);
    
    // Tell Supabase to delete this specific anime from the database
    const { error } = await supabase
      .from('tracked_anime')
      .delete()
      .eq('mal_id', anime.mal_id)
      .eq('user_id', user.id); // Extra safety check to ensure they own it

    // Handle the result
    if (error) {
      setDeleting(false);
      logError('Delete anime', error);
      toast.error(sanitizeError(error));
      return; // Stop here so it stays on the screen if the database fails
    }

    // If successful in the cloud, remove it from the local React state
    dispatch({
      type: 'REMOVE_ANIME',
      payload: { id: anime.mal_id }
    });
    
    toast.success('Anime removed from watchlist');
    setDeleting(false);
  };

  // --- NEW: Added the Supabase Episode Update logic ---
  const handleIncrement = async () => {
    // 1. Verify the user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in to update progress!");
      return;
    }

    // 2. Calculate the new progress and status
    let newWatched = anime.watchedEpisodes + 1;
    let newStatus = anime.status;

    // Cap it at max episodes and auto-change status to 'Completed' if finished
    if (anime.episodes && newWatched >= anime.episodes) {
      newWatched = anime.episodes;
      newStatus = 'Completed';
    } else if (newStatus !== 'Watching') {
      newStatus = 'Watching';
    }

    // 3. Validate before sending
    const epValidation = validateEpisodes(newWatched, anime.episodes);
    if (!epValidation.valid) {
      toast.error(epValidation.error);
      return;
    }
    const statusValidation = validateStatus(newStatus);
    if (!statusValidation.valid) {
      toast.error(statusValidation.error);
      return;
    }

    setIncrementing(true);

    // 4. Send the update to Supabase (use lowercase for status)
    const { error } = await supabase
      .from('tracked_anime')
      .update({ 
        episodes_watched: newWatched,
        status: newStatus.toLowerCase() 
      })
      .eq('mal_id', anime.mal_id)
      .eq('user_id', user.id);

    if (error) {
      setIncrementing(false);
      logError('Update progress', error);
      toast.error(sanitizeError(error));
      return;
    }

    // 5. Update the local React state if the database succeeds
    dispatch({ type: 'SET_EPISODES', payload: { id: anime.mal_id, episodes: newWatched } });
    toast.success('Progress updated!');
    setIncrementing(false);
  };
  // ----------------------------------------------------

  // --- NEW: Supabase Status Update ---
  const handleStatusChange = async (newStatus) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in to update status!");
      return;
    }

    // Validate before sending
    const statusValidation = validateStatus(newStatus);
    if (!statusValidation.valid) {
      toast.error(statusValidation.error);
      return;
    }

    setChangingStatus(true);

    const { error } = await supabase
      .from('tracked_anime')
      .update({ status: newStatus.toLowerCase() })
      .eq('mal_id', anime.mal_id)
      .eq('user_id', user.id);

    if (error) {
      setChangingStatus(false);
      logError('Update status', error);
      toast.error(sanitizeError(error));
      return;
    }

    dispatch({ type: 'UPDATE_STATUS', payload: { id: anime.mal_id, status: newStatus } });
    toast.success('Status updated!');
    setChangingStatus(false);
  };
  // ------------------------------------

  // --- NEW: Supabase Rating Update ---
  const handleRatingChange = async (newRating) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in to update rating!");
      return;
    }

    // Validate before sending
    const ratingValidation = validateRating(newRating);
    if (!ratingValidation.valid) {
      toast.error(ratingValidation.error);
      return;
    }

    setChangingRating(true);

    const { error } = await supabase
      .from('tracked_anime')
      .update({ rating: newRating })
      .eq('mal_id', anime.mal_id)
      .eq('user_id', user.id);

    if (error) {
      setChangingRating(false);
      logError('Update rating', error);
      toast.error(sanitizeError(error));
      return;
    }

    dispatch({ type: 'UPDATE_RATING', payload: { id: anime.mal_id, rating: newRating } });
    toast.success('Rating updated!');
    setChangingRating(false);
  };
  // ------------------------------------

  // --- NEW: Supabase Rewatch Increment ---
  const handleRewatchIncrement = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in to update rewatches!");
      return;
    }

    const newRewatches = anime.rewatches + 1;

    // Validate before sending
    const rewatchValidation = validateRewatches(newRewatches);
    if (!rewatchValidation.valid) {
      toast.error(rewatchValidation.error);
      return;
    }

    setIncrementingRewatch(true);

    const { error } = await supabase
      .from('tracked_anime')
      .update({ rewatches: newRewatches })
      .eq('mal_id', anime.mal_id)
      .eq('user_id', user.id);

    if (error) {
      setIncrementingRewatch(false);
      logError('Update rewatches', error);
      toast.error(sanitizeError(error));
      return;
    }

    dispatch({ type: 'INCREMENT_REWATCH', payload: { id: anime.mal_id } });
    toast.success('Rewatch count updated!');
    setIncrementingRewatch(false);
  };
  // --------------------------------------

  const progressPercent = anime.episodes 
    ? Math.min(100, Math.round((anime.watchedEpisodes / anime.episodes) * 100)) 
    : 0;

  return (
    <GlassCard className="flex flex-col sm:flex-row gap-5 p-5 relative group hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/20 hover:border-white/20 hover:bg-white/10 z-10">
      
      <button 
        onClick={handleRemove}
        disabled={deleting}
        className="absolute top-4 right-4 text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all bg-black/40 backdrop-blur-md p-2 rounded-full border border-transparent hover:border-red-400/50 z-20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
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
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={changingStatus}
              className="bg-black/40 text-slate-200 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 cursor-pointer backdrop-blur-md transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
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
                {/* --- NEW: Wired up the handleIncrement function here --- */}
                <button 
                  onClick={handleIncrement}
                  disabled={anime.episodes && anime.watchedEpisodes >= anime.episodes || incrementing}
                  className="flex items-center gap-1 bg-indigo-500/80 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-indigo-400/50 transition-all shadow-lg shadow-indigo-500/20"
                >
                  {incrementing ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} 1 Ep
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
                    onChange={(e) => handleRatingChange(parseInt(e.target.value))}
                    disabled={changingRating}
                    className="bg-transparent text-white font-bold text-sm focus:outline-none cursor-pointer appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
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
                    onClick={handleRewatchIncrement}
                    disabled={incrementingRewatch}
                    className="flex items-center gap-1 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {incrementingRewatch ? <Loader2 size={10} className="animate-spin" /> : <RefreshCw size={10} />} Add
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