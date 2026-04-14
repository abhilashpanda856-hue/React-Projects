import React, { useReducer, useEffect, useRef } from 'react';
import { Target, Wind, Activity, Crosshair, RefreshCw, Play, Zap } from 'lucide-react';
import { physicsReducer, initialState } from './reducers/physicsReducer';
import TelemetryCard from './components/TelemetryCard';
import SliderControl from './components/SliderControl';
import './index.css';

export default function App() {
  const [state, dispatch] = useReducer(physicsReducer, initialState);
  const requestRef = useRef();

  useEffect(() => {
    const tick = () => {
      dispatch({ type: 'TICK', payload: 0.03 }); 
      if (state.isPlaying) {
        requestRef.current = requestAnimationFrame(tick);
      }
    };

    if (state.isPlaying) {
      requestRef.current = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [state.isPlaying]);

  const handleFire = () => dispatch({ type: 'FIRE' });
  const handleReset = () => dispatch({ type: 'RESET' });

  const VIEWBOX_WIDTH = 1000;
  const VIEWBOX_HEIGHT = 400;
  const scaleY = (y) => VIEWBOX_HEIGHT - y;

  const trajectoryPath = state.trajectoryHistory
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${scaleY(point.y)}`)
    .join(' ');

  return (
    <div className="min-h-screen bg-slate-950 text-cyan-50 font-mono flex flex-col p-4 md:p-6 selection:bg-cyan-900">
      
      <header className="flex items-center justify-between pb-6 border-b border-cyan-900/50 mb-6">
        <div className="flex items-center gap-3">
          <Zap className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          <h1 className="text-2xl md:text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">
            ARTILLERY_OS // V1.0
          </h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-cyan-500">
          <Activity className="w-4 h-4 animate-pulse" />
          SYSTEM_ONLINE
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <section className="lg:col-span-3 flex flex-col gap-4">
          <div className="relative w-full aspect-video bg-slate-900/80 rounded-xl border border-cyan-900/50 shadow-[0_0_30px_rgba(0,0,0,0.5)_inset,0_0_15px_rgba(34,211,238,0.1)] overflow-hidden">
            
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
            
            <svg 
              viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} 
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="xMidYMax meet"
            >
              <defs>
                <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="purple-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <line x1="0" y1={VIEWBOX_HEIGHT} x2={VIEWBOX_WIDTH} y2={VIEWBOX_HEIGHT} stroke="#06b6d4" strokeWidth="2" opacity="0.5" />
              
              <rect 
                x={state.target.x} 
                y={scaleY(state.target.y + state.target.height)} 
                width={state.target.width} 
                height={state.target.height} 
                fill="none"
                stroke="#a855f7" 
                strokeWidth="2"
                filter="url(#purple-glow)"
                className="transition-all duration-300"
              />
              <rect 
                x={state.target.x} 
                y={scaleY(state.target.y + state.target.height)} 
                width={state.target.width} 
                height={state.target.height} 
                fill="#a855f7" 
                opacity="0.2"
              />

              {trajectoryPath && (
                <path 
                  d={trajectoryPath} 
                  fill="none" 
                  stroke="#22d3ee" 
                  strokeWidth="2" 
                  strokeDasharray="4 4"
                  filter="url(#neon-glow)"
                  opacity="0.8"
                />
              )}

              <circle 
                cx={state.projectile.x} 
                cy={scaleY(state.projectile.y)} 
                r="4" 
                fill="#fff" 
                filter="url(#neon-glow)"
              />
            </svg>

            {state.status === 'HIT' && (
              <div className="absolute inset-0 flex items-center justify-center bg-purple-900/40 backdrop-blur-sm z-10 animate-in fade-in zoom-in duration-300">
                <div className="text-center">
                  <h2 className="text-5xl font-black text-purple-400 drop-shadow-[0_0_20px_rgba(168,85,247,0.8)] tracking-widest mb-4">TARGET HIT!</h2>
                  <p className="text-purple-200">Terminal Velocity: {Math.sqrt(state.projectile.vx**2 + state.projectile.vy**2).toFixed(1)} m/s</p>
                </div>
              </div>
            )}

            {state.status === 'MISSED' && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-10 animate-in fade-in duration-300">
                <div className="text-center">
                  <h2 className="text-5xl font-black text-cyan-600 drop-shadow-[0_0_15px_rgba(8,145,178,0.8)] tracking-widest mb-4">IMPACT</h2>
                  <p className="text-cyan-400">Distance to target: {Math.abs(state.projectile.x - state.target.x).toFixed(1)}m</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TelemetryCard title="POS X" value={state.projectile.x.toFixed(1)} unit="m" />
            <TelemetryCard title="ALT Y" value={state.projectile.y.toFixed(1)} unit="m" />
            <TelemetryCard title="VELOCITY" value={Math.sqrt(state.projectile.vx**2 + state.projectile.vy**2).toFixed(1)} unit="m/s" />
            <TelemetryCard title="T-PLUS" value={state.time.toFixed(2)} unit="s" />
          </div>
        </section>

        <aside className="bg-slate-900/80 rounded-xl border border-cyan-900/50 p-5 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex flex-col gap-6">
          <div className="flex items-center gap-2 pb-2 border-b border-cyan-900/50">
            <Crosshair className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-purple-400 tracking-wider">TARGETING_SYS</h2>
          </div>

          <div className="flex flex-col gap-5">
            <SliderControl 
              label="ELEVATION ANGLE" 
              value={state.launchParams.angle} 
              min={0} max={90} step={1} unit="°"
              onChange={(v) => dispatch({ type: 'UPDATE_LAUNCH_PARAMS', payload: { angle: v } })}
              disabled={state.isPlaying}
            />
            
            <SliderControl 
              label="INITIAL VELOCITY" 
              value={state.launchParams.initialVelocity} 
              min={10} max={200} step={1} unit="m/s"
              onChange={(v) => dispatch({ type: 'UPDATE_LAUNCH_PARAMS', payload: { initialVelocity: v } })}
              disabled={state.isPlaying}
            />

            <div className="flex items-center gap-2 pt-4 pb-2 border-b border-cyan-900/50 mt-2">
              <Wind className="w-5 h-5 text-cyan-500" />
              <h2 className="text-lg font-bold text-cyan-500 tracking-wider">ENV_VARS</h2>
            </div>

            <SliderControl 
              label="WIND X (CROSSWIND)" 
              value={state.environment.windX} 
              min={-50} max={50} step={1} unit="m/s"
              onChange={(v) => dispatch({ type: 'UPDATE_ENVIRONMENT', payload: { windX: v } })}
              disabled={state.isPlaying}
            />
          </div>

          <div className="mt-auto pt-6 flex flex-col gap-3">
            <button 
              onClick={handleFire}
              disabled={state.isPlaying}
              className="group relative w-full py-4 bg-purple-600/20 text-purple-400 font-bold text-xl tracking-widest border border-purple-500/50 rounded-lg overflow-hidden transition-all hover:bg-purple-600 hover:text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />
              <span className="flex items-center justify-center gap-2">
                <Play className="w-5 h-5 fill-current" /> FIRE
              </span>
            </button>
            
            <button 
              onClick={handleReset}
              className="w-full py-3 bg-slate-800 text-cyan-400 font-bold tracking-wider border border-cyan-900 rounded-lg transition-all hover:bg-slate-700 hover:text-cyan-300 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> RESET_SIM
            </button>
          </div>

        </aside>
      </main>
    </div>
  );
}