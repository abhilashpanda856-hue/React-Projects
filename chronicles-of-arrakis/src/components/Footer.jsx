import React from 'react';

function Footer({ playerName = '' }) {
  return (
    <footer className="relative z-10 w-full max-w-5xl mx-auto pt-6 text-center text-[11px] font-mono text-stone-600 border-t border-stone-800/60 flex flex-wrap justify-between items-center gap-2 select-none">
      <span>Arrakis Planetary Protocol • Imperial Year 10191</span>
      <span>{playerName ? `Player: ${playerName}` : '"Fear is the mind-killer."'}</span>
    </footer>
  );
}

export default React.memo(Footer);
