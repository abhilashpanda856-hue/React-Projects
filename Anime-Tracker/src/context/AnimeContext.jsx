import React, { createContext, useReducer, useEffect } from 'react';

const loadState = () => {
  try {
    const serialized = localStorage.getItem('premiumAnimeTracker');
    if (serialized === null) return { list: [] };
    return { list: JSON.parse(serialized) };
  } catch (err) {
    return { list: [] };
  }
};

const initialState = loadState();

const animeReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ANIME': {
      if (state.list.find(a => a.mal_id === action.payload.mal_id)) return state;
      return {
        ...state,
        list: [{
          ...action.payload,
          watchedEpisodes: 0,
          status: 'Plan to Watch',
          rewatches: 0,
          rating: 0,
          addedAt: new Date().toISOString()
        }, ...state.list]
      };
    }
    case 'UPDATE_STATUS': {
      return {
        ...state,
        list: state.list.map(anime => 
          anime.mal_id === action.payload.id ? { ...anime, status: action.payload.status } : anime
        )
      };
    }
    case 'INCREMENT_EPISODE': {
      return {
        ...state,
        list: state.list.map(anime => {
          if (anime.mal_id !== action.payload.id) return anime;
          let newWatched = anime.watchedEpisodes;
          if (!anime.episodes || newWatched < anime.episodes) newWatched += 1;
          
          let newStatus = anime.status;
          if (anime.episodes && newWatched === anime.episodes && newStatus !== 'Completed') {
            newStatus = 'Completed';
          } else if (newStatus !== 'Watching') {
            newStatus = 'Watching';
          }
          return { ...anime, watchedEpisodes: newWatched, status: newStatus };
        })
      };
    }
    case 'INCREMENT_REWATCH': {
      return {
        ...state,
        list: state.list.map(anime => 
          anime.mal_id === action.payload.id ? { ...anime, rewatches: anime.rewatches + 1 } : anime
        )
      };
    }
    case 'UPDATE_RATING': {
      return {
        ...state,
        list: state.list.map(anime => 
          anime.mal_id === action.payload.id ? { ...anime, rating: action.payload.rating } : anime
        )
      };
    }
    case 'REMOVE_ANIME': {
      return { ...state, list: state.list.filter(a => a.mal_id !== action.payload.id) };
    }
    default:
      return state;
  }
};

export const AnimeContext = createContext();

export const AnimeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(animeReducer, initialState);

  useEffect(() => {
    localStorage.setItem('premiumAnimeTracker', JSON.stringify(state.list));
  }, [state.list]);

  return (
    <AnimeContext.Provider value={{ state, dispatch }}>
      {children}
    </AnimeContext.Provider>
  );
};