import React from 'react';
import { StoreProvider } from './context/StoreContext';
import ScopeScreen from './components/ScopeScreen';
import ControlPanel from './components/ControlPanel';

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-[#0a0a0a] text-slate-200 p-6 font-sans flex flex-col items-center justify-center">
        
        <div className="w-full max-w-6xl">
          <header className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white drop-shadow-md">DSO Simulator</h1>
                <p className="text-xs text-cyan-500/80 font-mono tracking-widest">CYBER-SCOPE OS v1.0</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse"></div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">System Online</span>
            </div>
          </header>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <ScopeScreen />
              <div className="mt-4 text-xs text-slate-500 font-mono max-w-2xl leading-relaxed">
                <strong>Hint:</strong> Adjust the Timebase to stretch the wave horizontally. Adjust Volts/Div to scale vertically. 
                If the Trigger Level exceeds the wave's Peak Amplitude, the sync lock will break and the wave will begin to drift.
              </div>
            </div>
            <ControlPanel />
          </div>
        </div>

      </div>
    </StoreProvider>
  );
}