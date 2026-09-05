import React from 'react';
import { Skull, Users, Brain, Shield, Heart, Target } from 'lucide-react';

const COMRADE_ICONS = {
  'Sayyadina (Healer)': <Heart className="w-6 h-6 text-rose-400" />,
  'Fedaykin (Commando)': <Target className="w-6 h-6 text-amber-400" />,
  'Desert Scout': <Shield className="w-6 h-6 text-sky-400" />,
};

function RoleRevealScreen({ selectedRole, comrades }) {
  const isFremen = selectedRole === 'FREMEN';
  const isHarkonnen = selectedRole === 'HARKONNEN';

  return (
    <div className="text-center space-y-8 max-w-3xl mx-auto animate-fade-in-up">
      <div className="space-y-2">
        <h3 className="text-amber-500 font-mono text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-glow-amber">
          THE DESERT HAS JUDGED YOU
        </h3>
        <h2
          className={`text-4xl sm:text-6xl font-black font-cinzel tracking-wider ${
            isFremen
              ? 'text-sky-400 text-glow-blue'
              : isHarkonnen
              ? 'text-rose-500 text-glow-red'
              : 'text-purple-400'
          }`}
        >
          {isFremen ? 'THE FREMEN TRIBE' : isHarkonnen ? 'HOUSE HARKONNEN' : 'THE MENTAT'}
        </h2>
      </div>

      <p className="text-lg sm:text-xl text-stone-300 italic max-w-2xl mx-auto leading-relaxed bg-stone-900/50 p-5 rounded-xl border border-stone-800">
        {isFremen
          ? `"You did not walk the desert alone. You built a tribe. The friends you made are now your vanguard. Stand together, or fall together."`
          : isHarkonnen
          ? `"You stepped on others to climb the ranks. Raw violent force is yours to command, but fear breeds disloyalty. The desert will test if your blade is as sharp as your malice."`
          : `"You rejected the pack. You are the shadow monarch of your own destiny. Your mind is a weapon, but you have no shield. One mistake, and you fall."`}
      </p>

      {/* Fremen Vanguard Details */}
      {isFremen && (
        <div className="bg-stone-900/80 p-6 sm:p-8 rounded-2xl border border-sky-900/60 shadow-[0_0_30px_rgba(56,189,248,0.1)]">
          <div className="flex items-center justify-center gap-2 text-sky-400 font-bold font-cinzel text-lg mb-6">
            <Users className="w-5 h-5" />
            <h4>Vanguard Unlocked ({comrades.length}/3)</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {comrades.length > 0 ? (
              comrades.map((c, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 bg-stone-950/80 p-4 rounded-xl border border-stone-800 hover:border-sky-500/50 transition-all hover:scale-105 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-full bg-stone-900 flex items-center justify-center border border-stone-700">
                    {COMRADE_ICONS[c.type] || c.icon}
                  </div>
                  <span className="font-bold text-white tracking-wide">{c.type}</span>
                  <span className="text-xs text-stone-400 text-center">{c.desc}</span>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-stone-500 italic py-4">
                Your friendship wasn't strong enough to summon any vanguard comrades. You face the sand alone.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Harkonnen Internal Sabotage Details */}
      {isHarkonnen && (
        <div className="bg-stone-900/80 p-6 sm:p-8 rounded-2xl border border-rose-900/60 shadow-[0_0_30px_rgba(244,63,94,0.15)]">
          <div className="flex items-center justify-center gap-2 text-rose-400 font-bold font-cinzel text-lg mb-4">
            <Skull className="w-5 h-5 text-rose-500" />
            <h4>Internal Sabotage Debuff Active</h4>
          </div>
          <p className="text-xs text-stone-400 font-mono mb-4">
            Tyrannical ambition grants devastating brute strikes, but disloyal subordinates plot your downfall.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="bg-stone-950/80 p-4 rounded-xl border border-stone-800">
              <div className="text-rose-400 font-bold text-sm mb-1">⚔️ Brute Force Strike</div>
              <div className="text-2xl font-mono font-bold text-rose-400">ATK + ARRG</div>
              <p className="text-xs text-stone-400 mt-1">High raw attack damage scaling with your arrogance on correct answers</p>
            </div>
            <div className="bg-stone-950/80 p-4 rounded-xl border border-stone-800">
              <div className="text-amber-400 font-bold text-sm mb-1">🩸 Sabotage Damage</div>
              <div className="text-2xl font-mono font-bold text-rose-500">+15 DMG</div>
              <p className="text-xs text-stone-400 mt-1">Subordinates betray you on incorrect answers, dealing extra damage</p>
            </div>
            <div className="bg-stone-950/80 p-4 rounded-xl border border-stone-800">
              <div className="text-stone-400 font-bold text-sm mb-1">👥 Zero Vanguard</div>
              <div className="text-2xl font-mono font-bold text-stone-300">Solo</div>
              <p className="text-xs text-stone-400 mt-1">No shields or heals—fear ensures nobody stands beside you</p>
            </div>
          </div>
        </div>
      )}

      {/* Mentat Perks Details */}
      {!isFremen && !isHarkonnen && (
        <div className="bg-stone-900/80 p-6 sm:p-8 rounded-2xl border border-purple-900/60 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
          <div className="flex items-center justify-center gap-2 text-purple-400 font-bold font-cinzel text-lg mb-4">
            <Brain className="w-5 h-5" />
            <h4>Glass Cannon Mode Activated</h4>
          </div>
          <p className="text-xs text-stone-400 font-mono mb-4">
            Supreme cognitive discipline yields unmatched devastation at extreme vulnerability.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="bg-stone-950/80 p-4 rounded-xl border border-stone-800">
              <div className="text-amber-400 font-bold text-sm mb-1">⚔️ Calculation Multiplier</div>
              <div className="text-2xl font-mono font-bold text-emerald-400">2.5x</div>
              <p className="text-xs text-stone-400 mt-1">Massive multiplier on correct answers</p>
            </div>
            <div className="bg-stone-950/80 p-4 rounded-xl border border-stone-800">
              <div className="text-rose-400 font-bold text-sm mb-1">🛡️ Frail Constitution</div>
              <div className="text-2xl font-mono font-bold text-rose-400">Low HP</div>
              <p className="text-xs text-stone-400 mt-1">Stamina only provides half bonus HP</p>
            </div>
            <div className="bg-stone-950/80 p-4 rounded-xl border border-stone-800">
              <div className="text-stone-400 font-bold text-sm mb-1">👥 Zero Reinforcements</div>
              <div className="text-2xl font-mono font-bold text-stone-300">Solo</div>
              <p className="text-xs text-stone-400 mt-1">No shields or heals to save you</p>
            </div>
          </div>
        </div>
      )}

      {/* Button */}
      <div className="pt-2">
        <p className="text-stone-400 animate-pulse">Waiting for Admin to proceed to Trial...</p>
      </div>
    </div>
  );
}

export default React.memo(RoleRevealScreen);
