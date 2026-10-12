import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const home = read("src/routes/index.tsx");
const quote = read("src/routes/quote-analyzer.tsx").replace(/\s+/g, " ");
const sample = read("src/components/quote/QuoteReviewSample.tsx");
const estimator = read("src/routes/estimate.tsx");

assert.match(home, /Before you sign, understand your contractor quote\./);
assert.match(home, /Review my quote, free/);
assert.match(home, /Estimate my project/);
assert.match(home, /QuoteReviewSample compact/);
assert.match(home, /String\(getAllCities\(\)\.length\)/);
assert.doesNotMatch(
  home,
  /showLocationPrompt|ipapi\.co|displayProject|QuoteAnalysisSection|src="\/home\.png"/,
);
assert.doesNotMatch(read("src/routes/__root.tsx"), /WelcomeEstimatePrompt/);
assert.match(read("src/components/SiteChatbot.tsx"), /!isFocusedTool/);
assert.match(sample, /fictional example/);
assert.match(sample, /not a customer quote, live AI\s+analysis/);
assert.doesNotMatch(sample, /\$\d|guaranteed savings|10,000/);
assert.match(quote, /id="sample-review"/);
assert.match(quote, /Before you upload/);
assert.match(quote, /retained for up to six months/);
assert.match(quote, /AI providers may process/);
assert.doesNotMatch(quote, /10,000\+|Trained on thousands|Trusted by thousands/);
assert.match(quote, /window\.location\.hash === "#sample-review"/);
assert.equal(quote.match(/trackToolEvent\("quote_review_completed"\)/g)?.length, 2);
assert.match(quote, /trackToolEvent\("quote_report_ready"\)/);
assert.match(quote, /trackToolEvent\("quote_report_failed"\)/);
assert.doesNotMatch(estimator, /95% accuracy|>Accuracy</);
assert.match(estimator, /estimate_started/);
assert.match(estimator, /estimate_completed/);
for (const path of [
  "src/routes/about.tsx",
  "src/routes/methodology.tsx",
  "src/components/TrustBar.tsx",
]) {
  assert.doesNotMatch(
    read(path),
    /never shared with third parties|never sell user data or share uploaded quotes with third parties/,
  );
}

// Transpile the dependency-free helper to exercise its real runtime behavior.
const source = read("src/lib/analytics/tool-events.ts");
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
}).outputText;
const { trackToolEvent, TOOL_EVENTS } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);
const oldWindow = globalThis.window;
const oldCustomEvent = globalThis.CustomEvent;
try {
  delete globalThis.window;
  assert.doesNotThrow(() => trackToolEvent("quote_review_started"));

  const calls = [];
  const events = [];
  globalThis.CustomEvent = class {
    constructor(type, options) {
      this.type = type;
      this.detail = options.detail;
    }
  };
  globalThis.window = {
    clarity: (...args) => calls.push(args),
    dispatchEvent: (event) => {
      events.push(event);
      return true;
    },
  };
  for (const name of TOOL_EVENTS) trackToolEvent(name);
  assert.equal(calls.length, TOOL_EVENTS.length);
  assert.deepEqual(calls[0], ["event", "estimate_started"]);
  assert.deepEqual(events[0].detail, { name: "estimate_started" });
  assert.equal(events[0].type, "costreno:tool-event");
  trackToolEvent("someone@example.com");
  assert.equal(calls.length, TOOL_EVENTS.length, "Reject arbitrary event content at runtime");

  globalThis.window.clarity = () => {
    throw new Error("Analytics blocked");
  };
  assert.doesNotThrow(() => trackToolEvent("quote_review_completed"));
  delete globalThis.window.clarity;
  assert.doesNotThrow(() => trackToolEvent("sample_review_opened"));
  globalThis.window.dispatchEvent = () => {
    throw new Error("Listener failed");
  };
  assert.doesNotThrow(() => trackToolEvent("homepage_quote_clicked"));
} finally {
  if (oldWindow === undefined) delete globalThis.window;
  else globalThis.window = oldWindow;
  globalThis.CustomEvent = oldCustomEvent;
}

const reportCode = ts.transpileModule(read("src/lib/download-utils.ts"), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
}).outputText;
const { generateReport } = await import(
  `data:text/javascript;base64,${Buffer.from(reportCode).toString("base64")}`
);
const estimateReport = await generateReport("estimate", { confidence: 95 });
const reportHtml = await estimateReport.text();
assert.match(reportHtml, /Estimate detail/);
assert.match(reportHtml, /not measured accuracy or a guaranteed final price/);
assert.doesNotMatch(reportHtml, /cover-stat-label">Confidence/);

console.log(`Marketing regression checks passed (${TOOL_EVENTS.length} event names).`);
console.log(`Repository: ${fileURLToPath(root)}`);
