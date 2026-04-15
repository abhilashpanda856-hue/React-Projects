import React, { useState, useContext } from 'react';
import { Database } from 'lucide-react';
import { SpectralContext } from '../context/SpectralContext';

const DataEntryPanel = () => {
  const { state, dispatch } = useContext(SpectralContext);
  const mw = state.inputs.molecularWeight;
  
  const [irInput, setIrInput] = useState('');
  const [nmrInput, setNmrInput] = useState('');

  const handleAddIr = (e) => {
    e.preventDefault();
    if (irInput && !isNaN(irInput)) {
      dispatch({ type: 'ADD_IR_PEAK', payload: irInput });
      setIrInput('');
    }
  };

  const handleAddNmr = (e) => {
    e.preventDefault();
    if (nmrInput && !isNaN(nmrInput)) {
      dispatch({ type: 'ADD_NMR_SHIFT', payload: nmrInput });
      setNmrInput('');
    }
  };

  const inputStyle = "bg-gray-950 border border-cyan-900 text-cyan-300 px-3 py-2 rounded-md font-mono focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.3)] transition-all flex-1";
  const btnStyle = "bg-cyan-950 border border-cyan-700 text-cyan-400 px-4 py-2 rounded-md font-bold uppercase tracking-wider hover:bg-cyan-900 hover:text-cyan-200 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all flex items-center gap-2";

  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-5 shadow-xl backdrop-blur-sm">
      <h2 className="flex items-center gap-2 text-cyan-500 font-semibold mb-4 border-b border-gray-800 pb-2">
        <Database className="w-5 h-5" /> DATA INGESTION PROTOCOL
      </h2>
      
      <div className="space-y-6">
        <form onSubmit={handleAddIr} className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1 font-mono">IR Wavenumber (cm⁻¹)</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                value={irInput}
                onChange={(e) => setIrInput(e.target.value)}
                placeholder="e.g. 1715" 
                className={inputStyle}
              />
              <button type="submit" className={btnStyle}>Add</button>
            </div>
          </div>
        </form>

        <form onSubmit={handleAddNmr} className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1 font-mono">NMR Shift (ppm)</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                step="0.01"
                value={nmrInput}
                onChange={(e) => setNmrInput(e.target.value)}
                placeholder="e.g. 11.4" 
                className={inputStyle}
              />
              <button type="submit" className={btnStyle}>Add</button>
            </div>
          </div>
        </form>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1 font-mono">Mass Spec (m/z)</label>
            <input 
              type="number" 
              value={mw}
              onChange={(e) => dispatch({ type: 'SET_MW', payload: e.target.value })}
              placeholder="e.g. 60" 
              className={`${inputStyle} w-full`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataEntryPanel;