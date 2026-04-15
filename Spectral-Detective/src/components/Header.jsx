import React from 'react';
import { Activity, Cpu } from 'lucide-react';

const Header = () => (
  <header className="border-b border-cyan-800 bg-black/50 p-4 shadow-[0_0_15px_rgba(6,182,212,0.15)] flex items-center justify-between">
    <div className="flex items-center gap-3 text-cyan-400">
      <Activity className="w-8 h-8 animate-pulse text-cyan-500" />
      <h1 className="text-2xl font-black tracking-widest uppercase">The Spectral Detective</h1>
    </div>
    <div className="flex items-center gap-2 text-xs font-mono text-cyan-700">
      <Cpu className="w-4 h-4" />
      <span>SYS.ONLINE // V-2.4.2</span>
    </div>
  </header>
);

export default Header;