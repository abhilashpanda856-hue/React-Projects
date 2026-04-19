import React, { useContext, useEffect, useRef } from 'react';
import { StoreContext } from '../context/StoreContext';
import MeasurementReadout from './MeasurementReadout';

const ScopeScreen = () => {
  const canvasRef = useRef(null);
  const { state } = useContext(StoreContext);
  const stateRef = useRef(state);
  const driftPhaseRef = useRef(0);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    const X_DIVS = 10;
    const Y_DIVS = 8;

    const drawGrid = (width, height) => {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
      ctx.lineWidth = 1;

      for (let i = 0; i <= X_DIVS; i++) {
        const x = (width / X_DIVS) * i;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }

      for (let i = 0; i <= Y_DIVS; i++) {
        const y = (height / Y_DIVS) * i;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.moveTo(width / 2, 0); ctx.lineTo(width / 2, height);
      ctx.moveTo(0, height / 2); ctx.lineTo(width, height / 2);
      
      ctx.stroke();
    };

    const render = () => {
      const { width, height } = canvas;
      const currentState = stateRef.current;
      
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      drawGrid(width, height);

      ctx.beginPath();
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#06b6d4';

      const { frequency, amplitude, waveformType } = currentState.signal;
      const { timebase, voltsPerDiv } = currentState.scope;
      const { level: trigLevel, edge: trigEdge } = currentState.trigger;

      const totalTime = timebase * X_DIVS;
      const totalVolts = voltsPerDiv * Y_DIVS;

      let startPhase = 0;
      let isTriggered = false;

      if (Math.abs(trigLevel) <= amplitude) {
        isTriggered = true;
        let triggerPhase = Math.asin(trigLevel / amplitude);
        
        if (waveformType === 'sine') {
          startPhase = trigEdge === 'RISING' ? triggerPhase : Math.PI - triggerPhase;
        } else if (waveformType === 'square') {
          startPhase = trigEdge === 'RISING' ? 0 : Math.PI;
        } else if (waveformType === 'triangle') {
          startPhase = trigEdge === 'RISING' ? triggerPhase : Math.PI - triggerPhase; 
        }
      }

      if (!isTriggered) {
        driftPhaseRef.current += 0.05;
        startPhase = driftPhaseRef.current;
      }

      for (let x = 0; x <= width; x++) {
        const t = (x / width) * totalTime;
        
        const currentPhase = startPhase + (2 * Math.PI * frequency * t);

        let v = 0;
        if (waveformType === 'sine') {
          v = amplitude * Math.sin(currentPhase);
        } else if (waveformType === 'square') {
          v = amplitude * Math.sign(Math.sin(currentPhase));
        } else if (waveformType === 'triangle') {
          v = amplitude * (2 / Math.PI) * Math.asin(Math.sin(currentPhase));
        }

        const y = (height / 2) - ((v / (totalVolts / 2)) * (height / 2));

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.shadowBlur = 0;

      const trigY = (height / 2) - ((trigLevel / (totalVolts / 2)) * (height / 2));
      ctx.beginPath();
      ctx.strokeStyle = '#f59e0b';
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 1;
      ctx.moveTo(0, trigY);
      ctx.lineTo(width, trigY);
      ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(width, trigY);
      ctx.lineTo(width - 8, trigY - 5);
      ctx.lineTo(width - 8, trigY + 5);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="relative w-full h-[500px] bg-slate-950 rounded-xl overflow-hidden border-2 border-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={480} 
        className="w-full h-full block"
      />
      <MeasurementReadout />
    </div>
  );
};

export default ScopeScreen;