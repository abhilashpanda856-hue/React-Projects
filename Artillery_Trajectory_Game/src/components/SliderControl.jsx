import React from 'react';

export default function SliderControl({ label, value, min, max, step, unit, onChange, disabled }) {
  return (
    <div className={`flex flex-col gap-2 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex justify-between items-end">
        <label className="text-[10px] font-bold text-cyan-500/80 tracking-widest">{label}</label>
        <span className="text-sm text-cyan-300 font-bold">{value}{unit}</span>
      </div>
      <input 
        type="range" min={min} max={max} step={step} value={value} 
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={disabled}
        className="w-full"
      />
    </div>
  );
}