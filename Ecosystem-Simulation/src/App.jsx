import React, { useEffect, useContext } from 'react';
import { SimulationProvider, SimulationContext } from './context/SimulationContext';
import Header from './components/Header';
import ChartPanel from './components/ChartPanel';
import ControlPanel from './components/ControlPanel';

// This inner component exists so we can access Context for the setInterval loop
function SimulatorLayout() {
  const { state, dispatch } = useContext(SimulationContext);

  useEffect(() => {
    let intervalId;
    if (state.isRunning) {
      intervalId = setInterval(() => {
        dispatch({ type: 'STEP_SIMULATION' });
      }, 50); // 50ms interval = 20 ticks per second
    }
    return () => clearInterval(intervalId);
  }, [state.isRunning, dispatch]);

  return (
    <div className="min-h-screen bg-[#05050a] text-gray-200 font-sans p-4 md:p-8 selection:bg-cyan-500/30">
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <ChartPanel />
        <ControlPanel />
      </div>

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
}

export default function App() {
  return (
    <SimulationProvider>
      <SimulatorLayout />
    </SimulationProvider>
  );
}