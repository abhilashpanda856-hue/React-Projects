import React from 'react';

export default function GrindingScreen({ scenario, currentIndex, totalScenarios, onChoiceSelect }) {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Progress Bar & Counter */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-mono text-stone-400">
          <span className="text-amber-500 font-bold tracking-widest uppercase">
            Scenario 0{currentIndex + 1}
          </span>
          <span>{currentIndex + 1} of {totalScenarios} Decisions</span>
        </div>
        <div className="h-1.5 w-full bg-stone-900 rounded-full overflow-hidden border border-stone-800">
          <div
            className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / totalScenarios) * 100}%` }}
          />
        </div>
      </div>

      {/* Scenario Card */}
      <div className="bg-stone-900/80 border border-stone-800 hover:border-amber-900/60 p-6 sm:p-8 rounded-xl shadow-2xl backdrop-blur-sm space-y-4 transition-colors">
        <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">
          {scenario.title}
        </h2>
        <p className="text-stone-300 italic text-base sm:text-lg border-l-2 border-amber-600 pl-4 py-1 leading-relaxed bg-stone-950/30 rounded-r">
          "{scenario.description}"
        </p>

        {/* Choices */}
        <div className="pt-4 space-y-3">
          <div className="text-xs uppercase font-mono tracking-wider text-stone-400 mb-2">
            Select Your Action:
          </div>
          {scenario.choices.map((choice, idx) => (
            <button
              key={idx}
              onClick={() => onChoiceSelect(choice.stats)}
              className="w-full text-left p-4 sm:p-5 bg-stone-950/70 hover:bg-stone-800/90 border border-stone-800 hover:border-amber-500/60 rounded-lg text-stone-200 hover:text-white transition-all duration-200 group flex items-start gap-4 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] active:scale-[0.99]"
            >
              <span className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-md bg-stone-900 border border-stone-700 text-amber-500 font-bold group-hover:bg-amber-500 group-hover:text-stone-950 transition-colors">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="text-sm sm:text-base leading-relaxed pt-1">
                {choice.text}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
