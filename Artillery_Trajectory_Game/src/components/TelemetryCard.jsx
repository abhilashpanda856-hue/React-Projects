import React from 'react';

export default function TelemetryCard({ title, value, unit, highlight = false }) {
  return (
    <div className={`bg-slate-900/60 border p-3 rounded-lg flex flex-col relative overflow-hidden ${highlight ? 'border-yellow-600/40' : 'border-cyan-900/30'}`}>
      {highlight && <div className="absolute top-0 right-0 w-8 h-8 bg-yellow-500/10 rounded-bl-full pointer-events-none" />}
      <span className={`text-[10px] font-bold mb-1 tracking-wider ${highlight ? 'text-yellow-600' : 'text-cyan-600'}`}>{title}</span>
      <div className="flex items-baseline gap-1 z-10">
        <span className={`text-xl md:text-2xl font-black drop-shadow-[0_0_5px_rgba(34,211,238,0.3)] ${highlight ? 'text-yellow-400' : 'text-cyan-300'}`}>
          {value}
        </span>
        <span className="text-xs text-cyan-500/70">{unit}</span>
      </div>
    </div>
  );
}