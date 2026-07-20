# Implementation Plan: AI Kitchen Estimator

## Overview

Transform the existing `/kitchen-remodel-cost` page into a premium AI-powered guided estimation experience with two paths (AI photo analysis and manual questionnaire) converging on a shared premium results page. Built with TanStack Start + React, Tailwind CSS v4, shadcn/ui, and fast-check for property-based testing.

## Tasks

- [x] 1. Set up core types, interfaces, and configuration
  - [x] 1.1 Create the KitchenEstimateAnswers, AIDetectionResult, and KitchenLiveEstimate TypeScript interfaces
    - Create `src/lib/kitchen-estimator/types.ts` with all shared types from the design document
    - Include: KitchenEstimateAnswers, AIDetectionResult, DetectedAttribute, KitchenLiveEstimate, CostBreakdownItem, MaterialRecommendation, SavedProject
    - _Requirements: 10.1, 10.4_

  - [x] 1.2 Create the EstimatorConfig, StepConfig, and CardOption configuration types and default kitchen configuration
    - Create `src/lib/kitchen-estimator/config.ts` with EstimatorConfig, StepConfig, CardOption, PathOption interfaces
    - Define the default kitchen step sequence with all manual path steps (ZIP code, kitchen size, remodel scope, cabinet type, countertop material, appliance tier, structural changes, timeline)
    - Include `showIf` conditional logic for step filtering (e.g., skip structural questions for cosmetic scope)
    - Include `autoAdvance` flags per step type
    - _Requirements: 5.5, 5.6, 10.1, 10.2_

  - [x] 1.3 Create the KitchenCostParams configuration with base costs, material multipliers, and regional adjustments
    - Create `src/lib/kitchen-estimator/cost-params.ts` with kitchen-specific cost calculation parameters
    - Define base costs for each category (cabinets, countertops, flooring, labor, appliances, structural, permits)
    - Define material multipliers and regional multipliers
    - Define scope factors (cosmetic, midrange, full)
    - _Requirements: 10.4_

- [x] 2. Implement the Cost Engine and core logic
  - [x] 2.1 Implement the calculateKitchenEstimate function
    - Create `src/lib/kitchen-estimator/kitchen-cost-engine.ts`
    - Accept KitchenEstimateAnswers and KitchenCostParams, return KitchenLiveEstimate
    - Apply regional multipliers based on state/ZIP, material cost adjustments, scope factors
    - Generate cost breakdown with categories (cabinets, countertops, labor, appliances, structural, permits, contingency)
    - Generate material recommendations (2-3 alternatives with cost impact)
    - Generate contractor questions (5-7 relevant questions)
    - Ensure low ≤ mid ≤ high invariant, clamp minimum $5,000 and maximum $250,000
    - _Requirements: 6.3, 6.4, 10.4_

  - [ ]* 2.2 Write property test: Cost Engine Estimate Ordering Invariant
    - **Property 7: Cost Engine Estimate Ordering Invariant**
    - Create `src/lib/kitchen-estimator/__tests__/kitchen-cost-engine.property.test.ts`
    - Use fast-check to generate arbitrary KitchenEstimateAnswers and verify low ≤ mid ≤ high, all non-negative, breakdown percentages sum to ~100% (±2%)
    - **Validates: Requirements 10.4, 6.3**

  - [x] 2.3 Implement file validation utility functions
    - Create `src/lib/kitchen-estimator/file-validation.ts`
    - Implement `validateFile(file: File)` returning validation result with error messages
    - Check MIME type (image/jpeg, image/png, image/webp) and size (≤ 10 MB)
    - Implement `canContinue(files: File[])` returning true when 2-6 valid files present
    - _Requirements: 2.1, 2.4, 2.5, 2.6, 2.7, 2.10_

  - [ ]* 2.4 Write property test: File Validation Correctness
    - **Property 1: File Validation Correctness**
    - Create `src/lib/kitchen-estimator/__tests__/file-validation.property.test.ts`
    - Use fast-check to generate arbitrary file objects (varying MIME types and sizes) and verify acceptance iff MIME ∈ {jpeg, png, webp} AND size ≤ 10MB
    - Verify continue enabled iff 2 ≤ accepted count ≤ 6
    - **Validates: Requirements 2.1, 2.4, 2.5, 2.6, 2.10**

  - [x] 2.5 Implement the Project_Store with localStorage persistence
    - Create `src/lib/kitchen-estimator/project-store.ts`
    - Implement save, load, list, remove, hasExisting methods
    - Handle localStorage unavailability gracefully
    - Handle quota exceeded and corrupted data errors
    - _Requirements: 8.3, 8.4, 8.5_

  - [ ]* 2.6 Write property test: Project Save/Load Round-Trip
    - **Property 8: Project Save/Load Round-Trip**
    - Create `src/lib/kitchen-estimator/__tests__/project-store.property.test.ts`
    - Use fast-check to generate arbitrary SavedProject objects, save then load by ID, verify equivalence of answers, aiDetections, estimate, path, projectType
    - **Validates: Requirements 8.3**

- [x] 3. Implement the wizard state management and step filtering
  - [x] 3.1 Implement the wizard reducer and state machine
    - Create `src/lib/kitchen-estimator/wizard-reducer.ts`
    - Define WizardState interface and WizardAction union type
    - Implement `wizardReducer` with actions: SELECT_PATH, SET_PHOTOS, SET_AI_RESULT, UPDATE_ANSWER, NEXT_STEP, PREV_STEP, RESET, SET_ERROR, SET_ANALYZING
    - Ensure backward navigation preserves previously entered answers
    - _Requirements: 1.3, 1.4, 5.7_

  - [ ]* 3.2 Write property test: Navigation State Preservation
    - **Property 5: Navigation State Preservation**
    - Create `src/lib/kitchen-estimator/__tests__/wizard-reducer.property.test.ts`
    - Use fast-check to generate sequences of wizard actions with answers, verify navigating backward restores exact previously entered values
    - **Validates: Requirements 5.7**

  - [x] 3.3 Implement step filtering logic based on showIf conditions
    - Create `src/lib/kitchen-estimator/step-filter.ts`
    - Implement `getActiveSteps(steps: StepConfig[], answers: KitchenEstimateAnswers): StepConfig[]`
    - Filter steps based on showIf evaluations against current answers
    - _Requirements: 5.6, 10.2_

  - [ ]* 3.4 Write property test: Conditional Step Filtering
    - **Property 4: Conditional Step Filtering**
    - Create `src/lib/kitchen-estimator/__tests__/step-filtering.property.test.ts`
    - Use fast-check to generate arbitrary KitchenEstimateAnswers, verify active steps include only those whose showIf evaluates true (or have no showIf), and exclude all where showIf is false
    - **Validates: Requirements 5.6**

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement the AI analysis server function and response parser
  - [x] 5.1 Create the TanStack Start server function for AI photo analysis
    - Create `src/server/analyze-kitchen.ts` (or appropriate server function location for TanStack Start)
    - Implement server function that accepts base64-encoded images
    - Construct the OpenRouter API request with vision model and structured prompt template
    - Use VITE_SK_API_KEY environment variable for authentication
    - Handle timeout (30 seconds), non-200 responses, and invalid response formats
    - Return structured AIDetectionResult or error
    - _Requirements: 3.1, 3.2, 3.4, 3.5_

  - [x] 5.2 Implement AI response parser to extract structured detections
    - Create `src/lib/kitchen-estimator/ai-response-parser.ts`
    - Parse AI vision API JSON response into AIDetectionResult
    - Map confidence scores to "high" | "medium" | "low" categories
    - Extract observations array
    - Handle malformed responses gracefully with fallback values
    - _Requirements: 3.3_

  - [ ]* 5.3 Write property test: AI Response Parsing Completeness
    - **Property 2: AI Response Parsing Completeness**
    - Create `src/lib/kitchen-estimator/__tests__/ai-response-parser.property.test.ts`
    - Use fast-check to generate valid JSON structures with all required fields, verify parser extracts all fields with non-null values and valid confidence levels
    - **Validates: Requirements 3.3**

- [x] 6. Build the UI components - Path Selector, Photo Uploader, and Detection Editor
  - [x] 6.1 Implement the Path_Selector component
    - Create `src/components/kitchen-estimator/PathSelector.tsx`
    - Render two large visual cards: "Smart Estimate with AI" and "Manual Estimate"
    - Each card has icon, title, description, estimated time, and feature list
    - Use shadcn/ui Card component styled with Tailwind CSS v4
    - Use Plus Jakarta Sans for headings, Inter for body text
    - Primary color (#082A4B) for card borders/text, green accent only for the CTA button if applicable
    - _Requirements: 1.1, 1.2, 1.5_

  - [x] 6.2 Implement the Photo_Uploader component
    - Create `src/components/kitchen-estimator/PhotoUploader.tsx`
    - Support drag-and-drop and file picker selection
    - Display thumbnail previews with remove button for each uploaded photo
    - Show inline error messages for invalid format or oversized files
    - Show message when max photos (6) reached
    - Enable "Analyze My Kitchen" button when 2+ valid photos uploaded
    - Support touch-based file selection on mobile
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 9.3_

  - [x] 6.3 Implement the Detection_Editor component
    - Create `src/components/kitchen-estimator/DetectionEditor.tsx`
    - Display each detected attribute as an editable field with AI value pre-filled
    - Show confidence indicator (high/medium/low) per attribute with visual badge
    - Provide dropdown or card-based selection options consistent with manual path style
    - Update estimation state on user modification
    - Include "Confirm & Continue" button
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]* 6.4 Write property test: Detection Edit State Consistency
    - **Property 3: Detection Edit State Consistency**
    - Create `src/lib/kitchen-estimator/__tests__/detection-edit.property.test.ts`
    - Use fast-check to generate detection fields and new values, verify modified values are reflected in KitchenEstimateAnswers and Cost_Engine uses modified (not original) values
    - **Validates: Requirements 4.3**

- [x] 7. Build the UI components - Step Renderer and Progress Indicator
  - [x] 7.1 Implement the Step_Renderer component
    - Create `src/components/kitchen-estimator/StepRenderer.tsx`
    - Render one question per screen with visual card options (icons, labels, price impact indicators)
    - Implement auto-advance (250ms delay) for single-choice steps
    - Display "Continue" button for multi-select and text-input steps
    - Apply smooth fade/slide transitions between steps (≤ 300ms)
    - Stack cards vertically on viewports < 640px, side-by-side on wider
    - Use Plus Jakarta Sans for step titles, Inter for descriptions
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 9.1, 9.2, 9.5_

  - [x] 7.2 Implement the Progress_Indicator component with live estimate display
    - Create `src/components/kitchen-estimator/ProgressIndicator.tsx`
    - Show progress bar (percentage of steps completed)
    - Show step counter label ("Step X of Y")
    - Display live running estimate (mid-point and low-high range) after first cost-impacting answer
    - Animate estimate value transitions smoothly
    - Recalculate within 100ms on answer changes
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 7.3 Write property test: Progress Calculation Accuracy
    - **Property 6: Progress Calculation Accuracy**
    - Create `src/lib/kitchen-estimator/__tests__/progress-calculation.property.test.ts`
    - Use fast-check to generate step index n and total t (0 ≤ n < t, t > 0), verify percentage = Math.round(((n+1)/t)*100) and label = "Step {n+1} of {t}"
    - **Validates: Requirements 6.1, 6.2**

- [x] 8. Build the Estimator_Wizard orchestrator and wire wizard flow
  - [x] 8.1 Implement the Estimator_Wizard root component
    - Create `src/components/kitchen-estimator/EstimatorWizard.tsx`
    - Use `useReducer` with the wizard reducer for state management
    - Render appropriate step component based on current state (path selection, photo upload, AI analyzing, detection editor, step renderer, results)
    - Pass configuration object to child components
    - Handle loading state during AI analysis
    - Integrate Cost_Engine for live estimate updates
    - _Requirements: 1.3, 1.4, 3.2, 5.5, 5.6, 5.7, 10.1_

  - [x] 8.2 Update the `/kitchen-remodel-cost` route to use the new Estimator_Wizard
    - Modify the existing route file to render the EstimatorWizard with kitchen configuration
    - Integrate Project_Store for save/resume detection on page load
    - Show resume prompt if saved project exists
    - _Requirements: 1.1, 8.4_

- [x] 9. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Build the Results Page and PDF Export
  - [x] 10.1 Implement the Results_Page component
    - Create `src/components/kitchen-estimator/ResultsPage.tsx`
    - Display prominent headline estimate figure with low-to-high range
    - Render itemized cost breakdown with category labels, dollar amounts, and percentage bars
    - Display "AI Observations" section (when AI path used) with detected materials and condition notes
    - Display "Material Recommendations" section with 2-3 alternatives and cost impact
    - Display "Questions for Your Contractor" section with 5-7 relevant questions
    - Show ZIP-adjusted pricing attribution and data date
    - Include "Start Over" action to reset wizard
    - Include "Download PDF" and "Save Project" action buttons (green accent for primary CTA)
    - Responsive layout adapting from 320px to 1440px
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 8.1, 8.3, 9.1_

  - [x] 10.2 Implement the PDF_Generator module
    - Create `src/lib/kitchen-estimator/pdf-generator.ts`
    - Generate formatted PDF with full estimation results, cost breakdown, AI observations
    - Include CostReno branding, generation date, and estimate accuracy disclaimer
    - Use browser print-to-PDF or lightweight library approach
    - _Requirements: 8.1, 8.2_

- [x] 11. Accessibility and responsive polish
  - [x] 11.1 Add WCAG 2.1 Level AA compliance across all wizard components
    - Ensure proper color contrast ratios with primary (#082A4B) and accent (#03A44D) colors
    - Add keyboard navigation support (focus management, arrow key navigation for cards)
    - Add ARIA labels, roles, and live regions for screen reader compatibility
    - Add focus trap within wizard steps
    - Test and fix issues at 320px, 768px, and 1440px breakpoints
    - _Requirements: 9.1, 9.4_

- [x] 12. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties defined in the design document
- Unit tests validate specific examples and edge cases
- The existing `src/lib/estimator-engine.ts` provides the foundation — the new kitchen cost engine extends its patterns
- All UI components use shadcn/ui + Tailwind CSS v4 with the CostReno brand system (primary: #082A4B, accent: #03A44D sparingly)
- Display font: Plus Jakarta Sans, Body font: Inter

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3"] },
    { "id": 1, "tasks": ["2.1", "2.3", "2.5", "3.1"] },
    { "id": 2, "tasks": ["2.2", "2.4", "2.6", "3.2", "3.3"] },
    { "id": 3, "tasks": ["3.4", "5.1", "5.2"] },
    { "id": 4, "tasks": ["5.3", "6.1", "6.2", "6.3"] },
    { "id": 5, "tasks": ["6.4", "7.1", "7.2"] },
    { "id": 6, "tasks": ["7.3", "8.1"] },
    { "id": 7, "tasks": ["8.2"] },
    { "id": 8, "tasks": ["10.1", "10.2"] },
    { "id": 9, "tasks": ["11.1"] }
  ]
}
```
