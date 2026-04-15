import React, { useContext } from 'react';
import { ScanLine, Trash2 } from 'lucide-react';
import { SpectralContext } from '../context/SpectralContext';

const ActiveDataDashboard = () => {
  const { state, dispatch } = useContext(SpectralContext);
  const { irPeaks, nmrShifts, molecularWeight } = state.inputs;

  const Chip = ({ value, label, onRemove }) => (
    <div className="inline-flex items-center bg-gray-950 border border-cyan-800 text-cyan-400 rounded-full pl-3 pr-1 py-1 m-1 text-sm font-mono shadow-[0_0_5px_rgba(6,182,212,0.2)]">
      <span>{value} <span className="text-gray-600 text-xs">{label}</span></span>
      <button 
        onClick={onRemove}
        className="ml-2 p-1 hover:bg-red-900/50 hover:text-red-400 rounded-full transition-colors"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );

  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-5 shadow-xl backdrop-blur-sm h-full">
      <h2 className="flex items-center gap-2 text-cyan-500 font-semibold mb-4 border-b border-gray-800 pb-2">
        <ScanLine className="w-5 h-5" /> ACTIVE SPECTRA BUFFER
      </h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-xs text-gray-500 mb-2 font-mono">IR PEAKS</h3>
          <div className="flex flex-wrap min-h-[40px] p-2 bg-black/50 rounded border border-gray-800/50">
            {irPeaks.length === 0 && <span className="text-gray-700 text-sm italic">No IR data...</span>}
            {irPeaks.map((peak, idx) => (
              <Chip key={`ir-${idx}`} value={peak} label="cm⁻¹" onRemove={() => dispatch({ type: 'REMOVE_IR_PEAK', payload: idx })} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs text-gray-500 mb-2 font-mono">NMR SHIFTS</h3>
          <div className="flex flex-wrap min-h-[40px] p-2 bg-black/50 rounded border border-gray-800/50">
            {nmrShifts.length === 0 && <span className="text-gray-700 text-sm italic">No NMR data...</span>}
            {nmrShifts.map((shift, idx) => (
              <Chip key={`nmr-${idx}`} value={shift} label="ppm" onRemove={() => dispatch({ type: 'REMOVE_NMR_SHIFT', payload: idx })} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs text-gray-500 mb-2 font-mono">MASS SPEC</h3>
          <div className="flex flex-wrap p-2 bg-black/50 rounded border border-gray-800/50">
            {molecularWeight ? (
              <div className="inline-flex items-center bg-gray-950 border border-purple-800 text-purple-400 rounded-full px-3 py-1 text-sm font-mono shadow-[0_0_5px_rgba(168,85,247,0.2)]">
                m/z: {molecularWeight}
              </div>
            ) : (
              <span className="text-gray-700 text-sm italic">No MS data...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveDataDashboard;