import React from 'react';
import { RotateCcw } from 'lucide-react';
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

function Header({ currentStep, stats, onReset }) {
  return (
    <header className="w-full max-w-5xl mx-auto mb-6 sm:mb-8 space-y-4 select-none">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800/80 pb-4">
        <div className="flex items-center gap-3">
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
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-stone-400 hover:text-amber-400 bg-stone-900/60 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/30 rounded-md transition-all duration-200 select-none touch-manipulation active:scale-95"
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

export default React.memo(Header);
