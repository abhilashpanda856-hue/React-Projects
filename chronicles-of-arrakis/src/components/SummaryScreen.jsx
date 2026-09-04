import React from 'react';
import { Trophy, Flame, RotateCcw } from 'lucide-react';

export default function SummaryScreen({ bossDamageDealt, selectedRole, onReset }) {
  let rank = 'Initiate';
  let rankColor = 'text-stone-400';
  let badgeColor = 'border-stone-700 bg-stone-900/60';

  if (bossDamageDealt > 300) {
    rank = 'Lisan al Gaib (1st Tier)';
    rankColor = 'text-amber-400 text-glow-amber';
    badgeColor = 'border-amber-500/50 bg-amber-500/10 shadow-[0_0_30px_rgba(245,158,11,0.2)]';
  } else if (bossDamageDealt > 200) {
    rank = 'Fedaykin Warrior (2nd Tier)';
    rankColor = 'text-emerald-400';
    badgeColor = 'border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.2)]';
  } else if (bossDamageDealt > 100) {
    rank = 'Desert Survivor (3rd Tier)';
    rankColor = 'text-sky-400';
    badgeColor = 'border-sky-500/50 bg-sky-500/10 shadow-[0_0_30px_rgba(56,189,248,0.2)]';
  }

  return (
    <div className="text-center space-y-8 max-w-2xl mx-auto animate-fade-in-up">
      {/* Trophy Section */}
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full" />
        <div className="relative w-28 h-28 rounded-3xl bg-stone-900/90 border border-amber-500/40 flex items-center justify-center mx-auto shadow-2xl">
          <Trophy className="w-14 h-14 text-amber-500 animate-pulse" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-4xl sm:text-5xl font-black font-cinzel text-white tracking-wider text-glow-amber">
          TRIAL COMPLETE
        </h2>
        <p className="text-amber-400 tracking-[0.25em] uppercase font-mono text-sm">
          Orientation Survived • Judgment Affirmed
        </p>
      </div>

      {/* Stats Breakdown Card */}
      <div className="bg-stone-900/90 p-8 rounded-2xl border border-stone-800 shadow-2xl backdrop-blur-md space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-stone-950/70 p-4 rounded-xl border border-stone-800/80">
            <div className="text-xs text-stone-400 uppercase font-mono tracking-wider mb-1">
              Final Archetype
            </div>
            <div className="text-xl font-bold font-cinzel text-white">
              {selectedRole}
            </div>
          </div>

          <div className="bg-stone-950/70 p-4 rounded-xl border border-stone-800/80">
            <div className="text-xs text-stone-400 uppercase font-mono tracking-wider mb-1">
              Total Damage Dealt
            </div>
            <div className="text-3xl font-black font-mono text-amber-500">
              {bossDamageDealt}
            </div>
          </div>
        </div>

        {/* Achieved Rank */}
        <div className={`p-6 rounded-xl border ${badgeColor} transition-all`}>
          <div className="flex items-center justify-center gap-2 text-xs text-stone-400 uppercase font-mono tracking-widest mb-1">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Achieved Arrakis Standing</span>
          </div>
          <div className={`text-2xl sm:text-3xl font-black font-cinzel ${rankColor}`}>
            {rank}
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-8 py-4 bg-stone-800 hover:bg-stone-700 hover:border-amber-500/40 border border-stone-700 text-white font-cinzel font-bold text-sm tracking-wider uppercase rounded-xl transition-all shadow-lg active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Simulation</span>
        </button>
      </div>
    </div>
  );
}
