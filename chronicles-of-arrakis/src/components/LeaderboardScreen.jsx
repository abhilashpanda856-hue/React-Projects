import React from 'react';
import { usePlayers } from '../hooks/usePlayers';

function LeaderboardScreen({ phase }) {
  const players = usePlayers();
  
  const playersList = Object.values(players || {});

  // Calculate score based on phase
  const sortedPlayers = playersList.sort((a, b) => {
    if (phase === 'TRIAL' || phase === 'SUMMARY') {
      return (b.bossDamageDealt || 0) - (a.bossDamageDealt || 0);
    } else {
      // For GRINDING, sum up stats
      const getStatTotal = (p) => {
        if (!p.stats) return 0;
        return p.stats.stamina + p.stats.atk + p.stats.def + p.stats.int + p.stats.arrogance + p.stats.friendship;
      };
      return getStatTotal(b) - getStatTotal(a);
    }
  });

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-stone-900/90 border-2 border-amber-500/30 rounded-lg shadow-2xl backdrop-blur-md animate-fade-in">
      <h2 className="text-4xl font-serif text-amber-500 mb-2 text-center tracking-widest uppercase">Leaderboard</h2>
      <p className="text-center text-stone-400 mb-8 font-mono">
        {phase === 'TRIAL' || phase === 'SUMMARY' ? 'Top Damage Dealers' : 'Highest Total Stats'}
      </p>

      <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {sortedPlayers.map((player, index) => {
          let score = 0;
          if (phase === 'TRIAL' || phase === 'SUMMARY') {
            score = player.bossDamageDealt || 0;
          } else {
            if (player.stats) {
              score = player.stats.stamina + player.stats.atk + player.stats.def + player.stats.int + player.stats.arrogance + player.stats.friendship;
            }
          }

          return (
            <div 
              key={index}
              className={`flex justify-between items-center p-4 rounded border ${
                index === 0 ? 'bg-amber-900/40 border-amber-500' : 
                index === 1 ? 'bg-stone-800/60 border-slate-400' :
                index === 2 ? 'bg-stone-800/60 border-amber-700' :
                'bg-stone-800/40 border-stone-700'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`text-2xl font-bold ${
                  index === 0 ? 'text-amber-500' :
                  index === 1 ? 'text-slate-300' :
                  index === 2 ? 'text-amber-700' :
                  'text-stone-500'
                }`}>
                  #{index + 1}
                </span>
                <div>
                  <span className="text-xl text-stone-100 font-serif">{player.name}</span>
                  {player.role && (
                    <span className="ml-3 text-xs font-mono text-amber-400/70 border border-amber-500/30 rounded px-1 py-0.5">
                      {player.role}
                    </span>
                  )}
                  {player.isDead && (
                    <span className="ml-2 text-xs font-mono text-red-500">
                      [DEAD]
                    </span>
                  )}
                </div>
              </div>
              <div className="text-2xl font-mono text-amber-200">
                {score} {phase === 'TRIAL' || phase === 'SUMMARY' ? 'DMG' : 'PTS'}
              </div>
            </div>
          );
        })}

        {sortedPlayers.length === 0 && (
          <div className="text-center text-stone-500 py-8 font-mono">
            No players found.
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(LeaderboardScreen);
