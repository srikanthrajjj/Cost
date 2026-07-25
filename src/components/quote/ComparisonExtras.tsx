import { useRef, useState } from "react";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import type { SavedQuote } from "@/lib/quote/comparison-store";
import { serverChatWithKnowledge } from "@/lib/chat-server";
import type { ChatMessage } from "@/lib/chat-with-knowledge";
import type { ComparisonScore } from "@/lib/quote/comparison-report";

export type { ComparisonScore };
export {
  buildComparisonReportHtml,
  computeComparisonScores,
  getBestComparisonIndex,
  printComparisonReport,
} from "@/lib/quote/comparison-report";

export interface ComparisonScoreSummary {
  composite: number;
  riskLevel: "Low" | "Medium" | "High";
  valueBadge: string;
}

export function toComparisonScoreSummary(scores: ComparisonScore[]): ComparisonScoreSummary[] {
  return scores.map((s) => ({
    composite: s.composite,
    riskLevel: s.riskLevel,
    valueBadge: s.valueBadge,
  }));
}

function formatComparisonAIResponse(text: string): string {
  let html = text.replace(/\[ACTION:[^\]]*\]/g, "");
  html = html.replace(/^### (.+)$/gm, '<p class="font-bold text-ink mt-2 mb-1">$1</p>');
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(
    /^- (.+)$/gm,
    '<li class="flex items-start gap-2"><span class="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0"></span><span>$1</span></li>',
  );
  html = html.replace(/((?:<li[^>]*>.*?<\/li>\s*)+)/g, '<ul class="space-y-1.5">$1</ul>');
  html = html.replace(/\n{2,}/g, '</p><p class="mt-2">');
  html = html.replace(/\n/g, "<br/>");
  return html;
}

export function buildComparisonContext(
  quotes: SavedQuote[],
  scores: ComparisonScoreSummary[],
  bestIdx: number,
): string {
  const best = quotes[bestIdx];
  const parts = [
    `Comparing ${quotes.length} contractor quotes.`,
    `Recommended: ${best.result.extraction.contractor || `Quote ${bestIdx + 1}`} (score ${scores[bestIdx]?.composite ?? "n/a"}/100, total $${best.result.extraction.totalPrice.toLocaleString()}).`,
  ];
  quotes.forEach((q, idx) => {
    const e = q.result.extraction;
    const a = q.result.analysis;
    const s = scores[idx];
    parts.push(
      [
        `Quote ${idx + 1}: ${e.contractor || "Unknown contractor"}`,
        `price $${e.totalPrice.toLocaleString()}`,
        `completeness ${a.summary.completenessScore}%`,
        `AI score ${s?.composite ?? "n/a"}`,
        `risk ${s?.riskLevel ?? "n/a"}`,
        `red flags ${a.redFlags.length}`,
        `missing scope ${a.missingScope.length}`,
        e.warranties.length ? "has warranty notes" : "no warranty notes",
        e.permits.length ? "mentions permits" : "no permit notes",
      ].join("; "),
    );
  });
  return parts.join(" ");
}

export function ComparisonAIChatPanel({
  quotes,
  scores,
  bestIdx,
  onClose,
}: {
  quotes: SavedQuote[];
  scores: ComparisonScoreSummary[];
  bestIdx: number;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "Which quote should I choose and why?",
    "What should I negotiate on the recommended bid?",
    "Where do these quotes differ the most?",
    "What questions should I ask before signing?",
  ];

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg = { role: "user" as const, text: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

    try {
      const contextSummary = buildComparisonContext(quotes, scores, bestIdx);
      const chatMsgs: ChatMessage[] = newMessages.map((m, idx) => ({
        role: m.role === "ai" ? ("assistant" as const) : ("user" as const),
        content:
          idx === 0 && newMessages.length === 1
            ? `[Quote Comparison Context: ${contextSummary}]\n\nIMPORTANT: Keep your response concise — 3-5 bullet points max. Be direct and actionable for a homeowner.\n\nMy question: ${m.text}`
            : m.text,
      }));

      if (newMessages.length > 1) {
        chatMsgs.unshift(
          {
            role: "user",
            content: `I compared ${quotes.length} contractor quotes. Summary: ${contextSummary}. IMPORTANT: Keep responses concise — 3-5 bullet points max.`,
          },
          {
            role: "assistant",
            content: "Got it. I will keep answers short and practical. Ask away.",
          },
        );
      }

      const projectType = quotes[bestIdx]?.result.extraction.projectType;
      const response = await serverChatWithKnowledge({
        data: { messages: chatMsgs, userProjectType: projectType || undefined },
      });
      setMessages((prev) => [...prev, { role: "ai", text: response }]);
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Sorry, I encountered an error. Please try again.";
      setMessages((prev) => [...prev, { role: "ai", text: message }]);
    } finally {
      setIsTyping(false);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] z-50 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="absolute inset-0 bg-black/40 sm:hidden" onClick={onClose} />
      <div className="relative ml-auto w-full sm:w-[420px] h-full bg-white shadow-2xl border-l border-border flex flex-col">
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#082A4B] shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-bold text-white">CostReno AI</span>
            <span className="px-1.5 py-0.5 rounded bg-accent/30 text-[9px] text-white font-bold uppercase">
              Compare context
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center transition"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col py-4">
              <h3 className="text-base font-bold text-ink mb-1">Ask about these quotes</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Answers use all {quotes.length} bids together, not just one report.
              </p>
              <div className="space-y-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => sendMessage(s)}
                    className="w-full flex items-center gap-3 text-left px-4 py-2.5 rounded-xl border border-border hover:border-accent/40 hover:bg-accent/5 text-sm text-ink transition"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-accent shrink-0" />
                    <span className="flex-1 text-xs">{s}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-accent text-white rounded-br-md"
                    : "bg-muted text-ink rounded-bl-md"
                }`}
              >
                {msg.role === "user" ? (
                  msg.text
                ) : (
                  <div
                    className="space-y-2"
                    dangerouslySetInnerHTML={{ __html: formatComparisonAIResponse(msg.text) }}
                  />
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-muted">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border px-4 py-3">
          <div className="flex items-center gap-2 rounded-xl border border-border p-2 focus-within:ring-2 focus-within:ring-accent/30">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim()) sendMessage(input);
              }}
              placeholder="Ask about these quotes..."
              className="flex-1 bg-transparent text-sm outline-none px-2 text-ink"
            />
            <button
              type="button"
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white hover:bg-accent/90 disabled:opacity-50 transition"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
