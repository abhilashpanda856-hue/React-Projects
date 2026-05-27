import React, { useContext } from 'react';
import { Cpu, Settings, ShieldAlert } from 'lucide-react';
import { SimulationContext } from '../context/SimulationContext';
import CyberSlider from './CyberSlider';

export default function ControlPanel() {
  const { state, dispatch } = useContext(SimulationContext);
  const { params } = state;

  const handleParamChange = (name, value) => {
    dispatch({ type: 'SET_PARAM', payload: { name, value } });
  };

  return (
    <div className="lg:col-span-4 flex flex-col gap-6">
      <div className="bg-[#0a0a12] border border-gray-800 rounded-xl p-5 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00f3ff] to-[#ff00ff]"></div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
          <Cpu className="w-4 h-4" /> Algorithm Selection
        </h3>
        
        <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800">
          <button
            onClick={() => dispatch({ type: 'SET_MODEL_TYPE', payload: 'classic' })}
            className={`flex-1 py-2 text-xs font-bold tracking-wider rounded-md transition-all ${
              params.modelType === 'classic' ? 'bg-[#00f3ff]/10 text-[#00f3ff] shadow-[inset_0_0_10px_rgba(0,243,255,0.2)]' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            CLASSIC THEORETICAL
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_MODEL_TYPE', payload: 'logistic' })}
            className={`flex-1 py-2 text-xs font-bold tracking-wider rounded-md transition-all ${
              params.modelType === 'logistic' ? 'bg-[#39ff14]/10 text-[#39ff14] shadow-[inset_0_0_10px_rgba(57,255,20,0.2)]' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            LOGISTIC REALISTIC
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-3 font-mono leading-relaxed">
          {params.modelType === 'classic' 
            ? "> Assumes infinite food supply for prey. Leads to perpetual oscillating cycles."
            : "> Enforces carrying capacity limits. Simulates environmental restrictions leading to equilibrium."}
        </p>
      </div>

      <div className="bg-[#0a0a12] border border-gray-800 rounded-xl p-5 flex-grow">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
          <Settings className="w-4 h-4" /> Simulation Parameters
        </h3>

        <div className="space-y-6">
          <CyberSlider label="Prey Birth Rate (α)" name="alpha" value={params.alpha} min={0.01} max={0.5} step={0.01} color="text-cyan-400" onChange={handleParamChange} />
          <CyberSlider label="Predation Rate (β)" name="beta" value={params.beta} min={0.001} max={0.1} step={0.001} color="text-red-400" onChange={handleParamChange} />
          <CyberSlider label="Predator Growth Efficiency (δ)" name="delta" value={params.delta} min={0.001} max={0.05} step={0.001} color="text-fuchsia-400" onChange={handleParamChange} />
          <CyberSlider label="Predator Death Rate (γ)" name="gamma" value={params.gamma} min={0.01} max={0.5} step={0.01} color="text-yellow-400" onChange={handleParamChange} />
          
          <div className={`transition-all duration-500 overflow-hidden ${params.modelType === 'logistic' ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="pt-2 border-t border-gray-800/50 mt-2">
              <CyberSlider label="Carrying Capacity (K)" name="carryingCapacity" value={params.carryingCapacity} min={50} max={1000} step={10} color="text-[#39ff14]" onChange={handleParamChange} />
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-3 bg-red-900/10 border border-red-900/30 rounded text-xs text-red-400/80 font-mono flex gap-2">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <p>Warning: Extreme parameter adjustments may cause mathematical instability or rapid population collapse.</p>
        </div>
      </div>
    </div>
  );
}