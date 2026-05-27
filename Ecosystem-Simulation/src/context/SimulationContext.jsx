import React, { createContext, useReducer } from 'react';

const INITIAL_PREY = 40;
const INITIAL_PREDATOR = 9;

const initialState = {
  params: {
    alpha: 0.1,    // Prey birth rate
    beta: 0.02,    // Predation rate
    delta: 0.01,   // Predator reproduction rate
    gamma: 0.1,    // Predator death rate
    carryingCapacity: 200,
    modelType: 'classic', 
    timeStep: 0.1
  },
  data: [{ time: 0, prey: INITIAL_PREY, predator: INITIAL_PREDATOR }],
  isRunning: false,
  currentTime: 0
};

function simulationReducer(state, action) {
  switch (action.type) {
    case 'SET_PARAM':
      return {
        ...state,
        params: { ...state.params, [action.payload.name]: action.payload.value }
      };
    case 'SET_MODEL_TYPE':
      return {
        ...state,
        params: { ...state.params, modelType: action.payload }
      };
    case 'TOGGLE_RUNNING':
      return { ...state, isRunning: !state.isRunning };
    case 'RESET_SIMULATION':
      return {
        ...state,
        data: [{ time: 0, prey: INITIAL_PREY, predator: INITIAL_PREDATOR }],
        currentTime: 0,
        isRunning: false
      };
    case 'STEP_SIMULATION': {
      const lastPoint = state.data[state.data.length - 1];
      let x = lastPoint.prey;
      let y = lastPoint.predator;
      const { alpha, beta, delta, gamma, carryingCapacity, modelType, timeStep } = state.params;

      let dx, dy;
      if (modelType === 'classic') {
        dx = (alpha * x) - (beta * x * y);
      } else {
        dx = (alpha * x * (1 - x / carryingCapacity)) - (beta * x * y);
      }
      dy = (delta * x * y) - (gamma * y);

      let nextX = Math.max(0, x + dx * timeStep);
      let nextY = Math.max(0, y + dy * timeStep);
      let nextTime = state.currentTime + timeStep;

      let newData = [...state.data, {
        time: Number(nextTime.toFixed(2)),
        prey: nextX,
        predator: nextY
      }];

      if (newData.length > 300) newData.shift();

      let isRunning = state.isRunning;
      if (nextX === 0 && nextY === 0) isRunning = false;

      return {
        ...state,
        currentTime: nextTime,
        data: newData,
        isRunning
      };
    }
    default:
      return state;
  }
}

export const SimulationContext = createContext();

export function SimulationProvider({ children }) {
  const [state, dispatch] = useReducer(simulationReducer, initialState);
  return (
    <SimulationContext.Provider value={{ state, dispatch }}>
      {children}
    </SimulationContext.Provider>
  );
}