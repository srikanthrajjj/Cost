/**
 * Utility functions for downloading reports and handling email submissions
 */

interface DownloadOptions {
  filename: string;
  email: string;
  reportType: "estimate" | "analysis";
  data?: Record<string, any>;
}

// Helper function to safely display values
const safeDisplay = (value: any, fallback: string = "—"): string => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "object") return fallback;
  return String(value);
};

// Helper to format currency
const fmt = (n: number) => "$" + Math.round(n).toLocaleString();

// Generate report ID
const generateReportId = () => {
  return "CR-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
};

/**
 * Generate a professional HTML report for print/PDF
 */
export async function generateReport(
  reportType: "estimate" | "analysis",
  data: Record<string, any>,
): Promise<Blob> {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const reportId = generateReportId();

  // Sort red flags by severity
  const sortedRedFlags = (data.redFlagsList || [])
    .filter((f: any) => f)
    .sort((a: any, b: any) => {
      const severityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
      const aSev = severityOrder[a.severity] ?? 3;
      const bSev = severityOrder[b.severity] ?? 3;
      return aSev - bSev;
    });

  // Sort missing scope by priority
  const sortedMissingScope = (data.missingScope || [])
    .filter((m: any) => m)
    .sort((a: any, b: any) => {
      const priorityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
      const aPrio = priorityOrder[a.priority] ?? 3;
      const bPrio = priorityOrder[b.priority] ?? 3;
      return aPrio - bPrio;
    });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CostReno — ${data.projectType || "Quote Analysis"} Report</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body { 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
      color: #1f2937; 
      line-height: 1.5; 
      padding: 0;
      background: #fff;
    }
    
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
      .page { 
        box-shadow: none !important; 
        margin: 0 !important;
        max-width: 100% !important;
      }
    }
    
    .page { 
      max-width: 850px; 
      margin: 40px auto; 
      padding: 50px 60px;
      background: #fff;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    /* Header */
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 20px;
      border-bottom: 3px solid #082A4B;
      margin-bottom: 30px;
    }
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .logo-text {
      font-family: 'Inter', sans-serif;
      font-size: 24px;
      font-weight: 800;
      color: #082A4B;
      letter-spacing: -0.5px;
    }
    
    .header-meta {
      text-align: right;
      font-size: 11px;
      color: #6b7280;
    }
    
    .report-id {
      font-weight: 600;
      color: #082A4B;
    }
    
    /* Cover Section */
    .cover {
      background: linear-gradient(135deg, #082A4B 0%, #0a3a5f 100%);
      border-radius: 16px;
      padding: 40px;
      color: white;
      margin-bottom: 30px;
    }
    
    .cover-title {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 2px;
      opacity: 0.8;
      margin-bottom: 8px;
    }
    
    .cover-main {
      font-size: 36px;
      font-weight: 800;
      margin-bottom: 12px;
    }
    
    .cover-subtitle {
      font-size: 16px;
      opacity: 0.9;
      margin-bottom: 20px;
    }
    
    .cover-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-top: 24px;
    }
    
    .cover-stat {
      background: rgba(255,255,255,0.1);
      border-radius: 8px;
      padding: 16px;
    }
    
    .cover-stat-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      opacity: 0.8;
      margin-bottom: 4px;
    }
    
    .cover-stat-value {
      font-size: 20px;
      font-weight: 700;
    }
    
    /* Sections */
    .section {
      margin-bottom: 32px;
    }
    
    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: #082A4B;
      padding-bottom: 10px;
      border-bottom: 2px solid #082A4B;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    /* AI Summary Card */
    .ai-summary {
      background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
      border: 1px solid #bbf7d0;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
    }
    
    .ai-summary-title {
      font-size: 14px;
      font-weight: 700;
      color: #03A44D;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .ai-summary-text {
      font-size: 14px;
      color: #374151;
      line-height: 1.6;
    }
    
    /* Health Score */
    .health-score {
      display: flex;
      align-items: center;
      gap: 24px;
      background: #f9fafb;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
    }
    
    .score-circle {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: 800;
      color: white;
      flex-shrink: 0;
    }
    
    .score-excellent { background: #03A44D; }
    .score-good { background: #10b981; }
    .score-fair { background: #f59e0b; }
    .score-poor { background: #dc2626; }
    
    .score-details {
      flex: 1;
    }
    
    .score-label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    
    .score-value {
      font-size: 24px;
      font-weight: 700;
      color: #082A4B;
      margin-bottom: 8px;
    }
    
    .score-recommendation {
      font-size: 14px;
      color: #374151;
    }
    
    /* Progress Bar */
    .progress-bar {
      width: 100%;
      height: 12px;
      background: #e5e7eb;
      border-radius: 6px;
      overflow: hidden;
      margin-top: 12px;
    }
    
    .progress-fill {
      height: 100%;
      border-radius: 6px;
      transition: width 0.3s ease;
    }
    
    /* Cards */
    .card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 16px;
    }
    
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    
    .card-title {
      font-size: 15px;
      font-weight: 600;
      color: #082A4B;
    }
    
    .card-badge {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .badge-critical { background: #fee2e2; color: #dc2626; }
    .badge-high { background: #fef3c7; color: #d97706; }
    .badge-medium { background: #dbeafe; color: #2563eb; }
    .badge-low { background: #f3f4f6; color: #6b7280; }
    
    .card-content {
      font-size: 13px;
      color: #374151;
      line-height: 1.5;
    }
    
    .card-meta {
      display: flex;
      gap: 16px;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #f3f4f6;
      font-size: 12px;
      color: #6b7280;
    }
    
    /* Tables */
    table { 
      width: 100%; 
      border-collapse: collapse; 
      font-size: 13px;
      margin-bottom: 16px;
    }
    
    thead tr { background: #f9fafb; }
    
    thead th { 
      padding: 12px 16px; 
      text-align: left; 
      font-weight: 600; 
      color: #082A4B;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    td { 
      padding: 12px 16px; 
      border-bottom: 1px solid #e5e7eb;
    }
    
    /* Comparison Table */
    .comparison-table td {
      text-align: right;
    }
    
    .comparison-table td:first-child {
      text-align: left;
      font-weight: 500;
    }
    
    .diff-positive { color: #03A44D; font-weight: 600; }
    .diff-negative { color: #dc2626; font-weight: 600; }
    
    /* Questions Section */
    .questions-list {
      list-style: none;
    }
    
    .questions-list li {
      padding: 12px 16px;
      background: #f9fafb;
      border-radius: 8px;
      margin-bottom: 8px;
      font-size: 13px;
      color: #374151;
    }
    
    /* Footer */
    .footer { 
      margin-top: 50px; 
      padding-top: 24px; 
      border-top: 2px solid #e5e7eb; 
      text-align: center;
    }
    
    .footer-brand { 
      font-size: 16px; 
      font-weight: 700; 
      color: #082A4B;
      margin-bottom: 8px;
    }
    
    .footer-link { 
      color: #03A44D; 
      text-decoration: none; 
      font-size: 12px;
    }
    
    .footer-disclaimer { 
      font-size: 10px; 
      color: #9ca3af; 
      margin-top: 12px; 
      line-height: 1.5;
    }
    
    .footer-meta {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #9ca3af;
      margin-top: 16px;
    }
    
    /* Print-specific optimizations */
    @media print {
      .page {
        padding: 20px;
      }
      
      .cover {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Header -->
    <div class="header">
      <div class="header-left">
        <div class="logo-text">CostReno</div>
      </div>
      <div class="header-meta">
        <div class="report-id">Report ID: ${reportId}</div>
        <div>${date}</div>
        <div>${data.location || ""}</div>
      </div>
    </div>

    <!-- Cover Section -->
    <div class="cover">
      <div class="cover-title">Quote Analysis Report</div>
      <div class="cover-main">${data.projectType || "Renovation Project"}</div>
      <div class="cover-subtitle">${data.contractor ? `Contractor: ${data.contractor}` : "Contractor Analysis"}</div>
      
      <div class="cover-grid">
        <div class="cover-stat">
          <div class="cover-stat-label">Total Quote</div>
          <div class="cover-stat-value">${data.totalPrice ? fmt(Number(data.totalPrice)) : "—"}</div>
        </div>
        <div class="cover-stat">
          <div class="cover-stat-label">Health Score</div>
          <div class="cover-stat-value">${data.score || 0}/100</div>
        </div>
        <div class="cover-stat">
          <div class="cover-stat-label">Red Flags</div>
          <div class="cover-stat-value">${(data.redFlagsList || []).length}</div>
        </div>
      </div>
    </div>

    <!-- AI Executive Summary -->
    ${data.summary ? `
    <div class="ai-summary">
      <div class="ai-summary-title">
        <span>🤖</span> AI Executive Summary
      </div>
      <div class="ai-summary-text">${data.summary}</div>
    </div>
    ` : ""}

    <!-- Health Score -->
    <div class="section">
      <div class="section-title">Quote Health Score</div>
      <div class="health-score">
        <div class="score-circle ${data.score >= 80 ? 'score-excellent' : data.score >= 60 ? 'score-good' : data.score >= 40 ? 'score-fair' : 'score-poor'}">
          ${data.score || 0}
        </div>
        <div class="score-details">
          <div class="score-label">Overall Assessment</div>
          <div class="score-value">${data.score >= 80 ? 'Excellent' : data.score >= 60 ? 'Good' : data.score >= 40 ? 'Fair' : 'Poor'}</div>
          <div class="score-recommendation">
            ${data.score >= 80 ? 'This quote appears to be well-structured and fairly priced.' : 
              data.score >= 60 ? 'This quote has some areas that need attention before proceeding.' :
              data.score >= 40 ? 'This quote requires significant review and negotiation.' :
              'This quote has major concerns. Proceed with caution.'}
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${data.score || 0}%; background: ${data.score >= 80 ? '#03A44D' : data.score >= 60 ? '#10b981' : data.score >= 40 ? '#f59e0b' : '#dc2626'};"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Recommendation -->
    <div class="section">
      <div class="section-title">AI Recommendation</div>
      <div class="card" style="border-left: 4px solid ${data.score >= 70 ? '#03A44D' : data.score >= 50 ? '#f59e0b' : '#dc2626'};">
        <div class="card-header">
          <div class="card-title">
            ${data.score >= 70 ? '✓ PROCEED WITH CONFIDENCE' : data.score >= 50 ? '⚠ NEGOTIATE BEFORE SIGNING' : '✗ AVOID OR REQUEST MAJOR REVISIONS'}
          </div>
        </div>
        <div class="card-content">
          ${data.score >= 70 ? 
            'This quote meets most quality standards. Review the red flags below, but overall this appears to be a reasonable offer.' :
            data.score >= 50 ?
            'This quote has concerning elements. Address the red flags and missing scope items before signing any agreement.' :
            'This quote has significant issues. We strongly recommend getting additional quotes and addressing all red flags before proceeding.'}
        </div>
      </div>
    </div>

    <!-- Red Flags -->
    ${(data.redFlagsList || []).length > 0 ? `
    <div class="section">
      <div class="section-title">
        <span>⚠️</span> Red Flags (${(data.redFlagsList || []).length})
      </div>
      ${(data.redFlagsList || []).map((f: any) => `
        <div class="card">
          <div class="card-header">
            <div class="card-title">${f.title || safeDisplay(f)}</div>
          </div>
          <div class="card-content">
            ${safeDisplay(f.explanation, 'No explanation provided')}
          </div>
          ${f.recommendation ? `
          <div class="card-meta">
            <strong>Recommendation:</strong> ${f.recommendation}
          </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    <!-- Missing Scope -->
    ${(data.missingScope || []).length > 0 ? `
    <div class="section">
      <div class="section-title">
        <span>📋</span> Missing Scope Items (${(data.missingScope || []).length})
      </div>
      ${(data.missingScope || []).map((m: any) => `
        <div class="card">
          <div class="card-header">
            <div class="card-title">${m.title || m.name || safeDisplay(m)}</div>
          </div>
          <div class="card-content">
            ${safeDisplay(m.explanation, 'No explanation provided')}
          </div>
          ${m.recommendation ? `
          <div class="card-meta">
            <strong>Recommendation:</strong> ${m.recommendation}
          </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    <!-- Line Items Analysis -->
    ${(data.lineItems || []).length > 0 ? `
    <div class="section">
      <div class="section-title">
        <span>📊</span> Line items (${(data.lineItems || []).length})
      </div>
      <p style="font-size:12px;color:#6b7280;margin:0 0 12px;">
        Market averages appear only when quantity and unit data are reliable enough for a fair comparison.
      </p>
      <table class="comparison-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Vendor price</th>
            <th>Market avg</th>
            <th>Difference</th>
          </tr>
        </thead>
        <tbody>
          ${(data.lineItems || []).map((item: any) => {
            const vendorPrice = Number(item.price || item.totalPrice || 0);
            const rawMarket = Number(item.marketPrice || item.typicalCostMid || 0);
            const marketComparable = item.marketComparable === true && rawMarket > 0 && vendorPrice > 0;
            const marketPrice = marketComparable ? rawMarket : 0;
            const diff = marketComparable ? vendorPrice - marketPrice : 0;
            const diffPct = marketComparable ? ((diff / marketPrice) * 100).toFixed(1) : null;
            return `
            <tr>
              <td>${item.name || item.description || '—'}</td>
              <td>${item.qty || item.quantity || '—'}</td>
              <td>${item.unit || '—'}</td>
              <td>${vendorPrice > 0 ? fmt(vendorPrice) : '—'}</td>
              <td>${marketPrice > 0 ? fmt(Math.round(marketPrice)) : '—'}</td>
              <td class="${marketComparable ? (diff > 0 ? 'diff-negative' : diff < 0 ? 'diff-positive' : '') : ''}">
                ${marketComparable && diff !== 0 ? (diff > 0 ? '+' : '') + fmt(Math.round(diff)) + ' (' + diffPct + '%)' : '—'}
              </td>
            </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
    ` : ''}

    <!-- Present Items -->
    ${(data.presentItems || []).length > 0 ? `
    <div class="section">
      <div class="section-title">
        <span>✅</span> Included Items (${(data.presentItems || []).length})
      </div>
      <ul class="questions-list">
        ${(data.presentItems || []).map((item: any) => `
          <li>${item.name || item.description || safeDisplay(item)}</li>
        `).join('')}
      </ul>
    </div>
    ` : ''}

    <!-- Needs Clarification -->
    ${(data.needsClarification || []).length > 0 ? `
    <div class="section">
      <div class="section-title">
        <span>❓</span> Items Needing Clarification (${(data.needsClarification || []).length})
      </div>
      ${(data.needsClarification || []).map((c: any) => `
        <div class="card">
          <div class="card-header">
            <div class="card-title">${c.name || c.item || safeDisplay(c)}</div>
          </div>
          <div class="card-content">
            ${safeDisplay(c.question, 'No question provided')}
          </div>
          ${c.matchedAs ? `
          <div class="card-meta">
            <strong>Found as:</strong> ${c.matchedAs}
          </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    <!-- Red Flags -->
    ${(data.redFlagsList || []).length > 0 ? `
    <div class="section">
      <div class="section-title">
        <span>⚠️</span> Red Flags (${(data.redFlagsList || []).length})
      </div>
      ${(data.redFlagsList || []).map((f: any) => `
        <div class="card">
          <div class="card-header">
            <div class="card-title">${f.title || safeDisplay(f)}</div>
          </div>
          <div class="card-content">
            ${safeDisplay(f.explanation, 'No explanation provided')}
          </div>
          ${f.recommendation ? `
          <div class="card-meta">
            <strong>Recommendation:</strong> ${f.recommendation}
          </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    <!-- Questions to Ask -->
    ${(data.questionsToAsk || []).length > 0 ? `
    <div class="section">
      <div class="section-title">
        <span>❓</span> Questions to Ask Your Contractor
      </div>
      <ul class="questions-list">
        ${(data.questionsToAsk || []).map((q: any) => `
          <li>${safeDisplay(q)}</li>
        `).join('')}
      </ul>
    </div>
    ` : ''}

    <!-- Recommendations -->
    ${(data.recommendations || []).length > 0 ? `
    <div class="section">
      <div class="section-title">
        <span>💡</span> AI Recommendations
      </div>
      ${(data.recommendations || []).map((r: any) => `
        <div class="card">
          <div class="card-content">
            ${safeDisplay(r)}
          </div>
        </div>
      `).join('')}
    </div>
    ` : ''}

    <!-- Building Codes -->
    ${(data.buildingCodes || []).length > 0 ? `
    <div class="section">
      <div class="section-title">
        <span>🏗️</span> Building Code Requirements
      </div>
      ${(data.buildingCodes || []).map((code: any) => `
        <div class="card">
          <div class="card-header">
            <div class="card-title">${code.title || safeDisplay(code)}</div>
          </div>
          <div class="card-content">
            ${safeDisplay(code.explanation, 'No explanation provided')}
          </div>
          ${code.inspectionRequired ? `
          <div class="card-meta">
            <strong>⚠️ Inspection Required</strong>
          </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    <!-- Footer -->
    <div class="footer">
      <div class="footer-brand">CostReno</div>
      <a href="https://costreno.com" class="footer-link">costreno.com</a>
      <div class="footer-disclaimer">
        This report is generated by AI and should be used as a reference only. 
        Always verify information with licensed professionals before making decisions.
      </div>
      <div class="footer-meta">
        <span>Report ID: ${reportId}</span>
        <span>${date}</span>
      </div>
    </div>
  </div>
</body>
</html>`;

  return new Blob([html], { type: 'text/html' });
}

/**
 * Submit email and trigger PDF download via print dialog
 */
export async function submitEmailAndDownload(options: DownloadOptions): Promise<void> {
  const { email, reportType, data = {} } = options;

  if (!email || !email.includes("@")) {
    throw new Error("Invalid email address");
  }

  try {
    console.log("[PDF] Generating report with data:", {
      ...data,
      breakdown: data.breakdown?.length + " items",
    });
    const blob = await generateReport(reportType, data);
    const html = await blob.text();
    console.log("[PDF] HTML length:", html.length);

    // Open in new window and trigger print (Save as PDF)
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      // Wait longer for content to render
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 500);
    } else {
      // Fallback: download as HTML if popup blocked
      triggerDownload(blob, options.filename);
    }
  } catch (error) {
    console.error("Download error:", error);
    throw error;
  }
}

/**
 * Trigger file download in the browser
 */
export function triggerDownload(blob: Blob, filename: string): void {
  if (typeof window === "undefined") {
    throw new Error("Download is only available in the browser");
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}
