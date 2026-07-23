import { useState, useEffect } from "react";
import {
  GitCompare,
  X,
  Trash2,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Upload,
} from "lucide-react";
import {
  COMPARISON_UPDATED_EVENT,
  getComparisonQuotes,
  removeComparisonQuote,
  type SavedQuote,
} from "@/lib/quote/comparison-store";

interface QuoteComparisonTrayProps {
  onCompare: (ids: string[]) => void;
  onUploadAnother?: () => void;
}

export function QuoteComparisonTray({ onCompare, onUploadAnother }: QuoteComparisonTrayProps) {
  const [open, setOpen] = useState(false);
  const [quotes, setQuotes] = useState<SavedQuote[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const refresh = () => setQuotes(getComparisonQuotes());

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener("storage", handler);
    window.addEventListener(COMPARISON_UPDATED_EVENT, handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener(COMPARISON_UPDATED_EVENT, handler);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    refresh();
  }, [open]);

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const handleRemove = (id: string) => {
    removeComparisonQuote(id);
    const next = new Set(selected);
    next.delete(id);
    setSelected(next);
    refresh();
  };

  const projectType = quotes.length > 0 ? quotes[0].result.extraction.projectType : null;
  const hasMixedTypes =
    Boolean(projectType) &&
    quotes.some((q) => q.result.extraction.projectType !== projectType);

  const validToCompare = selected.size >= 2 && !hasMixedTypes;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          refresh();
          setOpen((prev) => !prev);
        }}
        className="relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-border text-xs font-medium text-ink hover:bg-muted/50"
      >
        <GitCompare className="h-3.5 w-3.5" />
        Compare
        {quotes.length > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-accent text-white text-[9px] font-bold flex items-center justify-center">
            {quotes.length}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Close compare tray"
            className="absolute inset-0 bg-black/20"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-sm h-full bg-white border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <GitCompare className="h-4 w-4 text-accent" />
                <span className="text-sm font-bold text-ink">Compare quotes</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-muted/50 flex items-center justify-center"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {quotes.length === 0 && (
                <div className="text-center py-8">
                  <BarChart3 className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No saved quotes yet.</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1 mb-4">
                    Tap Save to compare on a report, then analyze another quote.
                  </p>
                  {onUploadAnother && (
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        onUploadAnother();
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent text-white text-xs font-semibold hover:bg-accent/90 transition"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Upload another quote
                    </button>
                  )}
                </div>
              )}

              {quotes.length === 1 && (
                <div className="rounded-xl border border-border bg-muted/20 px-3 py-3 mb-1">
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    1 quote saved. Analyze and save at least one more to compare.
                  </p>
                  {onUploadAnother && (
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        onUploadAnother();
                      }}
                      className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-accent text-white text-xs font-semibold hover:bg-accent/90 transition"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Upload another quote
                    </button>
                  )}
                </div>
              )}

              {quotes.map((q) => {
                const e = q.result.extraction;
                const score = q.result.analysis.summary.completenessScore;
                const isSelected = selected.has(q.id);
                return (
                  <div
                    key={q.id}
                    className={`rounded-xl border p-4 transition ${
                      isSelected ? "border-accent bg-accent/5" : "border-border bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        aria-label={isSelected ? "Deselect quote" : "Select quote"}
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition ${
                          isSelected
                            ? "border-accent bg-accent"
                            : "border-muted-foreground/30"
                        }`}
                        onClick={() => toggleSelect(q.id)}
                      >
                        {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                      </button>
                      <button
                        type="button"
                        className="flex-1 min-w-0 text-left"
                        onClick={() => toggleSelect(q.id)}
                      >
                        <p className="text-sm font-bold text-ink truncate">
                          {e.contractor || "Unknown contractor"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{e.projectType}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs">
                          <span className="font-semibold text-ink">
                            ${e.totalPrice.toLocaleString()}
                          </span>
                          <span className="text-muted-foreground">Score: {score}/100</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(q.id)}
                        className="w-6 h-6 rounded-lg hover:bg-red-50 flex items-center justify-center shrink-0"
                        aria-label="Remove saved quote"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-4 py-4 border-t border-border space-y-2">
              {hasMixedTypes && (
                <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-700">
                    Can only compare quotes for the same project type.
                  </p>
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  if (!validToCompare) return;
                  onCompare(Array.from(selected));
                  setOpen(false);
                }}
                disabled={!validToCompare}
                className="w-full py-2.5 rounded-lg bg-accent text-white text-xs font-bold hover:bg-accent/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {selected.size >= 2
                  ? `Compare ${selected.size} quotes`
                  : selected.size === 1
                    ? "Select at least 2 quotes"
                    : "Select at least 2 quotes"}
              </button>
              {onUploadAnother && quotes.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onUploadAnother();
                  }}
                  className="w-full py-2.5 rounded-lg border border-border bg-white text-ink text-xs font-semibold hover:bg-muted/40 transition inline-flex items-center justify-center gap-1.5"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Upload another quote
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
