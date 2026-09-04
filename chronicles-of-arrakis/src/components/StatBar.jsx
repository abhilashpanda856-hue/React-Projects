import React from 'react';

export default function StatBar({ label, value, icon, colorClass = "text-white" }) {
  return (
    <div className="flex items-center gap-2 bg-stone-900/80 border border-stone-800/80 hover:border-stone-700 px-3 py-1.5 rounded-md backdrop-blur-sm transition-all shadow-sm">
      <span className="shrink-0 flex items-center justify-center text-stone-400">
        {icon}
      </span>
      <span className="text-xs font-semibold tracking-wider text-stone-400 uppercase">
        {label}
      </span>
      <span className={`font-mono font-bold text-sm ml-auto ${colorClass}`}>
        {value}
      </span>
    </div>
  );
}
