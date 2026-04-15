import React, { useContext } from 'react';
import { FlaskConical } from 'lucide-react';
import { SpectralContext } from '../context/SpectralContext';
import Header from './Header';
import DataEntryPanel from './DataEntryPanel';
import ActiveDataDashboard from './ActiveDataDashboard';
import ResultsTerminal from './ResultsTerminal';
import TestProtocols from './TestProtocols';

const SpectralAppLayout = () => {
  const { dispatch } = useContext(SpectralContext);

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-cyan-900 selection:text-cyan-100">
      <Header />
      
      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 flex flex-col gap-6">
          <DataEntryPanel />
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => dispatch({ type: 'RUN_ANALYSIS' })}
              className="bg-cyan-600 hover:bg-cyan-500 text-black font-black uppercase tracking-widest py-4 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] transition-all flex justify-center items-center gap-2"
            >
              <FlaskConical className="w-5 h-5" /> Analyze
            </button>
            <button 
              onClick={() => dispatch({ type: 'RESET_DATA' })}
              className="bg-gray-800 hover:bg-red-950 hover:text-red-400 hover:border-red-900 border border-transparent text-gray-400 font-bold uppercase tracking-widest py-4 rounded-lg transition-all"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="lg:col-span-3">
          <ActiveDataDashboard />
        </div>

        <div className="lg:col-span-5 flex flex-col">
          <ResultsTerminal />
          <TestProtocols />
        </div>
      </main>
    </div>
  );
};

export default SpectralAppLayout;