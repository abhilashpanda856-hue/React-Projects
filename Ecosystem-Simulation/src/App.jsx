import React, { useEffect, createContext, useContext, useReducer } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Play, Pause, RotateCcw, Activity, ShieldAlert, Cpu, Settings } from 'lucide-react';

// ==========================================
// 1. STATE & SIMULATION LOGIC (React Context)
// ==========================================

const INITIAL_PREY = 40;
const INITIAL_PREDATOR = 9;

const initialState = {
  params: {
    alpha: 0.1,    // Prey birth rate
    beta: 0.02,    // Predation rate
    delta: 0.01,   // Predator reproduction rate (efficiency)
    gamma: 0.1,    // Predator death rate
    carryingCapacity: 200,
    modelType: 'classic', // 'classic' | 'logistic'
    timeStep: 0.1
  },
  data: [{ time: 0, prey: INITIAL_PREY, predator: INITIAL_PREDATOR }],
  isRunning: false,
  currentTime: 0
};

function simulationReducer(state, action) {
  switch (action.type) {
    case 'SET_PARAM':
      return {
        ...state,
        params: { ...state.params, [action.payload.name]: action.payload.value }
      };
    case 'SET_MODEL_TYPE':
      return {
        ...state,
        params: { ...state.params, modelType: action.payload }
      };
    case 'TOGGLE_RUNNING':
      return { ...state, isRunning: !state.isRunning };
    case 'RESET_SIMULATION':
      return {
        ...state,
        data: [{ time: 0, prey: INITIAL_PREY, predator: INITIAL_PREDATOR }],
        currentTime: 0,
        isRunning: false
      };
    case 'STEP_SIMULATION': {
      const lastPoint = state.data[state.data.length - 1];
      let x = lastPoint.prey;
      let y = lastPoint.predator;
      const { alpha, beta, delta, gamma, carryingCapacity, modelType, timeStep } = state.params;

      let dx, dy;
      if (modelType === 'classic') {
        dx = (alpha * x) - (beta * x * y);
      } else {
        dx = (alpha * x * (1 - x / carryingCapacity)) - (beta * x * y);
      }
      dy = (delta * x * y) - (gamma * y);

      let nextX = Math.max(0, x + dx * timeStep);
      let nextY = Math.max(0, y + dy * timeStep);
      let nextTime = state.currentTime + timeStep;

      let newData = [...state.data, {
        time: Number(nextTime.toFixed(2)),
        prey: nextX,
        predator: nextY
      }];

      if (newData.length > 300) {
        newData.shift();
      }

      let isRunning = state.isRunning;
      if (nextX === 0 && nextY === 0) {
          isRunning = false;
      }

      return {
        ...state,
        currentTime: nextTime,
        data: newData,
        isRunning
      };
    }
    default:
      return state;
  }
}

const SimulationContext = createContext();

// ==========================================
// 2. UI COMPONENTS
// ==========================================

// Cyberpunk Slider Component
const CyberSlider = ({ label, name, value, min, max, step, color, onChange }) => {
  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <label className={`text-xs font-bold uppercase tracking-widest ${color} drop-shadow-[0_0_5px_currentColor]`}>
          {label}
        </label>
        <span className="text-xs text-gray-300 font-mono bg-gray-900 px-2 py-1 rounded border border-gray-700">
          {value.toFixed(3)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(name, parseFloat(e.target.value))}
        className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer slider-thumb-cyberpunk"
        style={{ accentColor: color.includes('cyan') ? '#00f3ff' : color.includes('fuchsia') ? '#ff00ff' : '#39ff14' }}
      />
    </div>
  );
};

// Main Simulator View
const SimulatorCore = () => {
  const { state, dispatch } = useContext(SimulationContext);
  const { params, data, isRunning, currentTime } = state;

  // The Game Loop
  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        dispatch({ type: 'STEP_SIMULATION' });
      }, 50); // 50ms interval = 20 ticks per second
    }
    return () => clearInterval(intervalId);
  }, [isRunning, dispatch]);

  const handleParamChange = (name, value) => {
    dispatch({ type: 'SET_PARAM', payload: { name, value } });
  };

  const latestData = data[data.length - 1];

  return (
    <div className="min-h-screen bg-[#05050a] text-gray-200 font-sans p-4 md:p-8 selection:bg-cyan-500/30">
      
      {/* Header */}
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
        
        {/* Global Stats */}
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Chart */}
        <div className="lg:col-span-8 bg-[#0a0a12] border border-cyan-900/30 rounded-xl p-4 shadow-[0_0_30px_rgba(0,243,255,0.03)] relative overflow-hidden">
          
          {/* Cyberpunk grid background effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
          
          <div className="flex justify-between items-center mb-4 relative z-10">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Population Metrics
            </h2>
            
            {/* Playback Controls */}
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
                <RotateCcw className="w-4 h-4" />
                RESET
              </button>
            </div>
          </div>

          <div className="h-[400px] md:h-[500px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#4b5563" 
                  tick={{ fill: '#6b7280', fontSize: 12, fontFamily: 'monospace' }}
                  tickFormatter={(val) => val.toFixed(0)}
                  minTickGap={30}
                />
                <YAxis 
                  stroke="#4b5563" 
                  tick={{ fill: '#6b7280', fontSize: 12, fontFamily: 'monospace' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0a0a12', 
                    border: '1px solid #00f3ff', 
                    borderRadius: '8px',
                    boxShadow: '0 0 15px rgba(0, 243, 255, 0.2)'
                  }}
                  itemStyle={{ fontFamily: 'monospace', fontWeight: 'bold' }}
                  labelStyle={{ color: '#9ca3af', fontFamily: 'monospace', marginBottom: '4px' }}
                  formatter={(value, name) => [value.toFixed(1), name.toUpperCase()]}
                  labelFormatter={(label) => `TIME: ${label}`}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px', fontFamily: 'monospace' }}
                  iconType="circle"
                />
                <Line 
                  type="monotone" 
                  dataKey="prey" 
                  name="Prey (X)" 
                  stroke="#00f3ff" 
                  strokeWidth={3} 
                  dot={false}
                  isAnimationActive={false}
                  style={{ filter: 'drop-shadow(0px 0px 4px rgba(0,243,255,0.8))' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="predator" 
                  name="Predator (Y)" 
                  stroke="#ff00ff" 
                  strokeWidth={3} 
                  dot={false}
                  isAnimationActive={false}
                  style={{ filter: 'drop-shadow(0px 0px 4px rgba(255,0,255,0.8))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Controls */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Model Selection Panel */}
          <div className="bg-[#0a0a12] border border-gray-800 rounded-xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00f3ff] to-[#ff00ff]"></div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4" /> Algorithm Selection
            </h3>
            
            <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800">
              <button
                onClick={() => dispatch({ type: 'SET_MODEL_TYPE', payload: 'classic' })}
                className={`flex-1 py-2 text-xs font-bold tracking-wider rounded-md transition-all ${
                  params.modelType === 'classic' 
                    ? 'bg-[#00f3ff]/10 text-[#00f3ff] shadow-[inset_0_0_10px_rgba(0,243,255,0.2)]' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                CLASSIC THEORETICAL
              </button>
              <button
                onClick={() => dispatch({ type: 'SET_MODEL_TYPE', payload: 'logistic' })}
                className={`flex-1 py-2 text-xs font-bold tracking-wider rounded-md transition-all ${
                  params.modelType === 'logistic' 
                    ? 'bg-[#39ff14]/10 text-[#39ff14] shadow-[inset_0_0_10px_rgba(57,255,20,0.2)]' 
                    : 'text-gray-500 hover:text-gray-300'
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

          {/* Parameters Panel */}
          <div className="bg-[#0a0a12] border border-gray-800 rounded-xl p-5 flex-grow">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
              <Settings className="w-4 h-4" /> Simulation Parameters
            </h3>

            <div className="space-y-6">
              <CyberSlider 
                label="Prey Birth Rate (α)" name="alpha" 
                value={params.alpha} min={0.01} max={0.5} step={0.01} 
                color="text-cyan-400" onChange={handleParamChange} 
              />
              <CyberSlider 
                label="Predation Rate (β)" name="beta" 
                value={params.beta} min={0.001} max={0.1} step={0.001} 
                color="text-red-400" onChange={handleParamChange} 
              />
              <CyberSlider 
                label="Predator Growth Efficiency (δ)" name="delta" 
                value={params.delta} min={0.001} max={0.05} step={0.001} 
                color="text-fuchsia-400" onChange={handleParamChange} 
              />
              <CyberSlider 
                label="Predator Death Rate (γ)" name="gamma" 
                value={params.gamma} min={0.01} max={0.5} step={0.01} 
                color="text-yellow-400" onChange={handleParamChange} 
              />
              
              <div className={`transition-all duration-500 overflow-hidden ${params.modelType === 'logistic' ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="pt-2 border-t border-gray-800/50 mt-2">
                  <CyberSlider 
                    label="Carrying Capacity (K)" name="carryingCapacity" 
                    value={params.carryingCapacity} min={50} max={1000} step={10} 
                    color="text-[#39ff14]" onChange={handleParamChange} 
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-3 bg-red-900/10 border border-red-900/30 rounded text-xs text-red-400/80 font-mono flex gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <p>Warning: Extreme parameter adjustments may cause mathematical instability or rapid population collapse.</p>
            </div>
          </div>

        </div>
      </div>
      
      {/* Footer CSS Injection for Custom Range Slider Thumb */}
      <style dangerouslySetInnerHTML={{__html: `
        input[type=range].slider-thumb-cyberpunk::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          background: currentColor;
          border: 2px solid #000;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px currentColor;
        }
      `}} />
    </div>
  );
};

// ==========================================
// 3. MAIN EXPORT (APP WRAPPER)
// ==========================================

export default function App() {
  const [state, dispatch] = useReducer(simulationReducer, initialState);

  return (
    <SimulationContext.Provider value={{ state, dispatch }}>
      <SimulatorCore />
    </SimulationContext.Provider>
  );
}