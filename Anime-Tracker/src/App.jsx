import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Auth from './Auth';
import { AnimeProvider } from './context/AnimeContext';
import { TrackerApp } from './components/TrackerApp';

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Check for an existing session when the app loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for any changes (like logging in or clicking sign out)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup the listener when the component unmounts
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      {!session ? (
        <Auth />
      ) : (
        <div className="flex flex-col min-h-screen">
          {/* A temporary sign-out bar for testing */}
          <div className="flex justify-end p-4 bg-gray-800 border-b border-gray-700">
            <button 
              onClick={() => supabase.auth.signOut()}
              className="px-4 py-2 font-semibold text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
          
          {/* Your actual Anime Tracker App */}
          <div className="flex-grow">
            <AnimeProvider>
              <TrackerApp />
            </AnimeProvider>
          </div>
        </div>
      )}
    </div>
  );
}