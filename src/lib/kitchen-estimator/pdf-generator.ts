// ─── PDF Generator ───────────────────────────────────────────────────────────
// Client-side PDF generation using the browser's print-to-PDF capability.
// Opens a new window with styled HTML content and triggers the print dialog.

import type {
  KitchenLiveEstimate,
  KitchenEstimateAnswers,
  AIDetectionResult,
  CostBreakdownItem,
  MaterialRecommendation,
} from "./types";

/**
 * Input data required to generate the PDF report.
 */
export interface PDFGeneratorInput {
  estimate: KitchenLiveEstimate;
  answers: KitchenEstimateAnswers;
  aiDetections?: AIDetectionResult;
}

/**
 * Formats a number as USD currency (e.g. $12,500).
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Returns the current date formatted for display (e.g. "January 15, 2025").
 */
function getFormattedDate(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Builds the cost breakdown table rows as HTML.
 */
function buildBreakdownRows(breakdown: CostBreakdownItem[]): string {
  return breakdown
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb;">${item.category}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(item.amount)}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.percentage}%</td>
      </tr>`,
    )
    .join("");
}

/**
 * Builds the AI observations section HTML (only shown for AI path).
 */
function buildAIObservationsSection(
  aiDetections: AIDetectionResult,
  aiObservations?: string[],
): string {
  const observations = aiObservations ?? aiDetections.observations;
  if (!observations || observations.length === 0) return "";

  const detectionsList = `
    <div style="margin-bottom: 16px;">
      <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #082A4B;">Detected Attributes</h4>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr>
          <td style="padding: 6px 8px; background: #f9fafb; font-weight: 600;">Cabinet Type</td>
          <td style="padding: 6px 8px; background: #f9fafb;">${aiDetections.cabinetType.value} (${aiDetections.cabinetType.confidence} confidence)</td>
        </tr>
        <tr>
          <td style="padding: 6px 8px; font-weight: 600;">Countertop</td>
          <td style="padding: 6px 8px;">${aiDetections.countertopMaterial.value} (${aiDetections.countertopMaterial.confidence} confidence)</td>
        </tr>
        <tr>
          <td style="padding: 6px 8px; background: #f9fafb; font-weight: 600;">Flooring</td>
          <td style="padding: 6px 8px; background: #f9fafb;">${aiDetections.flooringMaterial.value} (${aiDetections.flooringMaterial.confidence} confidence)</td>
        </tr>
        <tr>
          <td style="padding: 6px 8px; font-weight: 600;">Kitchen Size</td>
          <td style="padding: 6px 8px;">${aiDetections.kitchenSize.value} (${aiDetections.kitchenSize.confidence} confidence)</td>
        </tr>
        <tr>
          <td style="padding: 6px 8px; background: #f9fafb; font-weight: 600;">Condition</td>
          <td style="padding: 6px 8px; background: #f9fafb;">${aiDetections.overallCondition.value} (${aiDetections.overallCondition.confidence} confidence)</td>
        </tr>
      </table>
    </div>`;

  const observationsList = observations
    .map((obs) => `<li style="margin-bottom: 6px;">${obs}</li>`)
    .join("");

  return `
    <div style="margin-top: 32px;">
      <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 18px; color: #082A4B; margin: 0 0 16px 0; padding-bottom: 8px; border-bottom: 2px solid #082A4B;">
        AI Observations
      </h3>
      ${detectionsList}
      <h4 style="margin: 16px 0 8px 0; font-size: 14px; color: #082A4B;">Observations</h4>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #374151;">
        ${observationsList}
      </ul>
    </div>`;
}

/**
 * Builds the material recommendations section HTML.
 */
function buildMaterialRecommendations(recommendations: MaterialRecommendation[]): string {
  if (!recommendations || recommendations.length === 0) return "";

  const rows = recommendations
    .map(
      (rec) => `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb;">${rec.current}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb;">${rec.alternative}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: ${rec.costDifference > 0 ? "#dc2626" : "#03A44D"};">
          ${rec.costDifference > 0 ? "+" : ""}${formatCurrency(rec.costDifference)}
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">${rec.description}</td>
      </tr>`,
    )
    .join("");

  return `
    <div style="margin-top: 32px;">
      <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 18px; color: #082A4B; margin: 0 0 16px 0; padding-bottom: 8px; border-bottom: 2px solid #082A4B;">
        Material Recommendations
      </h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <thead>
          <tr style="background: #f9fafb;">
            <th style="padding: 10px 12px; text-align: left; font-weight: 600; color: #082A4B;">Current</th>
            <th style="padding: 10px 12px; text-align: left; font-weight: 600; color: #082A4B;">Alternative</th>
            <th style="padding: 10px 12px; text-align: right; font-weight: 600; color: #082A4B;">Cost Impact</th>
            <th style="padding: 10px 12px; text-align: left; font-weight: 600; color: #082A4B;">Details</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>`;
}

/**
 * Builds the contractor questions section HTML.
 */
function buildContractorQuestions(questions: string[]): string {
  if (!questions || questions.length === 0) return "";

  const items = questions
    .map(
      (q, i) =>
        `<li style="margin-bottom: 8px; padding-left: 4px;"><span style="font-weight: 600; color: #082A4B;">${i + 1}.</span> ${q}</li>`,
    )
    .join("");

  return `
    <div style="margin-top: 32px;">
      <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 18px; color: #082A4B; margin: 0 0 16px 0; padding-bottom: 8px; border-bottom: 2px solid #082A4B;">
        Questions for Your Contractor
      </h3>
      <ol style="margin: 0; padding-left: 20px; font-size: 13px; color: #374151; list-style: none;">
        ${items}
      </ol>
    </div>`;
}

/**
 * Builds the full HTML document for PDF generation.
 */
function buildPDFHTML(data: PDFGeneratorInput): string {
  const { estimate, answers, aiDetections } = data;
  const date = getFormattedDate();

  const locationText = [answers.city, answers.state, answers.zipCode].filter(Boolean).join(", ");

  const aiObservationsHTML =
    answers.path === "ai" && aiDetections
      ? buildAIObservationsSection(aiDetections, answers.aiObservations)
      : "";

  const materialRecsHTML = buildMaterialRecommendations(estimate.materialRecommendations);

const contractorQuestionsHTML = buildContractorQuestions(estimate.contractorQuestions);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kitchen Remodel Estimate - CostReno</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #374151;
      line-height: 1.6;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }

    @media print {
      body {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <!-- CostReno Header/Branding -->
  <header style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 24px; border-bottom: 3px solid #082A4B; margin-bottom: 32px;">
    <div>
      <h1 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 28px; font-weight: 700; color: #082A4B; margin: 0;">
        CostReno
      </h1>
      <p style="font-size: 12px; color: #6b7280; margin-top: 4px;">Kitchen Remodel Cost Estimate</p>
    </div>
    <div style="text-align: right;">
      <p style="font-size: 13px; color: #6b7280;">Generated: ${date}</p>
      ${locationText ? `<p style="font-size: 13px; color: #6b7280;">${locationText}</p>` : ""}
    </div>
  </header>

  <!-- Overall Estimate -->
  <section style="background: #f0f9f4; border: 1px solid #d1fae5; border-radius: 8px; padding: 24px; margin-bottom: 32px; text-align: center;">
    <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">Estimated Total Cost</p>
    <h2 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 36px; font-weight: 700; color: #082A4B; margin: 0;">
      ${formatCurrency(estimate.mid)}
    </h2>
    <p style="font-size: 16px; color: #374151; margin-top: 8px;">
      Range: ${formatCurrency(estimate.low)} – ${formatCurrency(estimate.high)}
    </p>
  </section>

  <!-- Cost Breakdown Table -->
  <section style="margin-bottom: 32px;">
    <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 18px; color: #082A4B; margin: 0 0 16px 0; padding-bottom: 8px; border-bottom: 2px solid #082A4B;">
      Cost Breakdown
    </h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
      <thead>
        <tr style="background: #f9fafb;">
          <th style="padding: 10px 12px; text-align: left; font-weight: 600; color: #082A4B;">Category</th>
          <th style="padding: 10px 12px; text-align: right; font-weight: 600; color: #082A4B;">Amount</th>
          <th style="padding: 10px 12px; text-align: right; font-weight: 600; color: #082A4B;">% of Total</th>
        </tr>
      </thead>
      <tbody>
        ${buildBreakdownRows(estimate.breakdown)}
      </tbody>
      <tfoot>
        <tr style="background: #f0f9f4; font-weight: 600;">
          <td style="padding: 10px 12px; color: #082A4B;">Total (Mid Estimate)</td>
          <td style="padding: 10px 12px; text-align: right; color: #082A4B;">${formatCurrency(estimate.mid)}</td>
          <td style="padding: 10px 12px; text-align: right; color: #082A4B;">100%</td>
        </tr>
      </tfoot>
    </table>
  </section>

  <!-- AI Observations (conditional) -->
  ${aiObservationsHTML}

  <!-- Material Recommendations -->
  ${materialRecsHTML}

  <!-- Contractor Questions -->
  ${contractorQuestionsHTML}

  <!-- Disclaimer -->
  <footer style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
    <p style="font-size: 11px; color: #9ca3af; line-height: 1.5;">
      <strong>Disclaimer:</strong> This estimate is for planning purposes only. Actual costs may vary based on local conditions, specific project requirements, and contractor pricing.
    </p>
    <p style="font-size: 11px; color: #9ca3af; margin-top: 8px;">
      © ${new Date().getFullYear()} CostReno. All rights reserved.
    </p>
  </footer>
</body>
</html>`;
}

/**
 * Generates a PDF by opening a new browser window with styled HTML
 * and triggering the browser's native print dialog (print-to-PDF).
 *
 * @param data - The estimation data to include in the PDF
 */
export function generatePDF(data: PDFGeneratorInput): void {
  const html = buildPDFHTML(data);

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    // Fallback: if popup was blocked, try using an iframe approach
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(html);
      iframeDoc.close();

      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();

      // Clean up the iframe after printing
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }
    return;
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  // Wait for fonts and content to load before triggering print
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };

  // Fallback for browsers where onload doesn't fire reliably
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 500);
}
