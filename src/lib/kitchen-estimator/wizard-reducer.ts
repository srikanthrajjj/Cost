import type {
  KitchenEstimateAnswers,
  AIDetectionResult,
  KitchenLiveEstimate,
} from "./types";

// ─── Wizard State ────────────────────────────────────────────────────────────

export interface WizardState {
  currentPath: "ai" | "manual" | null;
  currentStep: number;
  photos: File[];
  aiDetections: AIDetectionResult | null;
  answers: KitchenEstimateAnswers;
  liveEstimate: KitchenLiveEstimate | null;
  isAnalyzing: boolean;
  error: string | null;
}

// ─── Wizard Actions ──────────────────────────────────────────────────────────

export type WizardAction =
  | { type: "SELECT_PATH"; payload: "ai" | "manual" }
  | { type: "SET_PHOTOS"; payload: File[] }
  | { type: "SET_AI_RESULT"; payload: AIDetectionResult }
  | { type: "UPDATE_ANSWER"; payload: { field: string; value: unknown } }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "RESET" }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_ANALYZING"; payload: boolean };

// ─── Initial State ───────────────────────────────────────────────────────────

export const initialWizardState: WizardState = {
  currentPath: null,
  currentStep: 0,
  photos: [],
  aiDetections: null,
  answers: {
    path: "manual",
    zipCode: "",
    kitchenSize: "medium",
    remodelScope: "midrange",
    cabinetType: "stock",
    countertopMaterial: "laminate",
    flooringChoice: "keep",
    applianceTier: "keep",
    structuralChanges: [],
    timeline: "flexible",
  },
  liveEstimate: null,
  isAnalyzing: false,
  error: null,
};

// ─── Reducer ─────────────────────────────────────────────────────────────────

/**
 * Pure reducer function for the kitchen estimator wizard.
 * Manages all state transitions for both AI and manual paths.
 * Designed to be used with React's useReducer hook.
 *
 * Backward navigation (PREV_STEP) preserves all previously entered answers
 * by only decrementing the step counter without clearing any answer data.
 */
export function wizardReducer(
  state: WizardState,
  action: WizardAction
): WizardState {
  switch (action.type) {
    case "SELECT_PATH": {
      return {
        ...state,
        currentPath: action.payload,
        currentStep: 0,
        answers: {
          ...state.answers,
          path: action.payload,
        },
        error: null,
      };
    }

    case "SET_PHOTOS": {
      return {
        ...state,
        photos: action.payload,
        error: null,
      };
    }

    case "SET_AI_RESULT": {
      return {
        ...state,
        aiDetections: action.payload,
        isAnalyzing: false,
        error: null,
      };
    }

    case "UPDATE_ANSWER": {
      const { field, value } = action.payload;
      return {
        ...state,
        answers: {
          ...state.answers,
          [field]: value,
        },
      };
    }

    case "NEXT_STEP": {
      return {
        ...state,
        currentStep: state.currentStep + 1,
        error: null,
      };
    }

    case "PREV_STEP": {
      // Navigate backward without modifying answers — preserves all previously entered data
      return {
        ...state,
        currentStep: Math.max(0, state.currentStep - 1),
      };
    }

    case "RESET": {
      return { ...initialWizardState };
    }

    case "SET_ERROR": {
      return {
        ...state,
        error: action.payload,
        isAnalyzing: false,
      };
    }

    case "SET_ANALYZING": {
      return {
        ...state,
        isAnalyzing: action.payload,
        error: action.payload ? null : state.error,
      };
    }

    default: {
      return state;
    }
  }
}
