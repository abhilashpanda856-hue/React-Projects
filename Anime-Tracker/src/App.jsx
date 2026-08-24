import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Auth from './Auth';
import { AnimeProvider } from './context/AnimeContext';
import { Toaster } from 'react-hot-toast';
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
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(30, 27, 75, 0.95)',
            color: '#f1f5f9',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '12px',
            padding: '12px 16px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#f1f5f9',
            },
            border: '1px solid rgba(34, 197, 94, 0.3)',
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#f1f5f9',
            },
            border: '1px solid rgba(239, 68, 68, 0.3)',
          },
          loading: {
            border: '1px solid rgba(99, 102, 241, 0.3)',
          },
        }}
      />
    </div>
  );
}
