export const initialState = {
  isPlaying: false,
  status: 'IDLE',
  projectile: { x: 0, y: 0, vx: 0, vy: 0, mass: 10, area: 0.05 },
  environment: { gravity: 9.81, windX: 0, windY: 0, airDensity: 1.225, dragCoefficient: 0.47 },
  launchParams: { angle: 45, initialVelocity: 100 },
  trajectoryHistory: [],
  target: { x: 800, y: 0, width: 60, height: 40 },
  time: 0,
};

export function physicsReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_LAUNCH_PARAMS':
      return { ...state, launchParams: { ...state.launchParams, ...action.payload } };
    
    case 'UPDATE_ENVIRONMENT':
      return { ...state, environment: { ...state.environment, ...action.payload } };
      
    case 'FIRE': {
      const { angle, initialVelocity } = state.launchParams;
      const angleRad = (angle * Math.PI) / 180;
      return {
        ...state,
        isPlaying: true,
        status: 'FLYING',
        time: 0,
        trajectoryHistory: [{ x: 0, y: 0 }],
        projectile: {
          ...state.projectile,
          x: 0,
          y: 0,
          vx: initialVelocity * Math.cos(angleRad),
          vy: initialVelocity * Math.sin(angleRad),
        }
      };
    }
    
    case 'TICK': {
      if (!state.isPlaying) return state;

      const dt = action.payload;
      const p = state.projectile;
      const env = state.environment;
      const t = state.target;

      const vRelX = p.vx - env.windX;
      const vRelY = p.vy - env.windY;
      const vRelSq = vRelX * vRelX + vRelY * vRelY;
      const vRel = Math.sqrt(vRelSq);

      const Fd = 0.5 * env.airDensity * vRelSq * env.dragCoefficient * p.area;
      
      const Fdx = vRel > 0 ? -Fd * (vRelX / vRel) : 0;
      const Fdy = vRel > 0 ? -Fd * (vRelY / vRel) : 0;

      const ax = Fdx / p.mass;
      const ay = -env.gravity + (Fdy / p.mass);

      const newVx = p.vx + ax * dt;
      const newVy = p.vy + ay * dt;
      const newX = p.x + newVx * dt;
      const newY = p.y + newVy * dt;

      const newTrajectory = [...state.trajectoryHistory, { x: newX, y: newY }];

      let newStatus = 'FLYING';
      let isPlaying = true;

      if (newY <= 0) {
        isPlaying = false;
        newStatus = 'MISSED';
      }

      if (
        newX >= t.x && newX <= t.x + t.width &&
        newY >= t.y && newY <= t.y + t.height
      ) {
        isPlaying = false;
        newStatus = 'HIT';
      }

      return {
        ...state,
        isPlaying,
        status: newStatus,
        time: state.time + dt,
        projectile: { ...p, x: newX, y: Math.max(0, newY), vx: newVx, vy: newVy },
        trajectoryHistory: newTrajectory
      };
    }

    case 'RESET':
      return {
        ...initialState,
        launchParams: state.launchParams,
        environment: state.environment,
        target: {
          ...state.target,
          x: Math.floor(Math.random() * 500) + 300,
        }
      };

    default:
      return state;
  }
}