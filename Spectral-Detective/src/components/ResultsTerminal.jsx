import React, { useContext } from 'react';
import { Terminal, CheckCircle2, AlertCircle } from 'lucide-react';
import { SpectralContext } from '../context/SpectralContext';

const ResultsTerminal = () => {
  const { state } = useContext(SpectralContext);
  const { flags, result } = state;

  const FlagIndicator = ({ label, active }) => (
    <div className="flex flex-wrap items-center justify-between bg-black/60 px-3 py-2 rounded border border-gray-800 font-mono text-xs sm:text-sm gap-2">
      <span className="text-gray-400">{label}</span>
      <div className="flex-shrink-0 ml-auto">
        {active ? (
          <span className="flex items-center gap-1 text-green-400 shadow-green-400/50 drop-shadow-[0_0_5px_rgba(74,222,128,0.8)] whitespace-nowrap">
            <CheckCircle2 className="w-4 h-4" /> DETECTED
          </span>
        ) : (
          <span className="flex items-center gap-1 text-gray-700 whitespace-nowrap">
            <AlertCircle className="w-4 h-4" /> UNDETECTED
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.8)] flex flex-col">
      <div className="bg-gray-800 px-4 py-2 flex items-center gap-2 border-b border-gray-700">
        <Terminal className="w-4 h-4 text-gray-400" />
        <span className="text-xs text-gray-400 font-mono tracking-widest">ANALYSIS_TERMINAL</span>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 mb-6">
          <FlagIndicator label="Carbonyl Group (1670-1750)" active={flags.hasCarbonyl} />
          <FlagIndicator label="Hydroxyl Group (2500-3600)" active={flags.hasHydroxyl} />
          <FlagIndicator label="Acidic Proton (11.0-12.0)" active={flags.hasAcidicProton} />
          <FlagIndicator label="Carboxylic System" active={flags.hasCarboxylicAcid} />
        </div>

        <div className="flex-1 bg-black rounded border border-cyan-900/50 p-4 font-mono text-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/20 blur-sm"></div>
          <div className="text-cyan-500 mb-2">root@spectral-detective:~$ ./analyze_compound.sh</div>
          
          <pre className={`whitespace-pre-wrap font-mono ${result.includes('MATCH FOUND') ? 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.4)]' : 'text-cyan-300'}`}>
            {result}
          </pre>
          <div className="w-2 h-4 bg-cyan-400 animate-pulse mt-2 inline-block"></div>
        </div>
      </div>
    </div>
  );
};

export default ResultsTerminal;