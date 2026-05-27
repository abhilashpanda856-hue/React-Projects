import React from 'react';

export default function CyberSlider({ label, name, value, min, max, step, color, onChange }) {
  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <label className={`text-xs font-bold uppercase tracking-widest ${color} drop-shadow-[0_0_5px_currentColor]`}>
          {label}
        </label>
        <span className="text-xs text-gray-300 font-mono bg-gray-900 px-2 py-1 rounded border border-gray-700">
          {value.toFixed(3)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(name, parseFloat(e.target.value))}
        className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer slider-thumb-cyberpunk"
        style={{ accentColor: color.includes('cyan') ? '#00f3ff' : color.includes('fuchsia') ? '#ff00ff' : '#39ff14' }}
      />
    </div>
  );
}