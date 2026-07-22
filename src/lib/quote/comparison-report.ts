import type { SavedQuote } from "@/lib/quote/comparison-store";

export interface ComparisonScore {
  composite: number;
  completeness: number;
  riskLevel: "Low" | "Medium" | "High";
  riskScore: number;
  qualityScore: number;
  valueBadge: string;
  savingsVsOther: number;
  savingsPercent: number;
  marketDiff: number;
  marketDiffPercent: number;
  reasons: string[];
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fmtMoney(n: number): string {
  return `$${Math.round(n).toLocaleString()}`;
}

function reportId(): string {
  return (
    "CMP-" +
    Date.now().toString(36).toUpperCase() +
    "-" +
    Math.random().toString(36).substring(2, 6).toUpperCase()
  );
}

export function computeComparisonScores(quotes: SavedQuote[]): ComparisonScore[] {
  if (quotes.length < 2) return [];

  const prices = quotes.map((q) => q.result.extraction.totalPrice);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const minPrice = Math.min(...prices);

  return quotes.map((q, idx) => {
    const e = q.result.extraction;
    const a = q.result.analysis;
    const score = a.summary.completenessScore;
    const redFlagCount = a.redFlags.length;
    const missingCount = a.missingScope.length;
    const hasWarranties = e.warranties.length > 0;
    const hasPermits = e.permits.length > 0;

    const completenessScore = Math.round(score * 0.4);
    const redFlagScore = Math.max(0, 25 - redFlagCount * 8);
    const missingScore = Math.max(0, 15 - missingCount * 3);
    const coverageScore = (hasWarranties ? 5 : 0) + (hasPermits ? 5 : 0);
    const priceRatio = avgPrice > 0 ? e.totalPrice / avgPrice : 1;
    const priceScore = Math.round(Math.max(0, Math.min(10, (2 - priceRatio) * 10)));

    const composite = Math.min(
      100,
      completenessScore + redFlagScore + missingScore + coverageScore + priceScore,
    );

    let riskScore = 0;
    if (redFlagCount >= 3) riskScore += 40;
    else if (redFlagCount >= 2) riskScore += 25;
    else if (redFlagCount >= 1) riskScore += 10;
    if (missingCount >= 5) riskScore += 30;
    else if (missingCount >= 3) riskScore += 15;
    else if (missingCount >= 1) riskScore += 5;
    if (!hasWarranties) riskScore += 10;
    if (!hasPermits) riskScore += 10;
    if (priceRatio > 1.3) riskScore += 5;

    const riskLevel: "Low" | "Medium" | "High" =
      riskScore >= 30 ? "High" : riskScore >= 15 ? "Medium" : "Low";

    const qualityScore = Math.min(100, Math.round(score * 0.6 + coverageScore * 4));

    let valueBadge = "Fair value";
    if (e.totalPrice === minPrice && composite >= 75) valueBadge = "Best value";
    else if (priceRatio > 1.25) valueBadge = "Overpriced";
    else if (priceRatio < 0.85) valueBadge = "Great deal";

    const otherPrices = prices.filter((_, i) => i !== idx);
    const highestOther = otherPrices.length > 0 ? Math.max(...otherPrices) : e.totalPrice;
    const savingsVsOther = highestOther - e.totalPrice;
    const savingsPercent = highestOther > 0 ? Math.round((savingsVsOther / highestOther) * 100) : 0;
    const marketDiff = avgPrice - e.totalPrice;
    const marketDiffPercent = avgPrice > 0 ? Math.round((marketDiff / avgPrice) * 100) : 0;

    const reasons: string[] = [];
    if (e.totalPrice === minPrice) reasons.push("Lowest total cost");
    if (score >= 80) reasons.push("Highly complete scope");
    if (redFlagCount === 0) reasons.push("No red flags detected");
    if (hasWarranties) reasons.push("Includes warranty coverage");
    if (hasPermits) reasons.push("Permits addressed");
    if (qualityScore >= 75) reasons.push("Strong quality indicators");
    if (marketDiff > 0) reasons.push("Below average of compared quotes");
    if (missingCount === 0) reasons.push("No missing scope items");

    return {
      composite,
      completeness: score,
      riskLevel,
      riskScore,
      qualityScore,
      valueBadge,
      savingsVsOther,
      savingsPercent,
      marketDiff,
      marketDiffPercent,
      reasons,
    };
  });
}

export function getBestComparisonIndex(scores: ComparisonScore[]): number {
  let bestIdx = 0;
  let bestScore = -1;
  for (let i = 0; i < scores.length; i++) {
    if (scores[i].composite > bestScore) {
      bestScore = scores[i].composite;
      bestIdx = i;
    }
  }
  return bestIdx;
}

function buildInsights(quotes: SavedQuote[], scores: ComparisonScore[], bestIdx: number): string[] {
  const best = scores[bestIdx];
  const bestQuote = quotes[bestIdx];
  const bestExtraction = bestQuote.result.extraction;
  const bestAnalysis = bestQuote.result.analysis;
  const avgPrice =
    quotes.reduce((s, q) => s + q.result.extraction.totalPrice, 0) / quotes.length;
  const insights: string[] = [];
  const quoteWord = quotes.length === 2 ? "the other quote" : "the highest quote";

  if (best.savingsVsOther > 0) {
    insights.push(
      `${bestExtraction.contractor || "The recommended quote"} saves you ${fmtMoney(best.savingsVsOther)} compared to ${quoteWord}.`,
    );
  }
  if (bestExtraction.totalPrice < avgPrice) {
    insights.push(
      `This quote is ${Math.abs(best.marketDiffPercent)}% ${best.marketDiff > 0 ? "below" : "above"} the average of your ${quotes.length} quotes.`,
    );
  }
  const overpricedIdx = scores.findIndex((s) => s.valueBadge === "Overpriced");
  if (overpricedIdx >= 0) {
    const overQ = quotes[overpricedIdx];
    insights.push(
      `${overQ.result.extraction.contractor || "One quote"} appears overpriced relative to scope and the other bids.`,
    );
  }
  if (bestAnalysis.redFlags.length === 0) {
    insights.push("The recommended quote has no red flags.");
  }
  if (best.completeness >= 80) {
    insights.push(`Scope completeness is strong at ${best.completeness}%.`);
  }
  if (Math.abs(best.savingsVsOther) > 500) {
    insights.push(
      `Potential negotiation opportunity: up to ${fmtMoney(Math.abs(best.savingsVsOther))} based on price differences.`,
    );
  }
  return insights.slice(0, 6);
}

function questionsForQuote(quotes: SavedQuote[], scores: ComparisonScore[], qIdx: number): string[] {
  const q = quotes[qIdx];
  const e = q.result.extraction;
  const a = q.result.analysis;
  const s = scores[qIdx];
  const questions: string[] = [];

  if (s.valueBadge === "Overpriced") {
    const cheaper = quotes.find((_, i) => i !== qIdx && scores[i].composite > s.composite);
    if (cheaper) {
      const diff = Math.abs(cheaper.result.extraction.totalPrice - e.totalPrice);
      if (diff > 0) {
        questions.push(
          `Your quote is ${fmtMoney(diff)} higher. Can you match or explain the difference?`,
        );
      }
    }
  }
  if (a.missingScope.length > 0) {
    questions.push(`Why isn't "${a.missingScope[0].title}" included in your scope?`);
  }
  if (e.warranties.length === 0) {
    questions.push("What warranty do you provide on workmanship and materials?");
  }
  if (e.permits.length === 0) {
    questions.push("Are permit costs included in your quote?");
  }
  for (const flag of a.redFlags.slice(0, 2)) {
    questions.push(`Regarding "${flag.title}": ${flag.recommendation}`);
  }
  return questions.slice(0, 4);
}

function scoreClass(score: number): string {
  if (score >= 85) return "score-excellent";
  if (score >= 70) return "score-good";
  if (score >= 50) return "score-fair";
  return "score-poor";
}

function riskBadgeClass(level: string): string {
  if (level === "Low") return "badge-low-risk";
  if (level === "Medium") return "badge-medium";
  return "badge-critical";
}

/** Full HTML document used for download/print and shared /r/:id preview. */
export function buildComparisonReportHtml({
  quotes,
  scores,
  bestIdx,
  options,
}: {
  quotes: SavedQuote[];
  scores: ComparisonScore[];
  bestIdx: number;
  options?: {
    shareUrl?: string;
  };
}): string {
  const best = quotes[bestIdx];
  const bestScore = scores[bestIdx];
  const bestE = best.result.extraction;
  const bestA = best.result.analysis;
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const id = reportId();
  const projectType = bestE.projectType || "Home renovation";
  const insights = buildInsights(quotes, scores, bestIdx);
  const prices = quotes.map((q) => q.result.extraction.totalPrice);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const spread = maxPrice - minPrice;

  const summaryRows = quotes
    .map((q, idx) => {
      const e = q.result.extraction;
      const a = q.result.analysis;
      const s = scores[idx];
      const recommended = idx === bestIdx;
      return `<tr class="${recommended ? "row-recommended" : ""}">
        <td>
          <strong>${idx + 1}. ${escapeHtml(e.contractor || `Quote ${idx + 1}`)}</strong>
          ${recommended ? '<span class="pill pill-accent">Recommended</span>' : ""}
          ${s.valueBadge ? `<span class="pill">${escapeHtml(s.valueBadge)}</span>` : ""}
        </td>
        <td>${fmtMoney(e.totalPrice)}</td>
        <td><strong>${s.composite}/100</strong></td>
        <td>${a.summary.completenessScore}%</td>
        <td><span class="pill ${riskBadgeClass(s.riskLevel)}">${s.riskLevel} risk</span></td>
        <td>${a.redFlags.length}</td>
        <td>${a.missingScope.length}</td>
      </tr>`;
    })
    .join("");

  const quoteCards = quotes
    .map((q, idx) => {
      const e = q.result.extraction;
      const a = q.result.analysis;
      const s = scores[idx];
      const recommended = idx === bestIdx;
      const reasons = s.reasons
        .slice(0, 4)
        .map((r) => `<li>${escapeHtml(r)}</li>`)
        .join("");
      const redFlags = a.redFlags
        .slice(0, 4)
        .map(
          (f) => `<div class="mini-card">
            <div class="mini-card-title">${escapeHtml(f.title)}</div>
            <div class="mini-card-body">${escapeHtml(f.explanation || f.recommendation || "")}</div>
          </div>`,
        )
        .join("");
      const missing = a.missingScope
        .slice(0, 5)
        .map((m) => `<li>${escapeHtml(m.title)}</li>`)
        .join("");
      const questions = questionsForQuote(quotes, scores, idx)
        .map((qq) => `<li>${escapeHtml(qq)}</li>`)
        .join("");

      return `<div class="quote-card ${recommended ? "quote-card-best" : ""}">
        <div class="quote-card-header">
          <div>
            <div class="quote-label">Quote ${idx + 1}${recommended ? " · Recommended" : ""}</div>
            <h3>${escapeHtml(e.contractor || `Contractor ${idx + 1}`)}</h3>
            <div class="quote-meta">${escapeHtml(e.projectType || projectType)}</div>
          </div>
          <div class="score-circle ${scoreClass(s.composite)}">${s.composite}</div>
        </div>
        <div class="stat-grid">
          <div class="stat"><div class="stat-label">Total</div><div class="stat-value">${fmtMoney(e.totalPrice)}</div></div>
          <div class="stat"><div class="stat-label">Completeness</div><div class="stat-value">${a.summary.completenessScore}%</div></div>
          <div class="stat"><div class="stat-label">Risk</div><div class="stat-value">${s.riskLevel}</div></div>
          <div class="stat"><div class="stat-label">Value</div><div class="stat-value">${escapeHtml(s.valueBadge)}</div></div>
        </div>
        ${
          s.savingsVsOther > 0
            ? `<p class="savings">Saves ${fmtMoney(s.savingsVsOther)} vs the highest other quote (${s.savingsPercent}%).</p>`
            : ""
        }
        ${reasons ? `<div class="subsection"><div class="subsection-title">Why this score</div><ul>${reasons}</ul></div>` : ""}
        ${
          redFlags
            ? `<div class="subsection"><div class="subsection-title">Red flags (${a.redFlags.length})</div>${redFlags}</div>`
            : `<div class="subsection"><div class="subsection-title">Red flags</div><p class="muted">None detected.</p></div>`
        }
        ${
          missing
            ? `<div class="subsection"><div class="subsection-title">Missing scope</div><ul>${missing}</ul></div>`
            : ""
        }
        ${
          e.warranties.length || e.permits.length
            ? `<div class="subsection"><div class="subsection-title">Coverage notes</div>
                <p class="muted">${e.warranties.length ? `Warranties: ${escapeHtml(e.warranties.slice(0, 2).join("; "))}` : "No warranty notes."}
                · ${e.permits.length ? `Permits: ${escapeHtml(e.permits.slice(0, 2).join("; "))}` : "No permit notes."}</p>
              </div>`
            : ""
        }
        ${
          questions
            ? `<div class="subsection"><div class="subsection-title">Questions to ask</div><ul>${questions}</ul></div>`
            : ""
        }
      </div>`;
    })
    .join("");

  const insightList = insights.map((i) => `<li>${escapeHtml(i)}</li>`).join("");
  const shareNote =
    options?.shareUrl != null
      ? `<p class="share-note">Shared link: <a href="${escapeHtml(options.shareUrl)}">${escapeHtml(options.shareUrl)}</a></p>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CostReno quote comparison report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Inter, "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #1f2937;
      line-height: 1.5;
      background: #f3f4f6;
    }
    @media print {
      body { background: #fff; }
      .no-print { display: none !important; }
      .page { box-shadow: none !important; margin: 0 !important; max-width: 100% !important; border-radius: 0 !important; }
      .quote-card { break-inside: avoid; }
    }
    .page {
      max-width: 850px;
      margin: 32px auto;
      padding: 48px 52px;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.08);
    }
    .header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      padding-bottom: 18px;
      border-bottom: 3px solid #082A4B;
      margin-bottom: 28px;
    }
    .logo-text { font-size: 24px; font-weight: 800; color: #082A4B; letter-spacing: -0.4px; }
    .header-meta { text-align: right; font-size: 11px; color: #6b7280; }
    .report-id { font-weight: 600; color: #082A4B; }
    .cover {
      background: linear-gradient(135deg, #082A4B 0%, #0a3a5f 100%);
      border-radius: 16px;
      padding: 36px;
      color: #fff;
      margin-bottom: 28px;
    }
    .cover-title { font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.8; margin-bottom: 8px; }
    .cover-main { font-size: 30px; font-weight: 800; margin-bottom: 8px; }
    .cover-subtitle { font-size: 15px; opacity: 0.9; margin-bottom: 20px; }
    .cover-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
    .cover-stat { background: rgba(255,255,255,0.1); border-radius: 10px; padding: 14px; }
    .cover-stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8; margin-bottom: 4px; }
    .cover-stat-value { font-size: 18px; font-weight: 700; }
    .ai-summary {
      background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
      border: 1px solid #bbf7d0;
      border-radius: 12px;
      padding: 22px;
      margin-bottom: 28px;
    }
    .ai-summary-title { font-size: 13px; font-weight: 700; color: #03A44D; margin-bottom: 10px; }
    .ai-summary-text { font-size: 14px; color: #374151; }
    .ai-summary ul { margin: 10px 0 0 18px; }
    .ai-summary li { margin-bottom: 6px; }
    .section { margin-bottom: 30px; }
    .section-title {
      font-size: 17px; font-weight: 700; color: #082A4B;
      padding-bottom: 10px; border-bottom: 2px solid #082A4B; margin-bottom: 18px;
    }
    table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 8px; }
    thead tr { background: #f8fafc; }
    th {
      padding: 10px 12px; text-align: left; font-weight: 600; color: #082A4B;
      font-size: 11px; text-transform: uppercase; letter-spacing: 0.4px;
      border-bottom: 1px solid #e5e7eb;
    }
    td { padding: 12px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
    .row-recommended { background: #f0fdf4; }
    .pill {
      display: inline-block; margin-left: 6px; padding: 2px 8px; border-radius: 999px;
      font-size: 10px; font-weight: 600; background: #f3f4f6; color: #4b5563; white-space: nowrap;
    }
    .pill-accent { background: #03A44D; color: #fff; }
    .badge-low-risk { background: #ecfdf5; color: #047857; }
    .badge-medium { background: #fef3c7; color: #b45309; }
    .badge-critical { background: #fee2e2; color: #dc2626; }
    .quote-card {
      border: 1px solid #e5e7eb; border-radius: 14px; padding: 22px; margin-bottom: 18px; background: #fff;
    }
    .quote-card-best { border-color: #86efac; box-shadow: 0 0 0 1px rgba(3,164,77,0.15); }
    .quote-card-header { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; margin-bottom: 16px; }
    .quote-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; margin-bottom: 4px; }
    .quote-card h3 { font-size: 18px; color: #082A4B; margin-bottom: 2px; }
    .quote-meta { font-size: 12px; color: #6b7280; }
    .score-circle {
      width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
      font-size: 20px; font-weight: 800; color: #fff; flex-shrink: 0;
    }
    .score-excellent { background: #03A44D; }
    .score-good { background: #10b981; }
    .score-fair { background: #f59e0b; }
    .score-poor { background: #dc2626; }
    .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 12px; }
    .stat { background: #f9fafb; border-radius: 10px; padding: 12px; }
    .stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.6px; color: #6b7280; margin-bottom: 2px; }
    .stat-value { font-size: 14px; font-weight: 700; color: #082A4B; }
    .savings { font-size: 13px; color: #047857; font-weight: 600; margin: 8px 0 12px; }
    .subsection { margin-top: 14px; }
    .subsection-title { font-size: 12px; font-weight: 700; color: #082A4B; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
    .subsection ul { margin-left: 18px; font-size: 13px; color: #374151; }
    .subsection li { margin-bottom: 4px; }
    .mini-card { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 10px 12px; margin-bottom: 8px; }
    .mini-card-title { font-size: 13px; font-weight: 600; color: #9a3412; margin-bottom: 2px; }
    .mini-card-body { font-size: 12px; color: #7c2d12; }
    .muted { font-size: 13px; color: #6b7280; }
    .footer {
      margin-top: 36px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;
    }
    .footer-brand { font-size: 16px; font-weight: 800; color: #082A4B; }
    .footer-link { display: inline-block; margin: 6px 0 10px; color: #082A4B; font-size: 13px; }
    .footer-disclaimer { font-size: 11px; color: #6b7280; max-width: 560px; margin: 0 auto 10px; }
    .footer-meta { font-size: 11px; color: #9ca3af; display: flex; justify-content: center; gap: 18px; flex-wrap: wrap; }
    .share-note { font-size: 12px; color: #6b7280; margin-top: 12px; word-break: break-all; }
    @media (max-width: 700px) {
      .page { margin: 0; padding: 24px 18px; border-radius: 0; box-shadow: none; }
      .cover-grid, .stat-grid { grid-template-columns: 1fr 1fr; }
      .cover-main { font-size: 24px; }
      .header { flex-direction: column; }
      .header-meta { text-align: left; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="logo-text">CostReno</div>
      <div class="header-meta">
        <div class="report-id">${id}</div>
        <div>Quote comparison report</div>
        <div>${date}</div>
      </div>
    </div>

    <div class="cover">
      <div class="cover-title">AI quote comparison</div>
      <div class="cover-main">${escapeHtml(projectType)}</div>
      <div class="cover-subtitle">
        Comparing ${quotes.length} contractor quotes · Recommended:
        ${escapeHtml(bestE.contractor || `Quote ${bestIdx + 1}`)}
      </div>
      <div class="cover-grid">
        <div class="cover-stat">
          <div class="cover-stat-label">Recommended total</div>
          <div class="cover-stat-value">${fmtMoney(bestE.totalPrice)}</div>
        </div>
        <div class="cover-stat">
          <div class="cover-stat-label">AI score</div>
          <div class="cover-stat-value">${bestScore.composite}/100</div>
        </div>
        <div class="cover-stat">
          <div class="cover-stat-label">Price spread</div>
          <div class="cover-stat-value">${fmtMoney(spread)}</div>
        </div>
      </div>
    </div>

    <div class="ai-summary">
      <div class="ai-summary-title">AI recommendation</div>
      <div class="ai-summary-text">
        <strong>${escapeHtml(bestE.contractor || `Quote ${bestIdx + 1}`)}</strong>
        scores highest at ${bestScore.composite}/100 with ${bestA.summary.completenessScore}% scope completeness
        and ${bestA.redFlags.length} red flag${bestA.redFlags.length === 1 ? "" : "s"}.
        ${
          bestScore.savingsVsOther > 0
            ? ` Potential savings vs the highest other quote: ${fmtMoney(bestScore.savingsVsOther)}.`
            : ""
        }
        ${insightList ? `<ul>${insightList}</ul>` : ""}
      </div>
    </div>

    <div class="section">
      <div class="section-title">Side-by-side summary</div>
      <table>
        <thead>
          <tr>
            <th>Quote</th>
            <th>Total</th>
            <th>AI score</th>
            <th>Completeness</th>
            <th>Risk</th>
            <th>Red flags</th>
            <th>Missing</th>
          </tr>
        </thead>
        <tbody>${summaryRows}</tbody>
      </table>
    </div>

    <div class="section">
      <div class="section-title">Quote details</div>
      ${quoteCards}
    </div>

    <div class="footer">
      <div class="footer-brand">CostReno</div>
      <a class="footer-link" href="https://costreno.com">costreno.com</a>
      <div class="footer-disclaimer">
        This report is generated by AI for planning only. Verify scope, licensing, insurance, and contract terms with licensed professionals before hiring.
      </div>
      <div class="footer-meta">
        <span>Report ID: ${id}</span>
        <span>${date}</span>
      </div>
      ${shareNote}
    </div>
  </div>
</body>
</html>`;
}

export function printComparisonReport(html: string): void {
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
    return;
  }
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `quote-comparison-${Date.now()}.html`;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}
