import React, { createContext, useReducer } from 'react';

const initialState = {
  signal: {
    waveformType: 'sine',
    frequency: 1000,
    amplitude: 2,
  },
  scope: {
    timebase: 0.001,
    voltsPerDiv: 1,
  },
  trigger: {
    level: 0,
    edge: 'RISING',
  },
  measurements: {
    vpp: 4,
    vrms: 1.414,
    measuredFreq: 1000,
  }
};

function oscilloscopeReducer(state, action) {
  if (action.type === 'system/reset') {
    return initialState;
  }

  let newState = { ...state };
  
  switch (action.type) {
    case 'signal/setWaveform':
      newState.signal.waveformType = action.payload;
      break;
    case 'signal/setFrequency':
      newState.signal.frequency = action.payload;
      break;
    case 'signal/setAmplitude':
      newState.signal.amplitude = action.payload;
      break;
    case 'scope/setTimebase':
      newState.scope.timebase = action.payload;
      break;
    case 'scope/setVoltsPerDiv':
      newState.scope.voltsPerDiv = action.payload;
      break;
    case 'trigger/setLevel':
      newState.trigger.level = action.payload;
      break;
    case 'trigger/setEdge':
      newState.trigger.edge = action.payload;
      break;
    default:
      return state;
  }

  if (action.type.startsWith('signal/')) {
    const { amplitude, frequency, waveformType } = newState.signal;
    newState.measurements.vpp = amplitude * 2;
    newState.measurements.measuredFreq = frequency;
    
    if (waveformType === 'sine') {
      newState.measurements.vrms = amplitude / Math.sqrt(2);
    } else if (waveformType === 'square') {
      newState.measurements.vrms = amplitude;
    } else if (waveformType === 'triangle') {
      newState.measurements.vrms = amplitude / Math.sqrt(3);
    }
  }

  return newState;
}

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(oscilloscopeReducer, initialState);
  
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};