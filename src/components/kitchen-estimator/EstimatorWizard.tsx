import { useCallback, useMemo, useReducer, useState } from "react";
import { Loader2, AlertCircle, RefreshCw, ClipboardList } from "lucide-react";
import {
  wizardReducer,
  initialWizardState,
} from "../../lib/kitchen-estimator/wizard-reducer";
import {
  type EstimatorConfig,
  defaultKitchenConfig,
} from "../../lib/kitchen-estimator/config";
import { getActiveSteps } from "../../lib/kitchen-estimator/step-filter";
import { calculateKitchenEstimate } from "../../lib/kitchen-estimator/kitchen-cost-engine";
import { defaultKitchenCostParams } from "../../lib/kitchen-estimator/cost-params";
import { analyzeKitchen } from "../../lib/kitchen-estimator/analyze-kitchen";
import { PathSelector } from "./PathSelector";
import { PhotoUploader } from "./PhotoUploader";
import { DetectionEditor } from "./DetectionEditor";
import { StepRenderer } from "./StepRenderer";
import { ProgressIndicator } from "./ProgressIndicator";
import { ResultsPage } from "./ResultsPage";

// ─── Props ───────────────────────────────────────────────────────────────────

interface EstimatorWizardProps {
  config?: EstimatorConfig;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Converts a File to a base64 data URL string for the AI analysis API.
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
    reader.readAsDataURL(file);
  });
}

// ─── Estimator Wizard Component ──────────────────────────────────────────────

export function EstimatorWizard({ config }: EstimatorWizardProps) {
  const resolvedConfig = config ?? defaultKitchenConfig;
  const [state, dispatch] = useReducer(wizardReducer, initialWizardState);
  const [aiConfirmed, setAiConfirmed] = useState(false);

  // ─── Compute active steps based on answers and path ──────────────────────

  const activeSteps = useMemo(() => {
    return getActiveSteps(resolvedConfig.steps, state.answers);
  }, [resolvedConfig.steps, state.answers]);

  // ─── Recalculate live estimate on answer changes ─────────────────────────

  const liveEstimate = useMemo(() => {
    // Only calculate when we have at least some meaningful answers
    const hasAnswers =
      state.answers.zipCode.length > 0 ||
      state.answers.kitchenSize !== initialWizardState.answers.kitchenSize ||
      state.answers.remodelScope !== initialWizardState.answers.remodelScope;

    if (!hasAnswers && !state.aiDetections) return null;

    return calculateKitchenEstimate(state.answers, defaultKitchenCostParams);
  }, [state.answers, state.aiDetections]);

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleSelectPath = useCallback((path: "ai" | "manual") => {
    dispatch({ type: "SELECT_PATH", payload: path });
  }, []);

  const handlePhotosChange = useCallback((photos: File[]) => {
    dispatch({ type: "SET_PHOTOS", payload: photos });
  }, []);

  const handleAnalyze = useCallback(async () => {
    dispatch({ type: "SET_ANALYZING", payload: true });

    try {
      // Convert photos to base64
      const base64Photos = await Promise.all(state.photos.map(fileToBase64));

      const result = await analyzeKitchen({ data: { photos: base64Photos } });

      if (result.success) {
        const detections = result.data;
        dispatch({ type: "SET_AI_RESULT", payload: detections });

        // Pre-fill answers from AI detections
        dispatch({
          type: "UPDATE_ANSWER",
          payload: { field: "cabinetType", value: detections.cabinetType.value },
        });
        dispatch({
          type: "UPDATE_ANSWER",
          payload: { field: "countertopMaterial", value: detections.countertopMaterial.value },
        });
        dispatch({
          type: "UPDATE_ANSWER",
          payload: { field: "flooringChoice", value: detections.flooringMaterial.value },
        });
        dispatch({
          type: "UPDATE_ANSWER",
          payload: { field: "kitchenSize", value: detections.kitchenSize.value },
        });
        dispatch({
          type: "UPDATE_ANSWER",
          payload: { field: "overallCondition", value: detections.overallCondition.value },
        });
        if (detections.observations.length > 0) {
          dispatch({
            type: "UPDATE_ANSWER",
            payload: { field: "aiObservations", value: detections.observations },
          });
        }
      } else {
        dispatch({ type: "SET_ERROR", payload: result.error });
      }
    } catch {
      dispatch({
        type: "SET_ERROR",
        payload: "We couldn't analyze your photos. You can try again or switch to the manual estimate.",
      });
    }
  }, [state.photos]);

  const handleDetectionUpdate = useCallback((field: string, value: string) => {
    // Map detection field names to answer field names
    const fieldMapping: Record<string, string> = {
      cabinetType: "cabinetType",
      countertopMaterial: "countertopMaterial",
      flooringMaterial: "flooringChoice",
      kitchenSize: "kitchenSize",
      overallCondition: "overallCondition",
    };
    const answerField = fieldMapping[field] ?? field;
    dispatch({ type: "UPDATE_ANSWER", payload: { field: answerField, value } });
  }, []);

  const handleDetectionConfirm = useCallback(() => {
    setAiConfirmed(true);
    dispatch({ type: "NEXT_STEP" });
  }, []);

  const handleStepAnswer = useCallback(
    (value: unknown) => {
      const currentStepConfig = activeSteps[state.currentStep];
      if (currentStepConfig) {
        dispatch({
          type: "UPDATE_ANSWER",
          payload: { field: currentStepConfig.id, value },
        });
      }
    },
    [activeSteps, state.currentStep],
  );

  const handleNext = useCallback(() => {
    dispatch({ type: "NEXT_STEP" });
  }, []);

  const handleBack = useCallback(() => {
    if (state.currentStep === 0 && state.currentPath === "ai" && aiConfirmed) {
      // Go back to detection editor
      setAiConfirmed(false);
      dispatch({ type: "PREV_STEP" });
    } else if (state.currentStep === 0) {
      // Go back to path selection
      dispatch({ type: "RESET" });
    } else {
      dispatch({ type: "PREV_STEP" });
    }
  }, [state.currentStep, state.currentPath, aiConfirmed]);

  const handleRetry = useCallback(() => {
    dispatch({ type: "SET_ERROR", payload: null });
    handleAnalyze();
  }, [handleAnalyze]);

  const handleFallbackToManual = useCallback(() => {
    dispatch({ type: "SET_ERROR", payload: null });
    dispatch({ type: "SELECT_PATH", payload: "manual" });
  }, []);

  const handleStartOver = useCallback(() => {
    dispatch({ type: "RESET" });
    setAiConfirmed(false);
  }, []);

  // ─── Determine which view to render ──────────────────────────────────────

  // Determine AI path steps (abbreviated - skip steps already detected by AI)
  const aiFollowUpSteps = useMemo(() => {
    if (state.currentPath !== "ai") return [];
    // For AI path, only show steps that AI doesn't detect:
    // ZIP code, structural changes, timeline, appliance tier
    return activeSteps.filter((step) =>
      ["zipCode", "structuralChanges", "timeline", "applianceTier"].includes(step.id),
    );
  }, [state.currentPath, activeSteps]);

  const stepsForCurrentPath =
    state.currentPath === "ai" ? aiFollowUpSteps : activeSteps;

  const isComplete = state.currentStep >= stepsForCurrentPath.length;

  // ─── No path selected → Path Selector ────────────────────────────────────

  if (state.currentPath === null) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <PathSelector onSelectPath={handleSelectPath} />
      </div>
    );
  }

  // ─── AI Path: Photo Upload (step 0, no photos analyzed yet) ──────────────

  if (
    state.currentPath === "ai" &&
    !state.aiDetections &&
    !state.isAnalyzing &&
    !state.error &&
    !aiConfirmed
  ) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <PhotoUploader
          photos={state.photos}
          onPhotosChange={handlePhotosChange}
          onAnalyze={handleAnalyze}
        />
      </div>
    );
  }

  // ─── AI Path: Analyzing state ────────────────────────────────────────────

  if (state.currentPath === "ai" && state.isAnalyzing) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#082A4B]/10">
          <Loader2 className="h-8 w-8 animate-spin text-[#082A4B]" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="font-display text-xl font-bold text-[#082A4B]">
            Analyzing your kitchen...
          </h2>
          <p className="text-sm text-muted-foreground">
            Our AI is identifying materials, dimensions, and condition from your photos.
          </p>
        </div>
      </div>
    );
  }

  // ─── AI Path: Error state ────────────────────────────────────────────────

  if (state.currentPath === "ai" && state.error && !state.aiDetections) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="font-display text-xl font-bold text-[#082A4B]">
            Something went wrong
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">{state.error}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#082A4B] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#082A4B]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <button
            type="button"
            onClick={handleFallbackToManual}
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#082A4B]/20 px-6 py-2.5 text-sm font-semibold text-[#082A4B] transition-colors hover:border-[#082A4B]/40 hover:bg-[#082A4B]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ClipboardList className="h-4 w-4" />
            Switch to Manual Estimate
          </button>
        </div>
      </div>
    );
  }

  // ─── AI Path: Detection Editor ───────────────────────────────────────────

  if (state.currentPath === "ai" && state.aiDetections && !aiConfirmed) {
    return (
      <DetectionEditor
        detections={state.aiDetections}
        onUpdate={handleDetectionUpdate}
        onConfirm={handleDetectionConfirm}
      />
    );
  }

  // ─── All steps complete → Results ────────────────────────────────────────

  if (isComplete && stepsForCurrentPath.length > 0) {
    const finalEstimate =
      liveEstimate ?? calculateKitchenEstimate(state.answers, defaultKitchenCostParams);

    return (
      <ResultsPage
        estimate={finalEstimate}
        answers={state.answers}
        aiDetections={state.aiDetections}
        onStartOver={handleStartOver}
      />
    );
  }

  // ─── Questionnaire Steps (Manual path or AI follow-up) ───────────────────

  const currentStepConfig = stepsForCurrentPath[state.currentStep];

  if (!currentStepConfig) {
    // Fallback: shouldn't happen, but handle gracefully
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const currentValue = state.answers[currentStepConfig.id as keyof typeof state.answers];

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* Progress Indicator */}
      <div className="mb-6">
        <ProgressIndicator
          currentStep={state.currentStep}
          totalSteps={stepsForCurrentPath.length}
          liveEstimate={liveEstimate}
        />
      </div>

      {/* Step Content */}
      <StepRenderer
        step={currentStepConfig}
        value={currentValue}
        onChange={handleStepAnswer}
        onNext={handleNext}
        onBack={handleBack}
      />
    </div>
  );
}
