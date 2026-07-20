# Requirements Document

## Introduction

This document defines the requirements for transforming the existing Kitchen Remodel Cost Estimator at `/kitchen-remodel-cost` into a premium, AI-powered guided experience. The new estimator offers two paths: an AI-assisted path where users upload kitchen photos for automated analysis, and a traditional manual questionnaire path. Both paths converge on a premium results page with detailed cost breakdowns, material recommendations, and exportable reports. The architecture is designed to be modular and reusable as a blueprint for future AI-assisted estimators (bathroom, roofing, etc.).

## Glossary

- **Estimator_Wizard**: The main UI component that orchestrates the estimation flow, managing navigation between steps, state collection, and path routing
- **Path_Selector**: The initial screen that presents users with the choice between "Smart Estimate with AI" and "Manual Estimate" paths
- **Photo_Uploader**: The component responsible for accepting, validating, and previewing kitchen photo uploads (2–6 images)
- **AI_Analyzer**: The server-side module that sends uploaded photos to an AI vision API and returns structured detection results (materials, dimensions, condition assessments)
- **Detection_Editor**: The UI component that displays AI detection results in an editable format, allowing users to correct or confirm AI observations
- **Step_Renderer**: The component that displays one question per screen with visual card options, handles auto-advance on selection, and manages smooth transitions
- **Cost_Engine**: The calculation module that computes cost estimates based on collected answers (from either path), applying regional multipliers, material costs, and scope adjustments
- **Results_Page**: The premium results screen displaying the full cost breakdown, AI observations, material recommendations, contractor questions, and export options
- **PDF_Generator**: The module that generates a downloadable PDF report from the estimation results
- **Progress_Indicator**: The UI element showing the user's advancement through the estimation flow, including a live running estimate panel
- **Project_Store**: The client-side state management that persists estimation data and allows users to save and resume projects

## Requirements

### Requirement 1: Path Selection Entry Point

**User Story:** As a homeowner, I want to choose between an AI-powered photo analysis path and a traditional questionnaire path, so that I can use the estimation method that best fits my needs.

#### Acceptance Criteria

1. WHEN a user navigates to `/kitchen-remodel-cost`, THE Path_Selector SHALL display two clearly differentiated path options: "Smart Estimate with AI" and "Manual Estimate"
2. THE Path_Selector SHALL display a brief description of each path explaining the benefits and process
3. WHEN the user selects "Smart Estimate with AI", THE Estimator_Wizard SHALL navigate to the Photo_Uploader step
4. WHEN the user selects "Manual Estimate", THE Estimator_Wizard SHALL navigate to the first questionnaire step
5. THE Path_Selector SHALL render each option as a large visual card with an icon, title, description, and estimated completion time

### Requirement 2: Photo Upload for AI Analysis

**User Story:** As a homeowner using the AI path, I want to upload photos of my kitchen, so that the AI can automatically detect materials, dimensions, and condition.

#### Acceptance Criteria

1. THE Photo_Uploader SHALL accept between 2 and 6 image files per estimation session
2. WHEN a user uploads fewer than 2 photos, THE Photo_Uploader SHALL display a message indicating that a minimum of 2 photos is required and disable the continue action
3. WHEN a user attempts to upload more than 6 photos, THE Photo_Uploader SHALL reject the additional uploads and display a message indicating the maximum has been reached
4. THE Photo_Uploader SHALL accept JPEG, PNG, and WebP image formats
5. WHEN a user uploads a file that is not a JPEG, PNG, or WebP image, THE Photo_Uploader SHALL reject the file and display a format-specific error message
6. THE Photo_Uploader SHALL enforce a maximum file size of 10 MB per image
7. WHEN a user uploads a file exceeding 10 MB, THE Photo_Uploader SHALL reject the file and display an error message indicating the size limit
8. THE Photo_Uploader SHALL display a thumbnail preview of each uploaded photo with a remove button
9. THE Photo_Uploader SHALL support drag-and-drop upload in addition to file picker selection
10. WHEN the user has uploaded 2 or more valid photos, THE Photo_Uploader SHALL enable the "Analyze My Kitchen" continue action

### Requirement 3: AI Photo Analysis

**User Story:** As a homeowner, I want the AI to analyze my kitchen photos and identify existing materials, approximate dimensions, and overall condition, so that I get a faster and more accurate estimate with fewer questions.

#### Acceptance Criteria

1. WHEN the user triggers analysis, THE AI_Analyzer SHALL send the uploaded photos to the AI vision API with a structured prompt requesting material identification, dimension estimation, and condition assessment
2. WHILE the AI_Analyzer is processing photos, THE Estimator_Wizard SHALL display a loading state with progress messaging (e.g., "Analyzing your kitchen...")
3. WHEN the AI_Analyzer completes analysis, THE AI_Analyzer SHALL return a structured result containing: detected cabinet type, countertop material, flooring material, approximate kitchen size, overall condition rating, and any notable observations
4. IF the AI vision API returns an error or times out after 30 seconds, THEN THE AI_Analyzer SHALL display an error message and offer the user the option to retry or switch to the Manual Estimate path
5. THE AI_Analyzer SHALL use the OpenRouter API endpoint with the VITE_SK_API_KEY environment variable for authentication

### Requirement 4: Editable AI Detection Results

**User Story:** As a homeowner, I want to review and correct the AI's detection results before proceeding, so that my estimate is based on accurate information.

#### Acceptance Criteria

1. WHEN analysis completes, THE Detection_Editor SHALL display each detected attribute (cabinet type, countertop material, flooring, kitchen size, condition) as an editable field with the AI's detected value pre-filled
2. THE Detection_Editor SHALL display a confidence indicator for each detected attribute (high, medium, low)
3. WHEN the user modifies a detected value, THE Detection_Editor SHALL update the estimation state with the user-corrected value
4. THE Detection_Editor SHALL provide dropdown or card-based selection options for each editable field consistent with the visual card style used in the manual path
5. WHEN the user confirms the detection results, THE Estimator_Wizard SHALL proceed to the abbreviated follow-up questions relevant to the AI path

### Requirement 5: Manual Questionnaire Path

**User Story:** As a homeowner using the manual path, I want to answer step-by-step questions about my kitchen remodel, so that I receive an accurate cost estimate without photo upload.

#### Acceptance Criteria

1. THE Step_Renderer SHALL present one question per screen following the TurboTax/Apple onboarding visual style
2. THE Step_Renderer SHALL display answer options as large visual cards with icons, labels, and supplementary details (e.g., price impact indicators)
3. WHEN the user selects a single-choice answer, THE Step_Renderer SHALL auto-advance to the next step after a 250ms delay
4. WHEN the user is on a multi-select or text-input step, THE Step_Renderer SHALL display a "Continue" button to advance manually
5. THE Estimator_Wizard SHALL collect the following information in the manual path: ZIP code, kitchen size, remodel scope, cabinet type, countertop material, appliance tier, structural changes, and timeline flexibility
6. THE Estimator_Wizard SHALL skip irrelevant steps based on prior answers (e.g., skip structural questions for cosmetic scope)
7. WHEN the user navigates backward, THE Estimator_Wizard SHALL restore previously selected answers for that step

### Requirement 6: Progress and Live Estimate Display

**User Story:** As a homeowner, I want to see my progress and a running cost estimate as I answer questions, so that I stay engaged and understand how each choice impacts cost.

#### Acceptance Criteria

1. THE Progress_Indicator SHALL display a progress bar showing the percentage of steps completed relative to the total steps in the active path
2. THE Progress_Indicator SHALL display a step counter label (e.g., "Step 3 of 7")
3. WHEN the user has completed at least one cost-impacting step, THE Progress_Indicator SHALL display a live running estimate showing the current mid-point estimate and the low-high range
4. WHEN the user changes an answer, THE Cost_Engine SHALL recalculate the live estimate within 100ms and update the Progress_Indicator display
5. THE Progress_Indicator SHALL animate transitions smoothly when the estimate value changes

### Requirement 7: Premium Results Page

**User Story:** As a homeowner, I want a detailed, premium-quality results page showing cost breakdowns, AI observations, material recommendations, and contractor preparation questions, so that I can make informed renovation decisions.

#### Acceptance Criteria

1. WHEN the user completes all required steps, THE Results_Page SHALL display the estimated cost as a prominent headline figure with a low-to-high range
2. THE Results_Page SHALL display an itemized cost breakdown showing categories (cabinets, countertops, labor, appliances, structural, permits, design/contingency) with dollar amounts and percentage bars
3. WHERE the user completed the AI path, THE Results_Page SHALL display an "AI Observations" section summarizing detected materials, condition notes, and any recommendations generated from photo analysis
4. THE Results_Page SHALL display a "Material Recommendations" section with 2–3 alternative material options and their cost impact relative to the selected materials
5. THE Results_Page SHALL display a "Questions for Your Contractor" section with 5–7 project-relevant questions the homeowner should ask when getting quotes
6. THE Results_Page SHALL display ZIP-adjusted pricing attribution and the current data date
7. THE Results_Page SHALL include a "Start Over" action that resets the wizard to the Path_Selector

### Requirement 8: PDF Export and Project Save

**User Story:** As a homeowner, I want to download my estimate as a PDF and save my project for later reference, so that I can share estimates with contractors and revisit my project data.

#### Acceptance Criteria

1. WHEN the user clicks "Download PDF" on the Results_Page, THE PDF_Generator SHALL generate a formatted PDF document containing the full estimation results, cost breakdown, and any AI observations
2. THE PDF_Generator SHALL include the CostReno branding, generation date, and a disclaimer about estimate accuracy
3. WHEN the user clicks "Save Project", THE Project_Store SHALL persist the estimation data to browser local storage with a unique project identifier
4. WHEN a user returns to `/kitchen-remodel-cost` with a previously saved project, THE Estimator_Wizard SHALL offer to resume or start a new estimate
5. IF the browser does not support local storage, THEN THE Project_Store SHALL disable the save functionality and display a message informing the user

### Requirement 9: Responsive and Accessible Design

**User Story:** As a homeowner on any device, I want the estimator to work seamlessly on mobile, tablet, and desktop, so that I can get an estimate from wherever I am.

#### Acceptance Criteria

1. THE Estimator_Wizard SHALL render all steps and results in a responsive layout that adapts to viewport widths from 320px to 1440px
2. THE Step_Renderer SHALL stack visual cards vertically on viewports below 640px and allow side-by-side layouts on wider viewports where appropriate
3. THE Photo_Uploader SHALL support touch-based file selection on mobile devices
4. THE Estimator_Wizard SHALL meet WCAG 2.1 Level AA requirements for color contrast, keyboard navigation, and screen reader compatibility
5. THE Step_Renderer SHALL apply smooth transition animations (fade and slide) between steps with a duration not exceeding 300ms

### Requirement 10: Modular Architecture for Reuse

**User Story:** As a development team, I want the estimator architecture to be modular and configurable, so that future AI-assisted estimators (bathroom, roofing) can be built by reusing the same components with different configuration.

#### Acceptance Criteria

1. THE Estimator_Wizard SHALL accept a project-type configuration object that defines the step sequence, available answer options, and cost calculation parameters
2. THE Step_Renderer SHALL render steps dynamically based on configuration rather than hard-coded component references
3. THE AI_Analyzer SHALL accept a configurable prompt template that can be adapted for different project types (kitchen, bathroom, roofing)
4. THE Cost_Engine SHALL accept a calculation configuration that defines base costs, material multipliers, and regional adjustments per project type
5. THE Results_Page SHALL accept a configuration that defines which sections to display and what content to generate based on project type
