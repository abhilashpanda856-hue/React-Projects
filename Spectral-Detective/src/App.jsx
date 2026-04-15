import React, { useReducer } from 'react';
import { SpectralContext, spectralReducer, initialState } from './context/SpectralContext';
import SpectralAppLayout from './components/SpectralAppLayout';

export default function App() {
  const [state, dispatch] = useReducer(spectralReducer, initialState);

  return (
    <SpectralContext.Provider value={{ state, dispatch }}>
      <SpectralAppLayout />
    </SpectralContext.Provider>
  );
}