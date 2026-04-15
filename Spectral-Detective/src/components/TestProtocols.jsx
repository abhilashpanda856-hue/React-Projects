import React, { useContext } from 'react';
import { Database } from 'lucide-react';
import { SpectralContext } from '../context/SpectralContext';

const TestProtocols = () => {
  const { dispatch } = useContext(SpectralContext);

  const loadProtocol = (protocolData) => {
    dispatch({ type: 'LOAD_TEST_PROTOCOL', payload: protocolData });
    dispatch({ type: 'RUN_ANALYSIS' });
  };

  const protocols = [
    { id: 'Alpha', name: 'Carboxylic Acid', compound: 'Acetic Acid', data: { irPeaks: [1715, 2980], nmrShifts: [2.10, 11.4], molecularWeight: 60 } },
    { id: 'Beta', name: 'Ketone Isolation', compound: 'Acetone', data: { irPeaks: [1715], nmrShifts: [2.1], molecularWeight: 58 } },
    { id: 'Gamma', name: 'Alcohol Isolation', compound: 'Ethanol', data: { irPeaks: [3300, 2950], nmrShifts: [1.2, 3.6, 4.0], molecularWeight: 46 } },
    { id: 'Delta', name: 'The Null State', compound: 'Hexane', data: { irPeaks: [2900, 1460], nmrShifts: [0.9, 1.3], molecularWeight: 86 } },
  ];

  return (
    <div className="mt-4 bg-gray-900/80 border border-gray-800 rounded-xl p-5 shadow-xl backdrop-blur-sm">
      <h2 className="flex items-center gap-2 text-cyan-500 font-semibold mb-4 border-b border-gray-800 pb-2">
        <Database className="w-5 h-5" /> CALIBRATION PROTOCOLS
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {protocols.map((p) => (
          <button 
            key={p.id} 
            onClick={() => loadProtocol(p.data)}
            className="text-left p-3 bg-gray-950 border border-gray-800 hover:border-cyan-600 hover:bg-cyan-950/40 rounded-lg transition-all group shadow-[0_0_10px_rgba(0,0,0,0.3)]"
          >
            <div className="text-cyan-400 text-sm font-bold group-hover:text-cyan-300 group-hover:drop-shadow-[0_0_5px_rgba(34,211,238,0.5)] flex justify-between items-center">
              <span>Protocol {p.id}</span>
            </div>
            <div className="text-gray-400 text-xs mt-1 font-mono tracking-tight">{p.name}</div>
            <div className="text-gray-600 text-[10px] mt-1 uppercase font-black">{p.compound}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TestProtocols;