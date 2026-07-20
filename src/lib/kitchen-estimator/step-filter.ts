import type { StepConfig } from "./config";
import type { KitchenEstimateAnswers } from "./types";

/**
 * Returns the list of active steps based on current answers.
 *
 * Steps with no `showIf` condition are always included.
 * Steps whose `showIf` returns false for the given answers are excluded.
 */
export function getActiveSteps(
  steps: StepConfig[],
  answers: KitchenEstimateAnswers
): StepConfig[] {
  return steps.filter((step) => {
    if (!step.showIf) {
      return true;
    }
    return step.showIf(answers);
  });
}
