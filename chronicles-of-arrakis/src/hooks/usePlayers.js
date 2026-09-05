import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';

export function usePlayers() {
  const [players, setPlayers] = useState({});

  useEffect(() => {
    const playersRef = ref(db, 'players');
    const unsubscribe = onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      setPlayers(data || {});
    });

    return () => unsubscribe();
  }, []);

  return players;
}
