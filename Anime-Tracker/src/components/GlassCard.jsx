import React from 'react';

export const GlassCard = ({ children, className = "" }) => (
  <div className={`bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl transition-all duration-300 ${className}`}>
    { children }
  </div>
);