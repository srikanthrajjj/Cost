/**
 * Utility functions for downloading reports and handling email submissions
 */

interface DownloadOptions {
  filename: string;
  email: string;
  reportType: "estimate" | "analysis";
  data?: Record<string, any>;
}

/**
 * Generate a simple HTML-based report as PDF
 * In production, this could integrate with a real PDF generation service
 */
export async function generateReport(
  reportType: "estimate" | "analysis",
  data: Record<string, any>,
): Promise<Blob> {
  // Create a simple HTML report
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>CostReno ${reportType === "estimate" ? "Estimate" : "Analysis"} Report</title>
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #333;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: #082A4B;
          color: white;
          padding: 30px;
          border-radius: 8px;
          margin-bottom: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 32px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section h2 {
          color: #082A4B;
          border-bottom: 2px solid #03A44D;
          padding-bottom: 10px;
          margin-bottom: 15px;
        }
        .badge {
          display: inline-block;
          padding: 8px 16px;
          background: #03A44D;
          color: white;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin-right: 10px;
          margin-bottom: 10px;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        .generated-time {
          color: #999;
          font-size: 12px;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>CostReno ${reportType === "estimate" ? "Estimate" : "Analysis"} Report</h1>
      </div>

      <div class="section">
        <h2>Report Details</h2>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Report Type:</strong> ${reportType === "estimate" ? "Project Estimate" : "Quote Analysis"}</p>
      </div>

      ${
        reportType === "estimate"
          ? `
      <div class="section">
        <h2>Estimate Summary</h2>
        <p><strong>Project Type:</strong> ${data.projectType || "N/A"}</p>
        <p><strong>Estimated Cost:</strong> ${data.estimate || "N/A"}</p>
        <p><strong>Confidence Score:</strong> ${data.confidence || "N/A"}%</p>
      </div>
      `
          : `
      <div class="section">
        <h2>Analysis Summary</h2>
        <p><strong>Quote Health Score:</strong> ${data.score || "N/A"}/100</p>
        <p><strong>Missing Items:</strong> ${data.missingItems || 0}</p>
        <p><strong>Items Needing Clarification:</strong> ${data.clarificationItems || 0}</p>
      </div>
      `
      }

      <div class="section">
        <h2>Next Steps</h2>
        <ul>
          <li>Review this report carefully</li>
          <li>Address any items flagged for clarification</li>
          <li>Compare multiple quotes before making a decision</li>
          <li>Check insurance coverage eligibility</li>
        </ul>
      </div>

      <div class="footer">
        <p><strong>CostReno</strong> - Your Home Renovation Partner</p>
        <p>© ${new Date().getFullYear()} CostReno. All rights reserved.</p>
        <div class="generated-time">
          This report was generated on ${new Date().toLocaleString()}
        </div>
      </div>
    </body>
    </html>
  `;

  return new Blob([html], { type: "text/html" });
}

/**
 * Submit email and trigger download
 * In production, this would send the email to a backend service
 */
export async function submitEmailAndDownload(options: DownloadOptions): Promise<void> {
  const { filename, email, reportType, data = {} } = options;

  // Validate email
  if (!email || !email.includes("@")) {
    throw new Error("Invalid email address");
  }

  try {
    // Step 1: Generate the report
    const blob = await generateReport(reportType, data);

    // Step 2: In production, send email to backend
    // This is a placeholder - actual implementation would call your backend
    console.log(`[Demo] Would send report to: ${email}`);

    // For demo, we'll simulate the backend call
    if (typeof window !== "undefined") {
      // You can optionally send to a backend here
      // await fetch("/api/email/send-report", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, reportType, filename }),
      // });
    }

    // Step 3: Trigger the download
    triggerDownload(blob, filename);
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

  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();

  // Cleanup
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}
