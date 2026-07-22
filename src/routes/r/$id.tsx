import { useMemo, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Download, Share2 } from "lucide-react";
import { loadComparisonShare } from "@/lib/quote/comparison-share";
import {
  buildComparisonReportHtml,
  computeComparisonScores,
  getBestComparisonIndex,
  printComparisonReport,
} from "@/lib/quote/comparison-report";

export const Route = createFileRoute("/r/$id")({
  loader: async ({ params }) => {
    const report = await loadComparisonShare({ data: { id: params.id } });
    if (!report) throw notFound();
    return report;
  },
  head: ({ params }) => {
    const title = "Shared quote comparison | CostReno";
    const description =
      "View a shared CostReno contractor quote comparison. Unlisted link. Analyze your own quotes free.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "noindex, nofollow" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: `https://costreno.com/r/${params.id}` },
      ],
    };
  },
  notFoundComponent: SharedComparisonNotFound,
  component: SharedComparisonPage,
});

function SharedComparisonNotFound() {
  return (
    <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-ink">Link not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This comparison link may have expired or never existed. Create a new comparison on CostReno.
        </p>
        <Link
          to="/quote-analyzer"
          className="mt-6 inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90"
        >
          Compare my quotes
        </Link>
      </div>
    </div>
  );
}

function SharedComparisonPage() {
  const report = Route.useLoaderData();
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://costreno.com/r/${report.id}`;

  const html = useMemo(() => {
    const scores = computeComparisonScores(report.quotes);
    const bestIdx = getBestComparisonIndex(scores);
    return buildComparisonReportHtml({
      quotes: report.quotes,
      scores,
      bestIdx,
      options: { shareUrl },
    });
  }, [report, shareUrl]);

  const copyLink = async () => {
    const url = typeof window !== "undefined" ? window.location.href.split("?")[0] : shareUrl;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-[#eef1f5] flex flex-col">
      <header className="sticky top-0 z-20 border-b border-border bg-white">
        <div className="max-w-4xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <a href="/" className="font-display text-lg font-bold text-ink">
              CostReno
            </a>
            <p className="text-xs text-muted-foreground">Shared quote comparison report</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => printComparisonReport(html)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-ink hover:bg-muted/50"
            >
              <Download className="h-3.5 w-3.5" /> Download / print
            </button>
            <button
              type="button"
              onClick={() => void copyLink()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-ink hover:bg-muted/50"
            >
              <Share2 className="h-3.5 w-3.5" /> {copied ? "Copied" : "Copy link"}
            </button>
            <a
              href="/quote-analyzer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent/90"
            >
              Compare my quotes free
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">
        <iframe
          title="CostReno quote comparison report"
          srcDoc={html}
          className="w-full border-0 block bg-[#eef1f5]"
          style={{ minHeight: "100vh" }}
          sandbox="allow-same-origin"
          onLoad={(event) => {
            const frame = event.currentTarget;
            const doc = frame.contentDocument;
            if (!doc?.body) return;
            frame.style.height = `${Math.max(doc.body.scrollHeight + 48, window.innerHeight)}px`;
          }}
        />
      </main>
    </div>
  );
}
