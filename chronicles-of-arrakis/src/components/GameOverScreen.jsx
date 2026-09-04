import React from 'react';
import { Skull, RotateCcw } from 'lucide-react';

export default function GameOverScreen({ bossDamageDealt, selectedRole, onReset }) {
  return (
    <div className="w-full max-w-lg mx-auto text-center space-y-6 p-8 sm:p-10 bg-stone-900/90 border border-rose-800/80 rounded-2xl shadow-[0_0_50px_rgba(225,29,72,0.25)] backdrop-blur-md animate-fade-in">
      <div className="w-20 h-20 mx-auto rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.3)] animate-pulse">
        <Skull className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-rose-400">
          Simulation Failed
        </p>
        <h2 className="text-3xl sm:text-4xl font-black font-cinzel text-white text-glow-red">
          CONSUMED BY THE SANDS
        </h2>
      </div>

      <p className="text-stone-300 text-sm sm:text-base leading-relaxed bg-stone-950/60 p-4 rounded-xl border border-stone-800">
        {selectedRole === 'MENTAT'
          ? 'Your calculations failed. With no tribe to shield you from harm, you fell before the mighty Maker.'
          : 'Your tribe was overwhelmed. Even with solidarity, Shai-Hulud proved insurmountable.'}
      </p>

      <div className="bg-stone-950/80 p-5 rounded-xl border border-stone-800/80 space-y-1">
        <div className="text-xs uppercase font-mono text-stone-500 tracking-wider">
          Total Damage Dealt
        </div>
        <div className="text-4xl font-mono font-black text-amber-500 text-glow-amber">
          {bossDamageDealt}
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-rose-800 hover:bg-rose-700 text-white font-cinzel font-bold rounded-lg shadow-lg hover:shadow-rose-900/40 transition-all active:scale-95 uppercase tracking-wider text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
}
