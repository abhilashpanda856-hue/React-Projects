import React from 'react';
import { Users, Brain, Skull, ChevronRight } from 'lucide-react';

export default function IntroScreen({ onStart }) {
  return (
    <div className="w-full max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
      {/* Badge */}
      

      {/* Main Titles */}
      <div className="space-y-3">
        <h2 className="text-amber-500/90 font-cinzel font-semibold tracking-[0.35em] text-sm sm:text-base uppercase">
          Chronicles of Arrakis
        </h2>
        <h1 className="text-4xl sm:text-6xl font-black font-cinzel text-white tracking-wider text-glow-amber">
          ORIENTATION TRIAL
        </h1>
        
      </div>

      {/* Narrative Intro */}
      <p className="text-base sm:text-lg text-stone-300 max-w-2xl mx-auto leading-relaxed">
        Welcome to the desert sands. The choices you make during your early days will forge your destiny.
        Will you walk alone, rally a loyal tribe, or let arrogance consume you?
      </p>

      {/* Three Paths Teaser */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
        <div className="p-4 rounded-lg bg-stone-900/60 border border-sky-900/40 hover:border-sky-500/40 transition-all">
          <div className="flex items-center gap-2 text-sky-400 font-bold mb-1">
            <Users className="w-4 h-4" />
            <span>Fremen Tribe</span>
          </div>
          <p className="text-xs text-stone-400">
            Unite with comrades to unlock the Sayyadina's healing waters, Fedaykin cover fire, and Desert Scout evasion.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-stone-900/60 border border-purple-900/40 hover:border-purple-500/40 transition-all">
          <div className="flex items-center gap-2 text-purple-400 font-bold mb-1">
            <Brain className="w-4 h-4" />
            <span>The Mentat</span>
          </div>
          <p className="text-xs text-stone-400">
            A lethal Glass Cannon. Wield 2.5x critical calculation strikes, but carry zero backup.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-stone-900/60 border border-rose-900/40 hover:border-rose-500/40 transition-all">
          <div className="flex items-center gap-2 text-rose-400 font-bold mb-1">
            <Skull className="w-4 h-4" />
            <span>House Harkonnen</span>
          </div>
          <p className="text-xs text-stone-400">
            Excessive arrogance and betrayal invite the doom of Shai-Hulud before the trial even begins.
          </p>
        </div>
      </div>

      {/* Call to action */}
      <div className="pt-4">
        <button
          type="button"
          onClick={onStart}
          className="group relative inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-cinzel font-bold text-lg rounded tracking-[0.2em] uppercase transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] border-b-4 border-amber-800 active:border-b-0 active:translate-y-1 select-none touch-manipulation"
        >
          <span>Enter The Sands</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
