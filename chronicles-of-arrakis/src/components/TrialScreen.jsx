import React, { useState } from 'react';
import { Heart, Shield, Target, Swords } from 'lucide-react';

const PlayerHpBar = React.memo(function PlayerHpBar({ playerHp, maxHp }) {
  const hpPercent = maxHp > 0 ? (playerHp / maxHp) * 100 : 0;

  return (
    <div className="sm:col-span-6 space-y-2 select-none">
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
          <Heart className="w-4 h-4 text-rose-500" />
          Player HP
        </span>
        <span className="text-stone-400 font-bold">
          {playerHp} <span className="text-stone-600">/</span> {maxHp}
        </span>
      </div>
      <div className="h-4 bg-stone-950 rounded-full overflow-hidden border border-stone-800 p-0.5 shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-500 will-change-transform ${
            hpPercent > 50
              ? 'bg-gradient-to-r from-emerald-600 to-emerald-400'
              : hpPercent > 25
              ? 'bg-gradient-to-r from-amber-600 to-amber-400'
              : 'bg-gradient-to-r from-rose-700 to-rose-500 animate-pulse'
          }`}
          style={{ width: `${Math.max(0, Math.min(100, hpPercent))}%` }}
        />
      </div>
    </div>
  );
});

function TrialScreen({
  question,
  questionIndex,
  totalQuestions,
  playerHp,
  maxHp,
  bossDamageDealt,
  combatMessage,
  selectedRole,
  comrades,
  tankUsed,
  supportUsed,
  onAnswer,
  isProcessing,
}) {
  const [isLocked, setIsLocked] = useState(false);

  const handleOptionClick = (idx) => {
    if (isProcessing || isLocked) return;
    setIsLocked(true);
    onAnswer(idx);
    setTimeout(() => {
      setIsLocked(false);
    }, 1500);
  };

  const isFremen = selectedRole === 'FREMEN';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in select-none">
      {/* Top Combat HUD */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-stone-900/90 p-5 rounded-2xl border border-stone-800 backdrop-blur-md shadow-xl">
        {/* Memoized HP Bar */}
        <PlayerHpBar playerHp={playerHp} maxHp={maxHp} />

        {/* Role & Comrades status */}
        <div className="sm:col-span-3 text-center sm:border-x border-stone-800 sm:px-2 py-1">
          <div className="text-[10px] uppercase font-mono tracking-widest text-stone-500 mb-1">
            Active Archetype
          </div>
          <div
            className={`font-mono text-xs font-bold px-2 py-1 rounded inline-block uppercase ${
              isFremen
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                : selectedRole === 'HARKONNEN'
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
            }`}
          >
            {selectedRole}
          </div>

          {isFremen && comrades.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-2">
              {comrades.map((c, i) => {
                const isUsed =
                  (c.type === 'Desert Scout' && tankUsed) ||
                  (c.type === 'Sayyadina (Healer)' && supportUsed);
                return (
                  <div
                    key={i}
                    title={`${c.type}: ${c.desc} ${isUsed ? '(Used)' : '(Ready)'}`}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${
                      isUsed
                        ? 'bg-stone-900 border-stone-800 text-stone-600 opacity-40'
                        : 'bg-stone-800 border-stone-700 text-amber-400'
                    }`}
                  >
                    {c.type === 'Desert Scout' && <Shield className="w-3.5 h-3.5" />}
                    {c.type === 'Sayyadina (Healer)' && <Heart className="w-3.5 h-3.5" />}
                    {c.type === 'Fedaykin (Commando)' && <Target className="w-3.5 h-3.5" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Boss Damage Counter */}
        <div className="sm:col-span-3 text-right">
          <div className="text-[11px] text-stone-400 uppercase tracking-widest font-mono mb-0.5">
            Total Damage Dealt
          </div>
          <div className="text-3xl font-black font-cinzel text-amber-500 text-glow-amber">
            {bossDamageDealt}
          </div>
        </div>
      </div>

      {/* Main Trial Arena: Combat Message or Question */}
      {combatMessage ? (
        <div
          className={`text-center p-10 sm:p-14 rounded-2xl border backdrop-blur-md will-change-transform transform transition-all duration-300 ${
            combatMessage.includes('Desert Scout')
              ? 'bg-sky-950/40 border-sky-500 shadow-[0_0_40px_rgba(56,189,248,0.3)] animate-pulse'
              : combatMessage.includes('WRONG') || combatMessage.includes('Time Up') || combatMessage.includes('Maker strikes')
              ? 'bg-red-950/60 border-red-600 shadow-[0_0_40px_rgba(220,38,38,0.4)] animate-shake'
              : combatMessage.includes('CRITICAL') || combatMessage.includes('Fedaykin')
              ? 'bg-amber-950/40 border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.3)] animate-pulse'
              : combatMessage.includes('Sayyadina')
              ? 'bg-emerald-950/40 border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.3)] animate-pulse'
              : 'bg-stone-900/90 border-amber-500/50 shadow-2xl'
          }`}
        >
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-stone-950/80 mb-4">
            <Swords
              className={`w-8 h-8 ${
                combatMessage.includes('Desert Scout')
                  ? 'text-sky-400'
                  : combatMessage.includes('Sayyadina')
                  ? 'text-emerald-400'
                  : combatMessage.includes('WRONG') || combatMessage.includes('Time Up') || combatMessage.includes('Maker strikes')
                  ? 'text-red-500'
                  : 'text-amber-400'
              }`}
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-white leading-relaxed max-w-2xl mx-auto">
            {combatMessage}
          </h2>
        </div>
      ) : (
        <div className="bg-stone-900/80 p-6 sm:p-8 rounded-2xl border border-stone-800 shadow-2xl backdrop-blur-md space-y-6">
          {/* Header with question counter & flavor */}
          <div className="space-y-2 border-b border-stone-800/80 pb-4">
            <div className="flex justify-between items-center text-xs font-mono text-stone-400">
              <span className="text-amber-500 font-bold uppercase tracking-wider">
                Phase II • Sandworm Trial
              </span>
              <span>
                Trial {questionIndex + 1} of {totalQuestions}
              </span>
            </div>
            <p className="text-rose-400 italic text-sm sm:text-base font-medium">
              "{question.flavor}"
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
              {question.question}
            </h2>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isProcessing || isLocked}
                onClick={() => handleOptionClick(idx)}
                className="p-4 sm:p-5 bg-stone-950/70 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/80 rounded-xl text-left text-stone-200 hover:text-white transition-all duration-200 group flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] active:scale-[0.99] select-none touch-manipulation"
              >
                <span className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-md bg-stone-900 border border-stone-700 text-amber-500 font-mono font-bold text-xs group-hover:bg-amber-500 group-hover:text-stone-950 transition-colors">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm sm:text-base font-medium">{opt}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(TrialScreen);
