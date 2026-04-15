import { createContext } from 'react';

export const initialState = {
  inputs: {
    irPeaks: [],
    nmrShifts: [],
    molecularWeight: '',
  },
  flags: {
    hasCarbonyl: false,
    hasHydroxyl: false,
    hasCarboxylicAcid: false,
    hasAcidicProton: false,
  },
  result: 'SYSTEM IDLE. AWAITING SPECTRAL DATA INPUT...',
};

export const SpectralContext = createContext();

export function spectralReducer(state, action) {
  switch (action.type) {
    case 'ADD_IR_PEAK': {
      const newPeaks = [...state.inputs.irPeaks, Number(action.payload)].sort((a, b) => b - a);
      return { ...state, inputs: { ...state.inputs, irPeaks: newPeaks } };
    }
    case 'REMOVE_IR_PEAK': {
      const newPeaks = [...state.inputs.irPeaks];
      newPeaks.splice(action.payload, 1);
      return { ...state, inputs: { ...state.inputs, irPeaks: newPeaks } };
    }
    case 'ADD_NMR_SHIFT': {
      const newShifts = [...state.inputs.nmrShifts, Number(action.payload)].sort((a, b) => a - b);
      return { ...state, inputs: { ...state.inputs, nmrShifts: newShifts } };
    }
    case 'REMOVE_NMR_SHIFT': {
      const newShifts = [...state.inputs.nmrShifts];
      newShifts.splice(action.payload, 1);
      return { ...state, inputs: { ...state.inputs, nmrShifts: newShifts } };
    }
    case 'SET_MW':
      return { ...state, inputs: { ...state.inputs, molecularWeight: action.payload } };
    case 'RESET_DATA':
      return initialState;
    case 'LOAD_TEST_PROTOCOL':
      return { 
        ...state, 
        inputs: action.payload,
        flags: initialState.flags,
        result: 'SYSTEM IDLE. AWAITING SPECTRAL DATA INPUT...'
      };
    case 'RUN_ANALYSIS': {
      const { irPeaks, nmrShifts, molecularWeight } = state.inputs;
      
      const flags = {
        hasCarbonyl: false,
        hasHydroxyl: false,
        hasCarboxylicAcid: false,
        hasAcidicProton: false,
      };

      irPeaks.forEach(peak => {
        if (peak >= 1670 && peak <= 1750) flags.hasCarbonyl = true;
        if (peak >= 2500 && peak <= 3600) flags.hasHydroxyl = true;
      });

      if (flags.hasCarbonyl && flags.hasHydroxyl) {
        flags.hasCarboxylicAcid = true;
      }

      nmrShifts.forEach(shift => {
        if (shift >= 11.0 && shift <= 12.0) flags.hasAcidicProton = true;
      });

      const mwNum = molecularWeight ? Number(molecularWeight) : null;
      let newResult = '';

      if (flags.hasCarboxylicAcid && flags.hasAcidicProton) {
        if (mwNum === 60) {
          newResult = '>> MATCH FOUND: Acetic Acid (C2H4O2) <<\nClassification: Carboxylic Acid\nConfidence: 99.9%';
        } else {
          newResult = `>> MATCH FOUND: Carboxylic Acid <<\nMolecular Weight: ${mwNum || 'Unknown'}\nNote: Further fragmentation data needed for exact structural ID.`;
        }
      } else if (flags.hasCarbonyl && !flags.hasHydroxyl) {
        newResult = '>> PARTIAL MATCH: Ketone, Aldehyde, or Ester Detected <<\nCarbonyl group present. Lacking broad OH stretch.';
      } else if (!flags.hasCarbonyl && flags.hasHydroxyl) {
        newResult = '>> PARTIAL MATCH: Alcohol Detected <<\nHydroxyl group present. Lacking Carbonyl stretch.';
      } else if (irPeaks.length === 0 && nmrShifts.length === 0) {
        newResult = 'SYSTEM ERROR: INSUFFICIENT DATA.\nPlease provide IR and/or NMR spectra for analysis.';
      } else {
        newResult = '>> INCONCLUSIVE <<\nSignature does not match known prime categories in current database.';
      }

      return { ...state, flags, result: newResult };
    }
    default:
      return state;
  }
}