import React from 'react';

export default function SliderControl({ label, value, min, max, step, unit, onChange, disabled }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-end">
        <label className="text-xs font-bold text-cyan-500">{label}</label>
        <span className="text-sm text-cyan-300 font-bold">{value}{unit}</span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step} 
        value={value} 
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={disabled}
        className="w-full disabled:opacity-50"
      />
    </div>
  );
}