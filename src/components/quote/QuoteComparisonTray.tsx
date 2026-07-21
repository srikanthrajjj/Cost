import { useState, useEffect } from "react";
import { GitCompare, X, Trash2, BarChart3, DollarSign, AlertTriangle, CheckCircle2 } from "lucide-react";
import { getComparisonQuotes, removeComparisonQuote, type SavedQuote } from "@/lib/quote/comparison-store";

interface QuoteComparisonTrayProps {
  onCompare: (ids: string[]) => void;
}

export function QuoteComparisonTray({ onCompare }: QuoteComparisonTrayProps) {
  const [open, setOpen] = useState(false);
  const [quotes, setQuotes] = useState<SavedQuote[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const refresh = () => setQuotes(getComparisonQuotes());

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

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
  const hasMixedTypes = projectType && quotes.some((q) => q.result.extraction.projectType !== projectType);

  const validToCompare = selected.size >= 2 && !hasMixedTypes;

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
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

      {/* Slide-out tray */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="w-full max-w-sm bg-white border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <GitCompare className="h-4 w-4 text-accent" />
                <span className="text-sm font-bold text-ink">Compare quotes</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-muted/50 flex items-center justify-center"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {quotes.length === 0 && (
                <div className="text-center py-8">
                  <BarChart3 className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No saved quotes yet.</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">
                    Analyze a quote then save it here to compare.
                  </p>
                </div>
              )}

              {quotes.map((q) => {
                const e = q.result.extraction;
                const score = q.result.analysis.summary.completenessScore;
                const isSelected = selected.has(q.id);
                return (
                  <div
                    key={q.id}
                    className={`rounded-xl border p-4 transition ${isSelected ? "border-accent bg-accent/5" : "border-border bg-white"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 cursor-pointer transition ${isSelected ? "border-accent bg-accent" : "border-muted-foreground/30"}`}
                        onClick={() => toggleSelect(q.id)}
                      >
                        {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
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
                      </div>
                      <button
                        onClick={() => handleRemove(q.id)}
                        className="w-6 h-6 rounded-lg hover:bg-red-50 flex items-center justify-center shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
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
                onClick={() => {
                  if (validToCompare) {
                    onCompare(Array.from(selected));
                    setOpen(false);
                  }
                }}
                disabled={!validToCompare}
                className="w-full py-2.5 rounded-lg bg-accent text-white text-xs font-bold hover:bg-accent/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Compare {selected.size > 1 ? `${selected.size} quotes` : selected.size === 1 ? "1 quote (select at least 2)" : "(select at least 2 quotes)"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
