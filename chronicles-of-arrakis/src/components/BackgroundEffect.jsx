import React from 'react';

function BackgroundEffect() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Deep Desert Ambient Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-[#18120c] to-[#0a0705]" />
      
      {/* Radial Spice Glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-amber-600/10 blur-[140px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-700/10 blur-[160px] rounded-full" />
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-amber-500/5 blur-[120px] rounded-full" />

      {/* Subtle Noise Texture from original game spec */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle Horizon Dunes Silhouette */}
      <div className="absolute bottom-0 inset-x-0 h-48 opacity-15 bg-gradient-to-t from-amber-950/40 via-stone-900/20 to-transparent pointer-events-none" />
    </div>
  );
}

export default React.memo(BackgroundEffect);
