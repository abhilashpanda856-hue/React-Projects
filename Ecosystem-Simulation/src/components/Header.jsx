import React, { useContext } from 'react';
import { Activity } from 'lucide-react';
import { SimulationContext } from '../context/SimulationContext';

export default function Header() {
  const { state } = useContext(SimulationContext);
  const { data, currentTime } = state;
  const latestData = data[data.length - 1];

  return (
    <header className="mb-8 border-b border-cyan-900/50 pb-4 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-3">
        <Activity className="text-[#00f3ff] w-8 h-8 drop-shadow-[0_0_8px_rgba(0,243,255,0.8)]" />
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] to-[#39ff14]">
            LOTKA-VOLTERRA.SYS
          </h1>
          <p className="text-xs tracking-widest text-gray-500 uppercase">Ecosystem Dynamics Simulator v2.4</p>
        </div>
      </div>
      
      <div className="flex gap-6 bg-gray-900/50 p-3 rounded-lg border border-gray-800">
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">Sys.Time</span>
          <span className="font-mono text-[#39ff14] text-lg">{currentTime.toFixed(1)}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-cyan-500 uppercase tracking-wider">Prey (X)</span>
          <span className="font-mono text-cyan-400 text-lg">{Math.round(latestData.prey)}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-fuchsia-500 uppercase tracking-wider">Predator (Y)</span>
          <span className="font-mono text-fuchsia-400 text-lg">{Math.round(latestData.predator)}</span>
        </div>
      </div>
    </header>
  );
}
