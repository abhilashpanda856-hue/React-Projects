import React, { useReducer, useEffect, useRef } from 'react';
import { Target, Wind, Activity, Crosshair, Play, Zap, Pause, Cloud, Moon, Trash2 } from 'lucide-react';
import { physicsReducer, initialState } from './reducers/physicsReducer';
import TelemetryCard from './components/TelemetryCard';
import SliderControl from './components/SliderControl';
import './index.css';

export default function App() {
  const [state, dispatch] = useReducer(physicsReducer, initialState);
  const requestRef = useRef();

  useEffect(() => {
    const tick = () => {
      dispatch({ type: 'TICK', payload: 0.016 }); 
      
      if (state.playbackState === 'PLAYING') {
        requestRef.current = requestAnimationFrame(tick);
      }
    };

    if (state.playbackState === 'PLAYING') {
      requestRef.current = requestAnimationFrame(tick);
    }
    
    return () => cancelAnimationFrame( requestRef.current );
  }, [state.playbackState]);

  const VIEWBOX_WIDTH = 1200;
  const VIEWBOX_HEIGHT = 500;
  const scaleY = ( y ) => VIEWBOX_HEIGHT - y;

  const generateSvgPath = ( points ) => {
    if (!points || points.length === 0) return '';
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${scaleY(p.y)}`).join(' ');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-cyan-50 font-mono flex flex-col p-4 md:p-6 selection:bg-cyan-900">
      
      <header className="flex items-center justify-between pb-4 border-b border-cyan-900/50 mb-6">
        <div className="flex items-center gap-3">
          <Zap className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          <h1 className="text-2xl md:text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">
            ARTILLERY_OS // V2.0
          </h1>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className={`px-3 py-1 rounded-full border flex items-center gap-2 ${
            state.playbackState === 'PLAYING' ? 'border-green-500 text-green-400 bg-green-950/30' : 
            state.playbackState === 'PAUSED' ? 'border-yellow-500 text-yellow-400 bg-yellow-950/30' : 
            'border-cyan-800 text-cyan-600 bg-cyan-950/30'
          }`}>
            <Activity className={`w-4 h-4 ${state.playbackState === 'PLAYING' ? 'animate-pulse' : ''}`} />
            {state.playbackState}
          </div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <section className="lg:col-span-3 flex flex-col gap-4">
          
          <div className="relative w-full aspect-[21/9] bg-slate-900/80 rounded-xl border border-cyan-900/50 shadow-[0_0_30px_rgba(0,0,0,0.5)_inset,0_0_15px_rgba(34,211,238,0.1)] overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:50px_50px] opacity-20"></div>
            
            <svg viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMax meet">
              <defs>
                <filter id="neon-glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                <filter id="purple-glow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>

              <line x1="0" y1={VIEWBOX_HEIGHT} x2={VIEWBOX_WIDTH} y2={VIEWBOX_HEIGHT} stroke="#06b6d4" strokeWidth="2" opacity="0.5" />
              
              <rect 
                x={state.target.x} y={scaleY(state.target.y + state.target.height)} 
                width={state.target.width} height={state.target.height} 
                fill="none" stroke="#a855f7" strokeWidth="2" filter="url(#purple-glow)"
              />
              <rect 
                x={state.target.x} y={scaleY(state.target.y + state.target.height)} 
                width={state.target.width} height={state.target.height} 
                fill="#a855f7" opacity="0.2"
              />

              {state.pastFlights.map((flight, idx) => (
                <path 
                  key={idx} d={generateSvgPath(flight.path)} 
                  fill="none" stroke={flight.status === 'HIT' ? "#a855f7" : "#0891b2"} 
                  strokeWidth="2" opacity="0.25" 
                />
              ))}

              {state.physicsMode === 'ATMOSPHERE' && state.activeFlight.ghostPath.length > 0 && (
                <path 
                  d={generateSvgPath(state.activeFlight.ghostPath)} 
                  fill="none" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.4"
                />
              )}

              {state.activeFlight.path.length > 0 && (
                <path 
                  d={generateSvgPath(state.activeFlight.path)} 
                  fill="none" stroke="#22d3ee" strokeWidth="3" filter="url(#neon-glow)" opacity="0.9"
                />
              )}

              {state.status === 'FLYING' && state.activeFlight.apogee.y > 0 && (
                <g transform={`translate(${state.activeFlight.apogee.x}, ${scaleY(state.activeFlight.apogee.y)})`}>
                  <circle cx="0" cy="0" r="6" fill="none" stroke="#facc15" strokeWidth="1.5" opacity="0.7" />
                  <line x1="-10" y1="0" x2="10" y2="0" stroke="#facc15" strokeWidth="1" opacity="0.5" />
                  <line x1="0" y1="-10" x2="0" y2="10" stroke="#facc15" strokeWidth="1" opacity="0.5" />
                </g>
              )}

              {state.status !== 'IDLE' && (
                <circle cx={state.projectile.x} cy={scaleY(state.projectile.y)} r="5" fill="#fff" filter="url(#neon-glow)" />
              )}
            </svg>

            {state.status === 'HIT' && (
              <div className="absolute inset-0 flex items-center justify-center bg-purple-900/40 backdrop-blur-sm z-10 animate-in fade-in zoom-in duration-300">
                <div className="text-center">
                  <h2 className="text-5xl font-black text-purple-400 drop-shadow-[0_0_20px_rgba(168,85,247,0.8)] tracking-widest mb-4">TARGET SECURED</h2>
                </div>
              </div>
            )}
            
            {state.status === 'MISSED' && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-10 animate-in fade-in duration-300 pointer-events-none">
                <div className="text-center">
                  <h2 className="text-5xl font-black text-cyan-600 drop-shadow-[0_0_15px_rgba(8,145,178,0.8)] tracking-widest mb-4">IMPACT</h2>
                  <p className="text-cyan-400">Error Margin: {Math.abs(state.projectile.x - state.target.x).toFixed(1)}m</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <TelemetryCard title="ALTITUDE (Y)" value={state.projectile.y.toFixed(1)} unit="m" />
            <TelemetryCard title="DISTANCE (X)" value={state.projectile.x.toFixed(1)} unit="m" />
            <TelemetryCard title="VELOCITY" value={Math.sqrt(state.projectile.vx**2 + state.projectile.vy**2).toFixed(1)} unit="m/s" />
            <TelemetryCard title="APOGEE" value={state.activeFlight.apogee.y.toFixed(1)} unit="m" highlight />
            <TelemetryCard title="T-PLUS" value={state.time.toFixed(2)} unit="s" />
          </div>

          <div className="bg-slate-900/60 border border-cyan-900/30 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex gap-2">
              <button 
                onClick={() => dispatch({ type: 'FIRE' })}
                disabled={state.playbackState === 'PLAYING'}
                className="px-6 py-2 bg-purple-600/20 text-purple-400 font-bold tracking-widest border border-purple-500/50 rounded hover:bg-purple-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" /> FIRE
              </button>
              
              {state.playbackState === 'PLAYING' ? (
                <button 
                  onClick={() => dispatch({ type: 'SET_PLAYBACK', payload: 'PAUSED' })}
                  className="px-4 py-2 bg-yellow-600/20 text-yellow-400 font-bold border border-yellow-500/50 rounded hover:bg-yellow-600 hover:text-white transition-all flex items-center gap-2"
                >
                  <Pause className="w-4 h-4 fill-current" /> PAUSE
                </button>
              ) : (
                <button 
                  onClick={() => dispatch({ type: 'SET_PLAYBACK', payload: 'PLAYING' })}
                  disabled={state.status !== 'FLYING'}
                  className="px-4 py-2 bg-green-600/20 text-green-400 font-bold border border-green-500/50 rounded hover:bg-green-600 hover:text-white transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" /> RESUME
                </button>
              )}
            </div>

            <div className="flex bg-slate-950 border border-cyan-900/50 rounded overflow-hidden">
              {[0.5, 1.0, 2.0].map(speed => (
                <button
                  key={speed}
                  onClick={() => dispatch({ type: 'SET_TIME_SCALE', payload: speed })}
                  className={`px-4 py-2 text-xs font-bold border-r border-cyan-900/50 last:border-0 transition-all ${
                    state.timeScale === speed ? 'bg-cyan-600 text-white' : 'text-cyan-500 hover:bg-slate-800'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            <button 
              onClick={() => dispatch({ type: 'CLEAR_TRACES' })}
              className="px-4 py-2 text-slate-400 hover:text-red-400 flex items-center gap-2 text-sm transition-colors border border-transparent hover:border-red-900/50 rounded"
            >
              <Trash2 className="w-4 h-4" /> CLEAR TRACES
            </button>
          </div>
        </section>

        <aside className="bg-slate-900/80 rounded-xl border border-cyan-900/50 p-5 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex flex-col gap-6">
          
          <div className="flex bg-slate-950 border border-purple-900/50 rounded-lg p-1">
            <button
              onClick={() => dispatch({ type: 'SET_PHYSICS_MODE', payload: 'ATMOSPHERE' })}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-md transition-all ${
                state.physicsMode === 'ATMOSPHERE' ? 'bg-purple-900/50 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'text-slate-500 hover:text-purple-400/70'
              }`}
            >
              <Cloud className="w-4 h-4" /> ATMOSPHERE
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_PHYSICS_MODE', payload: 'VACUUM' })}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-md transition-all ${
                state.physicsMode === 'VACUUM' ? 'bg-cyan-900/50 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.3)]' : 'text-slate-500 hover:text-cyan-400/70'
              }`}
            >
              <Moon className="w-4 h-4" /> VACUUM
            </button>
          </div>

          <div className="flex flex-col gap-5 border-t border-cyan-900/30 pt-4">
            <div className="flex items-center gap-2">
              <Crosshair className="w-5 h-5 text-purple-400" />
              <h2 className="text-sm font-bold text-purple-400 tracking-wider">LAUNCH PARAMS</h2>
            </div>
            
            <SliderControl 
              label="ELEVATION ANGLE" 
              value={state.launchParams.angle} 
              min={0} max={90} step={1} unit="°"
              onChange={(v) => dispatch({ type: 'UPDATE_LAUNCH_PARAMS', payload: { angle: v } })}
              disabled={state.playbackState === 'PLAYING'}
            />
            
            <SliderControl 
              label="INITIAL VELOCITY" 
              value={state.launchParams.initialVelocity} 
              min={10} max={200} step={1} unit="m/s"
              onChange={(v) => dispatch({ type: 'UPDATE_LAUNCH_PARAMS', payload: { initialVelocity: v } })}
              disabled={state.playbackState === 'PLAYING'}
            />
          </div>

          <div className={`flex flex-col gap-5 pt-4 border-t border-cyan-900/30 transition-opacity duration-300 ${state.physicsMode === 'VACUUM' ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-cyan-500" />
              <h2 className="text-sm font-bold text-cyan-500 tracking-wider">ENVIRONMENT</h2>
            </div>

            <SliderControl 
              label="WIND X (CROSSWIND)" 
              value={state.environment.windX} 
              min={-50} max={50} step={1} unit="m/s"
              onChange={(v) => dispatch({ type: 'UPDATE_ENVIRONMENT', payload: { windX: v } })}
              disabled={state.playbackState === 'PLAYING' || state.physicsMode === 'VACUUM'}
            />
            <SliderControl 
              label="AIR DENSITY" 
              value={state.environment.airDensity} 
              min={0.1} max={3.0} step={0.1} unit="kg/m³"
              onChange={(v) => dispatch({ type: 'UPDATE_ENVIRONMENT', payload: { airDensity: v } })}
              disabled={state.playbackState === 'PLAYING' || state.physicsMode === 'VACUUM'}
            />
          </div>

          <div className="mt-auto pt-6">
            <button 
              onClick={() => dispatch({ type: 'RESET_TARGET' })}
              className="w-full py-3 bg-slate-950 text-cyan-500 text-sm font-bold tracking-wider border border-cyan-900/50 rounded-lg transition-all hover:bg-slate-800 hover:text-cyan-300 flex items-center justify-center gap-2"
            >
              <Target className="w-4 h-4" /> RELOCATE TARGET
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}