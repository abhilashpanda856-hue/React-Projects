import React from 'react';
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

function Header({ currentStep, stats }) {
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

        {/* Reset button removed for multiplayer mode */}
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
