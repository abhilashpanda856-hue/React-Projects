import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';

export function useGameState() {
  const [gameState, setGameState] = useState({
    status: 'WAITING', // WAITING, GRINDING, OVERLAY, REVEAL, TRIAL, DEAD, SUMMARY, LEADERBOARD
    currentQuestionIndex: 0,
    questionStartTime: null,
  });

  useEffect(() => {
    const gameStateRef = ref(db, 'gameState');
    const unsubscribe = onValue(gameStateRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setGameState(data);
      }
    });

    return () => unsubscribe();
  }, []);

  return gameState;
}
