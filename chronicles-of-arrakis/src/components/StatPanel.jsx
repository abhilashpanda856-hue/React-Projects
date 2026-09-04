import React from 'react';
import { Sword, Shield, Zap, Users, Brain, AlertTriangle } from 'lucide-react';
import StatBar from './StatBar';

export default function StatPanel({ stats }) {
  return (
    <div className="w-full grid grid-cols-3 sm:grid-cols-6 gap-2 p-2 bg-stone-950/60 border border-stone-800/80 rounded-lg backdrop-blur-md">
      <StatBar
        label="ATK"
        value={stats.atk}
        icon={<Sword className="w-4 h-4 text-amber-400" />}
        colorClass="text-amber-300"
      />
      <StatBar
        label="DEF"
        value={stats.def}
        icon={<Shield className="w-4 h-4 text-emerald-400" />}
        colorClass="text-emerald-300"
      />
      <StatBar
        label="STM"
        value={stats.stamina}
        icon={<Zap className="w-4 h-4 text-yellow-400" />}
        colorClass="text-yellow-400"
      />
      <StatBar
        label="FRND"
        value={stats.friendship}
        icon={<Users className="w-4 h-4 text-sky-400" />}
        colorClass="text-sky-400"
      />
      <StatBar
        label="INT"
        value={stats.int}
        icon={<Brain className="w-4 h-4 text-purple-400" />}
        colorClass="text-purple-400"
      />
      <StatBar
        label="ARRG"
        value={stats.arrogance}
        icon={<AlertTriangle className="w-4 h-4 text-rose-500" />}
        colorClass="text-rose-400"
      />
    </div>
  );
}
