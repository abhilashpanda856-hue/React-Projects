import React, { useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Play, Pause, RotateCcw, Activity } from 'lucide-react';
import { SimulationContext } from '../context/SimulationContext';

export default function ChartPanel() {
  const { state, dispatch } = useContext(SimulationContext);
  const { data, isRunning } = state;

  return (
    <div className="lg:col-span-8 bg-[#0a0a12] border border-cyan-900/30 rounded-xl p-4 shadow-[0_0_30px_rgba(0,243,255,0.03)] relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      
      <div className="flex justify-between items-center mb-4 relative z-10">
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
          <Activity className="w-4 h-4" /> Population Metrics
        </h2>
        
        <div className="flex gap-2">
          <button 
            onClick={() => dispatch({ type: 'TOGGLE_RUNNING' })}
            className={`flex items-center gap-2 px-4 py-2 rounded font-bold text-xs tracking-wider transition-all duration-300 ${
              isRunning 
                ? 'bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                : 'bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/50 hover:bg-[#39ff14]/20 hover:shadow-[0_0_15px_rgba(57,255,20,0.3)]'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'HALT' : 'EXECUTE'}
          </button>
          <button 
            onClick={() => dispatch({ type: 'RESET_SIMULATION' })}
            className="flex items-center gap-2 px-4 py-2 rounded bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700 hover:text-white transition-colors text-xs font-bold tracking-wider"
          >
            <RotateCcw className="w-4 h-4" /> RESET
          </button>
        </div>
      </div>

      <div className="h-[400px] md:h-[500px] w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis dataKey="time" stroke="#4b5563" tick={{ fill: '#6b7280', fontSize: 12, fontFamily: 'monospace' }} tickFormatter={(val) => val.toFixed(0)} minTickGap={30} />
            <YAxis stroke="#4b5563" tick={{ fill: '#6b7280', fontSize: 12, fontFamily: 'monospace' }} />
            <Tooltip contentStyle={{ backgroundColor: '#0a0a12', border: '1px solid #00f3ff', borderRadius: '8px', boxShadow: '0 0 15px rgba(0, 243, 255, 0.2)' }} itemStyle={{ fontFamily: 'monospace', fontWeight: 'bold' }} labelStyle={{ color: '#9ca3af', fontFamily: 'monospace', marginBottom: '4px' }} formatter={(value, name) => [value.toFixed(1), name.toUpperCase()]} labelFormatter={(label) => `TIME: ${label}`} />
            <Legend wrapperStyle={{ paddingTop: '20px', fontFamily: 'monospace' }} iconType="circle" />
            <Line type="monotone" dataKey="prey" name="Prey (X)" stroke="#00f3ff" strokeWidth={3} dot={false} isAnimationActive={false} style={{ filter: 'drop-shadow(0px 0px 4px rgba(0,243,255,0.8))' }} />
            <Line type="monotone" dataKey="predator" name="Predator (Y)" stroke="#ff00ff" strokeWidth={3} dot={false} isAnimationActive={false} style={{ filter: 'drop-shadow(0px 0px 4px rgba(255,0,255,0.8))' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}