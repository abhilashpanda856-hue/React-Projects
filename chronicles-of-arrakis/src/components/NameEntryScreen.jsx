import React, { useState } from 'react';
import { ref, set } from 'firebase/database';
import { db } from '../firebase';
import { INITIAL_STATS } from '../data/gameData';

export default function NameEntryScreen({ onJoin }) {
  const [name, setName] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsJoining(true);
    // Generate a simple unique ID for the player
    const playerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

    const newPlayer = {
      name: name.trim(),
      stats: { ...INITIAL_STATS },
      hp: 100,
      maxHp: 100,
      bossDamageDealt: 0,
      role: null,
      comrades: [],
      tankUsed: false,
      supportUsed: false,
      isDead: false,
      hasAnswered: false, // Flag to check if they have submitted an answer for current question
    };

    try {
      await set(ref(db, `players/${playerId}`), newPlayer);
      onJoin(playerId, name.trim());
    } catch (error) {
      console.error("Error joining game:", error);
      setIsJoining(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-stone-900/80 border border-amber-900/50 rounded-lg shadow-2xl backdrop-blur-sm animate-fade-in flex flex-col items-center">
      <h2 className="text-3xl font-serif text-amber-500 mb-6 tracking-widest uppercase">Enter the Arena</h2>
      <form onSubmit={handleJoin} className="w-full flex flex-col gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name, warrior..."
          className="w-full p-4 bg-stone-800 text-amber-100 border border-stone-600 rounded focus:outline-none focus:border-amber-500 font-mono text-center"
          disabled={isJoining}
          required
        />
        <button
          type="submit"
          disabled={isJoining || !name.trim()}
          className="w-full py-4 bg-amber-700/80 hover:bg-amber-600/90 text-stone-100 font-bold tracking-widest uppercase rounded border border-amber-500/50 transition-all disabled:opacity-50"
        >
          {isJoining ? 'Joining...' : 'Join Game'}
        </button>
      </form>
    </div>
  );
}
