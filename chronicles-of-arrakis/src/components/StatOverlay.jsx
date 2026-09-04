import React from 'react';
import { Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const STAT_NAMES = {
  atk: 'Attack (ATK)',
  def: 'Defense (DEF)',
  stamina: 'Stamina (STM)',
  friendship: 'Friendship (FRND)',
  int: 'Intelligence (INT)',
  arrogance: 'Arrogance (ARRG)',
};

export default function StatOverlay({ recentStatChanges }) {
  return (
    <div className="w-full max-w-md mx-auto animate-fade-in-up">
      <div className="bg-stone-900/90 border border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(245,158,11,0.2)] backdrop-blur-md text-center space-y-6">
        <div className="flex items-center justify-center gap-2 text-amber-400">
          <Activity className="w-5 h-5 animate-pulse" />
          <h3 className="text-lg font-cinzel font-bold tracking-widest uppercase">
            Decisions Logged...
          </h3>
        </div>

        <p className="text-xs font-mono text-stone-400">
          Neural synchrony adjusting to Arrakis trial conditions
        </p>

        <div className="space-y-2.5 bg-stone-950/80 p-4 rounded-xl border border-stone-800">
          {Object.entries(recentStatChanges).map(([key, val]) => {
            const isPositive = val > 0;
            return (
              <div
                key={key}
                className="flex justify-between items-center text-sm font-mono border-b border-stone-800/60 pb-2 last:border-0 last:pb-0"
              >
                <span className="text-stone-300">
                  {STAT_NAMES[key] || key.toUpperCase()}
                </span>
                <span
                  className={`flex items-center gap-1 font-bold ${
                    isPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isPositive ? (
                    <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-rose-400" />
                  )}
                  {isPositive ? `+${val}` : val}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-2 text-stone-500 text-xs font-mono">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span>Synchronizing next scenario...</span>
        </div>
      </div>
    </div>
  );
}
