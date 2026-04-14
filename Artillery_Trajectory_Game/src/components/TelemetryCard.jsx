import React from 'react';

export default function TelemetryCard({ title, value, unit }) {
  return (
    <div className="bg-slate-900/60 border border-cyan-900/30 p-3 rounded-lg flex flex-col">
      <span className="text-xs text-cyan-600 font-bold mb-1">{title}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-xl md:text-2xl font-black text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]">{value}</span>
        <span className="text-xs text-cyan-500">{unit}</span>
      </div>
    </div>
  );
}