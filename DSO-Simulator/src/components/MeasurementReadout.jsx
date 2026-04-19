import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

const MeasurementReadout = () => {
  const { state } = useContext(StoreContext);
  const { vpp, vrms, measuredFreq } = state.measurements;
  const { timebase, voltsPerDiv } = state.scope;

  const formatUnit = (val, unit) => {
    if (val >= 1000) return `${(val / 1000).toFixed(1)} k${unit}`;
    if (val < 0.001) return `${(val * 1000000).toFixed(1)} µ${unit}`;
    if (val < 1) return `${(val * 1000).toFixed(1)} m${unit}`;
    return `${val.toFixed(2)} ${unit}`;
  };

  return (
    <div className="absolute top-4 left-4 flex gap-4 text-xs font-mono select-none">
      <div className="bg-slate-900/80 border border-slate-700/50 p-2 rounded backdrop-blur-sm shadow-lg text-cyan-400">
        <span className="text-slate-400 mr-2">Vpp:</span>{vpp.toFixed(2)} V
      </div>
      <div className="bg-slate-900/80 border border-slate-700/50 p-2 rounded backdrop-blur-sm shadow-lg text-cyan-400">
        <span className="text-slate-400 mr-2">Vrms:</span>{vrms.toFixed(2)} V
      </div>
      <div className="bg-slate-900/80 border border-slate-700/50 p-2 rounded backdrop-blur-sm shadow-lg text-green-400">
        <span className="text-slate-400 mr-2">Freq:</span>{formatUnit(measuredFreq, 'Hz')}
      </div>
      <div className="bg-slate-900/80 border border-slate-700/50 p-2 rounded backdrop-blur-sm shadow-lg text-amber-400">
        <span className="text-slate-400 mr-2">CH1:</span>{formatUnit(voltsPerDiv, 'V')}/div
      </div>
      <div className="bg-slate-900/80 border border-slate-700/50 p-2 rounded backdrop-blur-sm shadow-lg text-amber-400">
        <span className="text-slate-400 mr-2">TB:</span>{formatUnit(timebase, 's')}/div
      </div>
    </div>
  );
};

export default MeasurementReadout;