import React from 'react';
import { AnimeProvider } from './context/AnimeContext';
import { TrackerApp } from './components/TrackerApp';

export default function App() {
  return (
    <AnimeProvider>
      <TrackerApp />
    </AnimeProvider>
  );
}