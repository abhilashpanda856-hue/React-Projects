import React, { useState, useEffect, useRef } from 'react';
import { Timer, AlertTriangle } from 'lucide-react';

function CountdownTimer({
  maxTime = 15,
  onTimeout,
  isPaused = false,
}) {
  const [timeLeft, setTimeLeft] = useState(maxTime);
  const onTimeoutRef = useRef(onTimeout);
  const hasTimedOutRef = useRef(false);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  });

  useEffect(() => {
    if (isPaused || hasTimedOutRef.current) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!hasTimedOutRef.current) {
            hasTimedOutRef.current = true;
            if (onTimeoutRef.current) {
              onTimeoutRef.current();
            }
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const isCritical = timeLeft < 5;
  const progressRatio = Math.max(0, Math.min(1, timeLeft / maxTime));

  return (
    <div
      className={`w-full p-3 sm:p-4 rounded-xl border backdrop-blur-md transition-all duration-300 select-none ${
        isCritical
          ? 'bg-red-950/40 border-red-500/80 shadow-[0_0_25px_rgba(239,68,68,0.35)] animate-pulse'
          : 'bg-stone-900/80 border-stone-800 shadow-lg'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        {/* Left Status Indicator */}
        <div className="flex items-center gap-2">
          {isCritical ? (
            <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
          ) : (
            <Timer className="w-4 h-4 text-amber-400" />
          )}
          <span
            className={`text-xs font-mono tracking-widest uppercase font-semibold ${
              isCritical
                ? 'text-red-400 text-glow-red animate-pulse'
                : 'text-stone-400'
            }`}
          >
            {isCritical ? 'TEMPORAL COLLAPSE IMMINENT' : 'CHRONO PROTOCOL'}
          </span>
        </div>

        {/* Glowing Time Digits */}
        <div className="flex items-center gap-1.5">
          <span
            className={`font-mono text-base sm:text-lg font-black tracking-wider transition-colors ${
              isCritical
                ? 'text-red-500 text-glow-red animate-pulse'
                : 'text-amber-400 text-glow-amber'
            }`}
          >
            {String(timeLeft).padStart(2, '0')}s
          </span>
          <span className="text-[10px] font-mono text-stone-500 uppercase">
            / {maxTime}s
          </span>
        </div>
      </div>

      {/* Sci-Fi Progress Bar Track */}
      <div className="h-2 sm:h-2.5 w-full bg-stone-950/90 rounded-full overflow-hidden border border-stone-800 p-0.5 shadow-inner">
        <div
          className={`h-full w-full rounded-full origin-left will-change-transform transform transition-transform duration-1000 ease-linear ${
            isCritical
              ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-600 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse'
              : 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
          }`}
          style={{ transform: `scaleX(${progressRatio})` }}
        />
      </div>
    </div>
  );
}

export default React.memo(CountdownTimer);
