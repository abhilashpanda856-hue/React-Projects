export const initialState = {
  playbackState: 'STOPPED',
  status: 'IDLE',
  physicsMode: 'ATMOSPHERE',
  timeScale: 1.0,
  
  projectile: { x: 0, y: 0, vx: 0, vy: 0, mass: 10, area: 0.05 },
  environment: { gravity: 9.81, windX: 0, windY: 0, airDensity: 1.225, dragCoefficient: 0.47 },
  launchParams: { angle: 45, initialVelocity: 100 },
  target: { x: 800, y: 0, width: 60, height: 40 },
  time: 0,
  
  pastFlights: [],
  activeFlight: {
    path: [],
    ghostPath: [],
    apogee: { x: 0, y: 0 }
  }
};

export function physicsReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_LAUNCH_PARAMS':
      return { ...state, launchParams: { ...state.launchParams, ...action.payload } };
    
    case 'UPDATE_ENVIRONMENT':
      return { ...state, environment: { ...state.environment, ...action.payload } };

    case 'SET_PHYSICS_MODE':
      return { ...state, physicsMode: action.payload };

    case 'SET_TIME_SCALE':
      return { ...state, timeScale: action.payload };

    case 'SET_PLAYBACK':
      return { ...state, playbackState: action.payload };

    case 'CLEAR_TRACES':
      return { ...state, pastFlights: [] };
      
    case 'FIRE': {
      const { angle, initialVelocity } = state.launchParams;
      const angleRad = (angle * Math.PI) / 180;
      const v0x = initialVelocity * Math.cos(angleRad);
      const v0y = initialVelocity * Math.sin(angleRad);
      const g = state.environment.gravity;

      let ghostPath = [];
      if (state.physicsMode === 'ATMOSPHERE') {
        for (let x = 0; x <= 1500; x += 15) {
          const y = (x * Math.tan(angleRad)) - ((g * x * x) / (2 * initialVelocity * initialVelocity * Math.cos(angleRad) * Math.cos(angleRad)));
          if (y < 0 && x > 0) {
            const xImpact = (initialVelocity * initialVelocity * Math.sin(2 * angleRad)) / g;
            ghostPath.push({ x: xImpact, y: 0 });
            break;
          }
          ghostPath.push({ x, y });
        }
      }

      const newPastFlights = [...state.pastFlights];
      if (state.activeFlight.path.length > 0) {
        newPastFlights.push({
          path: state.activeFlight.path,
          status: state.status
        });
      }

      return {
        ...state,
        playbackState: 'PLAYING',
        status: 'FLYING',
        time: 0,
        pastFlights: newPastFlights,
        activeFlight: {
          path: [{ x: 0, y: 0 }],
          ghostPath: ghostPath,
          apogee: { x: 0, y: 0 }
        },
        projectile: {
          ...state.projectile,
          x: 0,
          y: 0,
          vx: v0x,
          vy: v0y,
        }
      };
    }
    
    case 'TICK': {
      if (state.playbackState !== 'PLAYING') return state;

      const dt = action.payload * state.timeScale;
      const p = state.projectile;
      const env = state.environment;
      const t = state.target;

      let Fdx = 0;
      let Fdy = 0;

      if (state.physicsMode === 'ATMOSPHERE') {
        const vRelX = p.vx - env.windX;
        const vRelY = p.vy - env.windY;
        const vRelSq = vRelX * vRelX + vRelY * vRelY;
        const vRel = Math.sqrt(vRelSq);
        
        const Fd = 0.5 * env.airDensity * vRelSq * env.dragCoefficient * p.area;
        
        Fdx = vRel > 0 ? -Fd * (vRelX / vRel) : 0;
        Fdy = vRel > 0 ? -Fd * (vRelY / vRel) : 0;
      }

      const ax = Fdx / p.mass;
      const ay = -env.gravity + (Fdy / p.mass);

      const newVx = p.vx + ax * dt;
      const newVy = p.vy + ay * dt;
      const newX = p.x + newVx * dt;
      const newY = p.y + newVy * dt;

      let currentApogee = state.activeFlight.apogee;
      if (newY > currentApogee.y) {
        currentApogee = { x: newX, y: newY };
      }

      const newPath = [...state.activeFlight.path, { x: newX, y: Math.max(0, newY) }];

      let newStatus = 'FLYING';
      let newPlaybackState = 'PLAYING';

      if (newY <= 0) {
        newPlaybackState = 'STOPPED';
        newStatus = 'MISSED';
      } else if (newX >= t.x && newX <= t.x + t.width && newY >= t.y && newY <= t.y + t.height) {
        newPlaybackState = 'STOPPED';
        newStatus = 'HIT';
      }

      return {
        ...state,
        playbackState: newPlaybackState,
        status: newStatus,
        time: state.time + dt,
        projectile: { ...p, x: newX, y: Math.max(0, newY), vx: newVx, vy: newVy },
        activeFlight: {
          ...state.activeFlight,
          path: newPath,
          apogee: currentApogee
        }
      };
    }

    case 'RESET_TARGET':
      return {
        ...state,
        target: {
          ...state.target,
          x: Math.floor(Math.random() * 600) + 300,
        }
      };

    default:
      return state;
  }
}