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

  const fmt = (n: number) => "$" + Math.round(n).toLocaleString();

  // Build breakdown rows
  const breakdownRows = (data.breakdown || [])
    .map(
      (b: any) => `
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb;">${b.label}</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${fmt(b.amount)}</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #6b7280;">${b.pct}%</td>
      </tr>
    `,
    )
    .join("");

  // Build details section
  const detailsHtml = Object.entries(data.details || {})
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding: 6px 0; color: #6b7280; width: 40%;">${k}</td><td style="padding: 6px 0; font-weight: 500;">${v}</td></tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CostReno — ${data.projectType || "Estimate"} Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; color: #1f2937; line-height: 1.6; padding: 0; }
    @media print { body { padding: 0; } .no-print { display: none; } }
    .page { max-width: 800px; margin: 0 auto; padding: 40px; }
    .header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 24px; border-bottom: 3px solid #082A4B; margin-bottom: 32px; }
    .logo { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 28px; font-weight: 800; color: #082A4B; letter-spacing: -0.5px; }
    .logo-sub { font-size: 11px; color: #6b7280; margin-top: 2px; }
    .meta { text-align: right; font-size: 12px; color: #6b7280; }
    .hero { background: linear-gradient(135deg, #f0fdf4, #ecfdf5); border: 1px solid #bbf7d0; border-radius: 12px; padding: 32px; text-align: center; margin-bottom: 32px; }
    .hero-label { font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; }
    .hero-amount { font-size: 42px; font-weight: 800; color: #082A4B; margin: 8px 0; }
    .hero-range { font-size: 15px; color: #374151; }
    .hero-confidence { display: inline-block; margin-top: 12px; padding: 4px 12px; background: #03A44D; color: white; border-radius: 20px; font-size: 11px; font-weight: 600; }
    .section { margin-bottom: 28px; }
    .section-title { font-size: 16px; font-weight: 700; color: #082A4B; padding-bottom: 8px; border-bottom: 2px solid #082A4B; margin-bottom: 14px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    thead tr { background: #f9fafb; }
    thead th { padding: 10px 14px; text-align: left; font-weight: 600; color: #082A4B; }
    .detail-table td { padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-size: 13px; }
    .tips { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; }
    .tips li { margin-bottom: 6px; font-size: 13px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; }
    .footer-brand { font-size: 14px; font-weight: 700; color: #082A4B; }
    .footer-link { color: #03A44D; text-decoration: none; font-size: 12px; }
    .footer-disclaimer { font-size: 10px; color: #9ca3af; margin-top: 12px; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="page">
    <!-- Header with logo -->
    <div class="header">
      <div>
        <svg width="140" height="34" viewBox="0 0 414 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="103" height="101" rx="26" fill="#082A4B"/>
          <rect x="60" y="18" width="27" height="27" rx="9" fill="white"/>
          <path d="M79.1661 18H67.8474C62.931 18 60 20.9295 60 25.8435V37.143C60 42.0705 62.931 45 67.8474 45H79.1525C84.069 45 87 42.0705 87 37.1565V25.8435C87.0135 20.9295 84.0825 18 79.1661 18ZM78.9094 32.5125H74.5197V36.9C74.5197 37.4535 74.0605 37.9125 73.5067 37.9125C72.953 37.9125 72.4937 37.4535 72.4937 36.9V32.5125H68.104C67.5503 32.5125 67.091 32.0535 67.091 31.5C67.091 30.9465 67.5503 30.4875 68.104 30.4875H72.4937V26.1C72.4937 25.5465 72.953 25.0875 73.5067 25.0875C74.0605 25.0875 74.5197 25.5465 74.5197 26.1V30.4875H78.9094C79.4632 30.4875 79.9224 30.9465 79.9224 31.5C79.9224 32.0535 79.4632 32.5125 78.9094 32.5125Z" fill="#03A44D"/>
          <path d="M54.6611 19.0186C55.6186 19.092 56.3665 19.849 56.4688 20.7812L56.4805 20.9834L56.5547 29.9404C56.5597 30.544 56.071 31.0322 55.4717 31.0322C52.5459 31.0323 49.8665 31.5661 47.4209 32.6221L47.4111 32.626L47.4023 32.6299C44.9483 33.6339 42.8054 35.0813 40.9658 36.9766L40.96 36.9814L40.9551 36.9873C39.1189 38.8235 37.6658 40.9955 36.5996 43.5146C35.5951 46.0258 35.0879 48.7737 35.0879 51.7676C35.0879 54.7004 35.5952 57.4191 36.6006 59.9326C37.6658 62.4497 39.1176 64.6519 40.9551 66.5479C42.8513 68.3858 45.0538 69.838 47.5713 70.9033C50.0826 71.9078 52.8302 72.416 55.8242 72.416C59.0904 72.416 62.147 71.7693 65.0049 70.4805C67.6033 69.28 69.864 67.6371 71.793 65.5479C72.5548 64.7228 73.8879 64.6342 74.7256 65.4717L80.4238 71.1699C81.1603 71.9064 81.2231 73.1147 80.4863 73.9092C78.6185 75.9232 76.4403 77.7128 73.957 79.2783L73.9521 79.2812C71.2307 80.9746 68.2705 82.2713 65.0762 83.1758L65.0771 83.1768C61.9366 84.0827 58.7337 84.5361 55.4717 84.5361C50.778 84.5361 46.3965 83.7234 42.3379 82.0879L42.3262 82.083C38.2847 80.394 34.7182 78.068 31.6348 75.1055L31.6279 75.0986L31.6211 75.0908C28.5982 72.0679 26.2386 68.5887 24.5459 64.6592L24.543 64.6543C22.8449 60.6515 22 56.3521 22 51.7676C22.0001 47.1853 22.8442 42.9154 24.543 38.9697L24.8691 38.2275C26.5346 34.5459 28.7875 31.309 31.6279 28.5254C34.7146 25.4993 38.2871 23.1686 42.3379 21.5361C46.1487 19.968 50.1896 19.1286 54.4531 19.0137L54.6611 19.0186Z" fill="white" stroke="white" stroke-width="2"/>
          <path d="M141.112 73.64C137.784 73.64 134.669 73.064 131.768 71.912C128.867 70.7173 126.328 69.0747 124.152 66.984C122.019 64.8933 120.333 62.4613 119.096 59.688C117.901 56.872 117.304 53.8427 117.304 50.6C117.304 47.3147 117.901 44.2853 119.096 41.512C120.333 38.696 122.04 36.2427 124.216 34.152C126.392 32.0613 128.909 30.44 131.768 29.288C134.669 28.0933 137.784 27.496 141.112 27.496C143.587 27.496 145.976 27.8373 148.28 28.52C150.584 29.2027 152.717 30.1627 154.68 31.4C156.685 32.6373 158.392 34.1307 159.8 35.88L153.528 42.088C151.907 40.0827 150.029 38.568 147.896 37.544C145.805 36.52 143.544 36.008 141.112 36.008C139.107 36.008 137.229 36.392 135.48 37.16C133.731 37.8853 132.216 38.9093 130.936 40.232C129.656 41.512 128.653 43.048 127.928 44.84C127.203 46.5893 126.84 48.5093 126.84 50.6C126.84 52.648 127.203 54.5467 127.928 56.296C128.696 58.0453 129.72 59.5813 131 60.904C132.323 62.2267 133.88 63.2507 135.672 63.976C137.464 64.7013 139.384 65.064 141.432 65.064C143.779 65.064 145.976 64.5733 148.024 63.592C150.072 62.6107 151.864 61.2027 153.4 59.368L159.544 65.384C158.136 67.0907 156.451 68.5627 154.488 69.8C152.525 71.0373 150.392 71.9973 148.088 72.68C145.827 73.32 143.501 73.64 141.112 73.64Z" fill="#082A4B"/>
          <path d="M261.47 73V28.2H283.358C286.387 28.2 289.054 28.7973 291.358 29.992C293.704 31.144 295.539 32.7653 296.862 34.856C298.184 36.9467 298.846 39.3573 298.846 42.088C298.846 44.9467 298.035 47.464 296.414 49.64C294.835 51.816 292.744 53.4373 290.142 54.504L299.998 73H289.63L280.862 55.848H270.814V73H261.47ZM270.814 48.232H282.526C284.616 48.232 286.28 47.6773 287.518 46.568C288.798 45.4587 289.438 44.008 289.438 42.216C289.438 40.424 288.798 38.9733 287.518 37.864C286.28 36.7547 284.616 36.2 282.526 36.2H270.814V48.232Z" fill="#082A4B"/>
          <path d="M318.714 73.64C315.386 73.64 312.356 72.872 309.626 71.336C306.938 69.8 304.804 67.7307 303.226 65.128C301.647 62.5253 300.858 59.6027 300.858 56.36C300.858 53.1173 301.604 50.1947 303.098 47.592C304.634 44.9893 306.703 42.92 309.306 41.384C311.908 39.848 314.81 39.08 318.01 39.08C321.21 39.08 324.047 39.8693 326.522 41.448C328.996 42.984 330.938 45.1173 332.346 47.848C333.796 50.536 334.522 53.5867 334.522 57V59.304H309.818C310.202 60.6267 310.82 61.8213 311.674 62.888C312.57 63.9547 313.658 64.7867 314.938 65.384C316.26 65.9387 317.668 66.216 319.162 66.216C320.655 66.216 322.02 66.0027 323.258 65.576C324.538 65.1067 325.626 64.4453 326.522 63.592L332.282 68.84C330.234 70.504 328.122 71.72 325.946 72.488C323.812 73.256 321.402 73.64 318.714 73.64Z" fill="#082A4B"/>
          <path d="M394.15 73.64C390.822 73.64 387.792 72.872 385.062 71.336C382.374 69.8 380.24 67.7307 378.661 65.128C377.126 62.5253 376.358 59.6027 376.358 56.36C376.358 53.1173 377.126 50.1947 378.661 47.592C380.24 44.9467 382.374 42.856 385.062 41.32C387.792 39.784 390.822 39.016 394.15 39.016C397.478 39.016 400.486 39.784 403.174 41.32C405.904 42.856 408.038 44.9467 409.574 47.592C411.152 50.1947 411.942 53.1173 411.942 56.36C411.942 59.6027 411.152 62.5253 409.574 65.128C408.038 67.7307 405.904 69.8 403.174 71.336C400.486 72.872 397.478 73.64 394.15 73.64Z" fill="#03A44D"/>
        </svg>
        <div class="logo-sub">Smart Home Renovation Estimates</div>
      </div>
      <div class="meta">
        <div>${date}</div>
        <div>${data.location || ""}</div>
        <div style="margin-top: 4px;"><a href="https://costreno.com" style="color: #03A44D; text-decoration: none; font-size: 11px;">costreno.com</a></div>
      </div>
    </div>

    ${
      reportType === "estimate"
        ? `
    <!-- Hero estimate -->
    <div class="hero">
      <div class="hero-label">${data.projectType || "Project"} Estimate</div>
      <div class="hero-amount">${data.estimate || "$0"}</div>
      <div class="hero-range">${data.range || ""}</div>
      <div class="hero-confidence">${data.confidence || 0}% Confidence</div>
    </div>

    <!-- Project Details -->
    ${detailsHtml ? `<div class="section"><div class="section-title">Project Details</div><table class="detail-table">${detailsHtml}</table></div>` : ""}

    <!-- Cost Breakdown -->
    ${
      breakdownRows
        ? `
    <div class="section">
      <div class="section-title">Cost Breakdown</div>
      <table>
        <thead><tr><th>Category</th><th style="text-align: right;">Amount</th><th style="text-align: right;">%</th></tr></thead>
        <tbody>${breakdownRows}</tbody>
        <tfoot><tr style="background: #f0fdf4; font-weight: 700;">
          <td style="padding: 10px 14px;">Total (Mid Estimate)</td>
          <td style="padding: 10px 14px; text-align: right;">${data.estimate || ""}</td>
          <td style="padding: 10px 14px; text-align: right;">100%</td>
        </tr></tfoot>
      </table>
    </div>`
        : ""
    }

    <!-- Timeline & Permits -->
    <div class="section">
      <div class="section-title">Timeline & Requirements</div>
      <table class="detail-table">
        <tr><td style="color: #6b7280; width: 40%;">Estimated Timeline</td><td style="font-weight: 500;">${data.timeline || "—"}</td></tr>
        <tr><td style="color: #6b7280;">Permit Required</td><td style="font-weight: 500;">${data.permitRequired ? "Yes" : "No"}</td></tr>
        <tr><td style="color: #6b7280;">Insurance Eligible</td><td style="font-weight: 500;">${data.insuranceEligible ? "Potentially — check your policy" : "Unlikely (planned renovation)"}</td></tr>
      </table>
    </div>

    <!-- Next Steps -->
    <div class="section">
      <div class="section-title">Recommended Next Steps</div>
      <div class="tips">
        <ol style="padding-left: 18px;">
          <li>Get 3 quotes from licensed contractors in your area</li>
          <li>Ask contractors about their timeline and warranty</li>
          <li>Verify permit requirements with your local building department</li>
          <li>Review your homeowner's insurance for applicable coverage</li>
          <li>Set aside 10–15% contingency for unexpected costs</li>
        </ol>
      </div>
    </div>
    `
        : `
    <!-- Quote Analysis Report -->
    <div class="hero">
      <div class="hero-label">Quote Health Score</div>
      <div class="hero-amount">${data.score || 0}/100</div>
      <div class="hero-range">${data.contractor ? `Contractor: ${data.contractor}` : ""} ${data.totalPrice ? `• Total: $${Number(data.totalPrice).toLocaleString()}` : ""}</div>
      <div class="hero-confidence">${data.redFlags || 0} Red Flags • ${data.missingItems || 0} Missing Items</div>
    </div>

    ${data.summary ? `<div class="section"><div class="section-title">Summary</div><p style="font-size: 13px; color: #374151;">${data.summary}</p></div>` : ""}

    ${
      (data.redFlagsList || []).length > 0
        ? `
    <div class="section">
      <div class="section-title" style="border-bottom-color: #dc2626;">⚠️ Red Flags</div>
      <ul style="padding-left: 18px; font-size: 13px;">
        ${(data.redFlagsList || []).map((f: any) => `<li style="margin-bottom: 8px; color: #991b1b;"><strong>${f.title || f}</strong>${f.explanation ? `<br><span style="color: #6b7280; font-size: 12px;">${f.explanation}</span>` : ""}</li>`).join("")}
      </ul>
    </div>`
        : ""
    }

    ${
      (data.missingScope || []).length > 0
        ? `
    <div class="section">
      <div class="section-title" style="border-bottom-color: #d97706;">📋 Missing Scope Items</div>
      <ul style="padding-left: 18px; font-size: 13px;">
        ${(data.missingScope || []).map((m: any) => `<li style="margin-bottom: 6px;">${m.item || m.name || m}</li>`).join("")}
      </ul>
    </div>`
        : ""
    }

    ${
      (data.needsClarification || []).length > 0
        ? `
    <div class="section">
      <div class="section-title">❓ Needs Clarification</div>
      <ul style="padding-left: 18px; font-size: 13px;">
        ${(data.needsClarification || []).map((c: any) => `<li style="margin-bottom: 6px;">${c.item || c.name || c}</li>`).join("")}
      </ul>
    </div>`
        : ""
    }

    ${
      (data.lineItems || []).length > 0
        ? `
    <div class="section">
      <div class="section-title">Line Items (${data.lineItems.length})</div>
      <table>
        <thead><tr><th>Item</th><th style="text-align: right;">Qty</th><th style="text-align: right;">Price</th></tr></thead>
        <tbody>${(data.lineItems || []).map((item: any) => `<tr><td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; font-size: 12px;">${item.name || item.description || "—"}</td><td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 12px;">${item.qty || item.quantity || "—"}</td><td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 12px;">${item.price || item.totalPrice ? "$" + Number(item.price || item.totalPrice).toLocaleString() : "—"}</td></tr>`).join("")}</tbody>
      </table>
    </div>`
        : ""
    }

    <div class="section">
      <div class="section-title">Recommended Next Steps</div>
      <div class="tips">
        <ol style="padding-left: 18px;">
          <li>Address all red flags with your contractor before signing</li>
          <li>Request a revised quote that includes missing scope items</li>
          <li>Get 2-3 additional quotes for comparison</li>
          <li>Ask for clarification on vague line items</li>
          <li>Verify contractor licenses and insurance</li>
        </ol>
      </div>
    </div>
    `
    }

    <!-- Footer -->
    <div class="footer">
      <div class="footer-brand">CostReno</div>
      <div><a class="footer-link" href="https://costreno.com">costreno.com</a></div>
      <div class="footer-disclaimer">
        This ${reportType === "estimate" ? "estimate" : "analysis"} is for planning purposes only. Actual costs may vary based on local conditions, specific project requirements, and contractor pricing.
        Data based on ${new Date().getFullYear()} regional averages. © ${new Date().getFullYear()} CostReno. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>`;

  return new Blob([html], { type: "text/html" });
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
