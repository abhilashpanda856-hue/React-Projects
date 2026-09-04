import React from 'react';
import { Compass, RotateCcw } from 'lucide-react';
import StatPanel from './StatPanel';

const STEP_LABELS = {
  INTRO: 'ORIENTATION BRIEFING',
  GRINDING: 'TRIBAL SELECTION • SCENARIOS',
  OVERLAY: 'UPDATING NEURAL PROFILE',
  REVEAL: 'DESERT ARBITRATION',
  TRIAL: 'BOSS COMBAT • SHAI-HULUD',
  DEAD: 'SIMULATION TERMINATED',
  SUMMARY: 'TRIAL CONCLUDED',
};

export default function Header({ currentStep, stats, onReset }) {
  return (
    <header className="w-full max-w-5xl mx-auto mb-6 sm:mb-8 space-y-4">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-cinzel text-lg sm:text-xl font-bold tracking-widest text-amber-500 text-glow-amber">
              CHRONICLES OF ARRAKIS
            </h1>
            <p className="text-[11px] font-mono tracking-widest text-stone-400 uppercase">
              {STEP_LABELS[currentStep] || 'ORIENTATION PROTOCOL'}
            </p>
          </div>
        </div>

        {currentStep !== 'INTRO' && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-stone-400 hover:text-amber-400 bg-stone-900/60 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/30 rounded-md transition-all duration-200"
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>
        )}
      </div>

      {/* Global Stat HUD (visible whenever stats matter) */}
      {currentStep !== 'INTRO' && currentStep !== 'DEAD' && currentStep !== 'SUMMARY' && (
        <div className="animate-fade-in">
          <StatPanel stats={stats} />
        </div>
      )}
    </header>
  );
}
