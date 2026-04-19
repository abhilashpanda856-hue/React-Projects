import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

const Section = ({ title, children, accentColor }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 shadow-lg mb-4">
    <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 pb-2 border-b border-slate-800 ${accentColor}`}>
      {title}
    </h3>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const Slider = ({ label, value, min, max, step, onChange, unit }) => (
  <div>
    <div className="flex justify-between text-xs text-slate-400 mb-1 font-mono">
      <span>{label}</span>
      <span className="text-slate-200">{value} {unit}</span>
    </div>
    <input 
      type="range" 
      min={min} max={max} step={step} 
      value={value} 
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
    />
  </div>
);

const ControlPanel = () => {
  const { state, dispatch } = useContext(StoreContext);

  return (
    <div className="w-80 flex-shrink-0 overflow-y-auto pr-2 custom-scrollbar">
      
      <Section title="Signal Generator" accentColor="text-green-400">
        <div className="flex gap-2 mb-4">
          {['sine', 'square', 'triangle'].map(type => (
            <button
              key={type}
              onClick={() => dispatch({ type: 'signal/setWaveform', payload: type })}
              className={`flex-1 py-1.5 text-xs font-semibold rounded capitalize transition-all ${
                state.signal.waveformType === type 
                ? 'bg-green-500/20 text-green-400 border border-green-500/50 shadow-[0_0_10px_rgba(74,222,128,0.2)]' 
                : 'bg-slate-800 text-slate-400 border border-transparent hover:bg-slate-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <Slider 
          label="Frequency" value={state.signal.frequency} min={10} max={5000} step={10} unit="Hz"
          onChange={(v) => dispatch({ type: 'signal/setFrequency', payload: v })}
        />
        <Slider 
          label="Amplitude" value={state.signal.amplitude} min={0.1} max={10} step={0.1} unit="Vpk"
          onChange={(v) => dispatch({ type: 'signal/setAmplitude', payload: v })}
        />
      </Section>

      <Section title="Vertical (CH1)" accentColor="text-cyan-400">
        <Slider 
          label="Volts/Div" value={state.scope.voltsPerDiv} min={0.1} max={5} step={0.1} unit="V"
          onChange={(v) => dispatch({ type: 'scope/setVoltsPerDiv', payload: v })}
        />
      </Section>

      <Section title="Horizontal (Timebase)" accentColor="text-cyan-400">
        <Slider 
          label="Time/Div" value={state.scope.timebase} min={0.0001} max={0.01} step={0.0001} unit="s"
          onChange={(v) => dispatch({ type: 'scope/setTimebase', payload: v })}
        />
      </Section>

      <Section title="Trigger" accentColor="text-amber-400">
        <div className="flex gap-2 mb-4">
          {['RISING', 'FALLING'].map(edge => (
            <button
              key={edge}
              onClick={() => dispatch({ type: 'trigger/setEdge', payload: edge })}
              className={`flex-1 py-1.5 text-xs font-semibold rounded capitalize transition-all ${
                state.trigger.edge === edge 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                : 'bg-slate-800 text-slate-400 border border-transparent hover:bg-slate-700'
              }`}
            >
              {edge.toLowerCase()}
            </button>
          ))}
        </div>
        <Slider 
          label="Level" value={state.trigger.level} min={-10} max={10} step={0.1} unit="V"
          onChange={(v) => dispatch({ type: 'trigger/setLevel', payload: v })}
        />
      </Section>

      <button
        onClick={() => dispatch({ type: 'system/reset' })}
        className="w-full mt-2 py-2 text-xs font-bold tracking-widest uppercase rounded border border-red-500/50 text-red-400 bg-red-900/20 hover:bg-red-500/20 transition-all active:scale-95 shadow-[0_0_10px_rgba(239,68,68,0.1)] hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
      >
        Reset Defaults
      </button>

    </div>
  );
};

export default ControlPanel;