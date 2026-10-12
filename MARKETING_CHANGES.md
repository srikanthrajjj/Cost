# Quote-review marketing improvements

## What changed

The homepage now leads with a specific homeowner decision: **"Before you sign, understand your contractor quote."** It offers a direct free quote-review action and a separate project-estimate action. Chat remains available as optional help rather than the main entry point. Project cards link directly to `/estimate?project=...`, so those links no longer depend on JavaScript writing to browser storage.

A reusable, clearly labeled fictional review shows permit responsibility, material specification, and disposal-scope questions. It appears on the homepage and at `/quote-analyzer#sample-review`. The example is not a customer report, live AI result, price benchmark, or guaranteed saving. Deliberate sample visits do not consume or replace a saved homepage-chat analysis; that result remains available on a normal quote-analyzer visit.

Automatic first-visit location and welcome dialogs are no longer mounted. Visitors still enter location inside the estimator. Floating chat stays available on tool pages, but unrelated rotating invitations are suppressed there. The homepage's rotating headline, typewriter placeholder, repetitive promotional sections, and seven decorative image references have been removed. The original files total 7,716,636 bytes; they remain in the repository for other uses. This is not a measured Core Web Vitals improvement.

The homepage city-directory count now comes from the same data source as `/locations` (currently 56). It is labeled as directory coverage, not a claim that every city/category combination has been locally reviewed. Unsupported claims about 10,000 analyzed quotes, thousands of users, training scale, and estimator accuracy were removed from the edited funnel and two existing guide callouts. Estimator percentages describe supplied project detail, not measured historical accuracy; the print report uses the same explanation. Privacy summaries link to the existing policy and disclose provider processing and the policy's retention/model-improvement terms. The actual privacy policy and data-handling behavior were not changed.

The responsive signup form now permits its email input to shrink correctly, fixing a confirmed mobile horizontal-overflow defect. Its submission behavior is unchanged.

## Analytics

Events use the existing Microsoft Clarity integration, plus a local `costreno:tool-event` event for diagnostics. No new account, collector, database schema, or SDK is introduced. The helper accepts only fixed names at runtime and sends no quote content, filenames, ZIP codes, addresses, emails, project answers, budgets, or user identifiers. Analytics failure does not block the tools or navigation.

| Event | Meaning |
| --- | --- |
| `homepage_quote_clicked` | Visitor follows the homepage's main quote-review action. |
| `homepage_estimate_clicked` | Visitor follows the homepage's project-estimate action. |
| `nav_quote_clicked` | Visitor follows the shared navigation's quote-review action. |
| `sample_review_opened` | Visitor selects a sample-review link. A sample is not counted as a completed tool run. |
| `estimate_started` | A valid project is selected or a valid project draft is restored. Emitted once per run. |
| `estimate_completed` | Visitor reaches final estimate results after the questionnaire. Emitted once per run; Start over resets deduplication. |
| `quote_review_started` | Visitor submits at least one selected quote. |
| `quote_details_ready` | The basic one-quote extraction/details view is ready. |
| `quote_review_completed` | Basic one-quote details succeed, or all quotes in a multi-quote review finish. Count once for that standard-review submission. This is a product-use milestone, not verification that pricing or AI conclusions are correct. |
| `quote_review_failed` | The initial submitted review fails before its success milestone. |
| `quote_report_ready` | The optional advanced one-quote report finishes. Separate from standard completion to avoid counting that submission twice. |
| `quote_report_failed` | The optional advanced report fails while basic details remain available. |

In Clarity, use these names under Smart events and compare starts with completions. Custom events do not replace visitor analytics or demonstrate 1,000 daily visitors. Record the current visitor baseline and acquisition-source mix before setting growth milestones.

API documentation: [Clarity custom events](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-api#add-custom-events).

## Validation

`npm run test:marketing` exercises fixed-name analytics, runtime rejection of arbitrary event content, unavailable/blocked analytics, server-side use, funnel copy assertions, both review fixes, and the generated estimate report's detail-score disclosure. Production compilation, clean-install compatibility, and repository-wide checks are recorded in the pull request.

Browser checks use an isolated local preview with external services and all POST requests blocked. Homepage, upload controls, sample navigation, click-event delivery, and no horizontal overflow pass at 1280px, 375px, and 320px. The homepage, quote analyzer, and estimator serve meaningful initial HTML with one H1 and the existing production canonical URLs. The actual AI provider, production database, newsletter delivery, payment flows, and live analytics ingestion were not exercised. No live customer documents were uploaded.

The original repository has unrelated TypeScript and lint failures. The new sample and analytics modules pass focused lint. This change does not claim repository-wide checks are clean. Missing imports discovered in the edited homepage, quote route, and root were corrected; the existing database `eq` import was also fixed. The pricing algorithms were not changed.

## Release and next acquisition work

This work is prepared on `marketing/clear-quote-review`. It does not merge into `main` or change the live site. The repository's existing workflow automatically deploys production after a push to `main`, so review and merge are separate release decisions.

The next marketing phase is **distribution**, not more decorative redesign: improve genuinely useful city/project pages with verifiable local scope and sources, publish quote-review examples from explicitly permitted and anonymized material, build referral relationships with homeowner-facing partners, and measure acquisition and tool use weekly. No advertising spend, partner outreach, social publishing, purchased traffic, fabricated testimonials, or new analytics accounts are included. These changes improve the acquisition landing experience; they do not guarantee 1,000 daily visitors.
