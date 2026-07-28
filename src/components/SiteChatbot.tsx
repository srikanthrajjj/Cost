import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouterState } from "@tanstack/react-router";
import {
  ArrowUp,
  BookOpen,
  Calculator,
  FileSearch,
  FolderKanban,
  Loader2,
  MessageCircle,
  Sparkles,
  X,
} from "lucide-react";
import {
  answerSiteQuestion,
  CHAT_INVITES,
  parseBroaderSearchResponse,
  STARTER_PROMPTS,
  type ChatLink,
} from "@/lib/site-chat-navigator";
import { serverSiteNavigatorBroaderSearch } from "@/lib/chat-server";
import type { SearchGroup } from "@/lib/search-catalog";
import { cn } from "@/lib/utils";

type Role = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: Role;
  text: string;
  links?: ChatLink[];
  pending?: boolean;
};

const GROUP_ICON: Record<SearchGroup, typeof Calculator> = {
  Tools: Calculator,
  Topics: Sparkles,
  Guides: BookOpen,
  Projects: FolderKanban,
};

function goTo(href: string) {
  window.location.href = href;
}

function WelcomeBody({ onPrompt }: { onPrompt: (prompt: string) => void }) {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-ink">
        Hi. I can help you find cost guides, estimate tools, and quote checkers across CostReno.
      </p>
      <div>
        <p className="mb-2 text-xs font-semibold text-muted-foreground">Try asking</p>
        <div className="flex flex-wrap gap-2">
          {STARTER_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onPrompt(prompt)}
              className="rounded-lg border border-border bg-white px-2.5 py-1.5 text-left text-xs font-medium text-ink transition hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function LinkCards({ links, onNavigate }: { links: ChatLink[]; onNavigate: () => void }) {
  return (
    <ul className="mt-2.5 space-y-1.5">
      {links.map((link) => {
        const Icon = GROUP_ICON[link.group] ?? FileSearch;
        return (
          <li key={link.href}>
            <a
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                onNavigate();
                goTo(link.href);
              }}
              className="flex gap-2.5 rounded-xl border border-border/80 bg-white px-2.5 py-2 transition hover:border-border hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
                <Icon className="h-3.5 w-3.5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold text-ink">{link.title}</span>
                <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground line-clamp-2">
                  {link.description}
                </span>
                <span className="mt-1 block text-[10px] font-medium uppercase tracking-wide text-muted-foreground/80">
                  {link.group}
                </span>
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Site-wide floating navigator. Uses catalog + smart-search matching (no LLM required for v1).
 */
export function SiteChatbot() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inviteIndex, setInviteIndex] = useState(0);
  const [inviteVisible, setInviteVisible] = useState(true);
  const [inviteDismissed, setInviteDismissed] = useState(false);
  const [busy, setBusy] = useState(false);

  const hideOnAdmin = pathname.startsWith("/admin");
  /** Homepage already has the full AI hero chat (estimate + quotes). Avoid two bots. */
  const hideOnHome = pathname === "/";
  const isQuoteAnalyzer = pathname.startsWith("/quote-analyzer");
  const invite = CHAT_INVITES[inviteIndex % CHAT_INVITES.length];

  useEffect(() => {
    if (open || inviteDismissed || hideOnHome) return;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rotateMs = reduceMotion ? 12000 : 7000;
    const timer = window.setInterval(() => {
      setInviteVisible(false);
      window.setTimeout(
        () => {
          setInviteIndex((i) => i + 1);
          setInviteVisible(true);
        },
        reduceMotion ? 0 : 220,
      );
    }, rotateMs);
    return () => window.clearInterval(timer);
  }, [open, inviteDismissed, hideOnHome]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [messages, open]);

  if (hideOnAdmin || hideOnHome) return null;

  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || busy) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
    };
    const catalog = answerSiteQuestion(text);

    if (!catalog.needsBroaderSearch) {
      setMessages((prev) => [
        ...prev,
        userMsg,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: catalog.text,
          links: catalog.links,
        },
      ]);
      setInput("");
      return;
    }

    const pendingId = `a-${Date.now()}`;
    setBusy(true);
    setInput("");
    setMessages((prev) => [
      ...prev,
      userMsg,
      {
        id: pendingId,
        role: "assistant",
        text: catalog.text,
        links: catalog.links,
        pending: true,
      },
    ]);

    try {
      const apiRaw = await serverSiteNavigatorBroaderSearch({ data: { query: text } });
      const parsed = parseBroaderSearchResponse(apiRaw);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === pendingId
            ? {
                ...msg,
                pending: false,
                text: `No matching articles found for “${text}”.\n\nBroader search:\n${parsed.text}`,
                links: parsed.links,
              }
            : msg,
        ),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Broader search is unavailable right now.";
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === pendingId
            ? {
                ...msg,
                pending: false,
                text: `No matching articles found for “${text}”.\n\n${message}\n\nTry the estimator, quote tools, or browse all guides below.`,
                links: catalog.links,
              }
            : msg,
        ),
      );
    } finally {
      setBusy(false);
    }
  };

  const openWithPrompt = (prompt: string) => {
    setInviteDismissed(true);
    setOpen(true);
    window.setTimeout(() => {
      void send(prompt);
    }, 80);
  };

  const panel = open && typeof document !== "undefined"
    ? createPortal(
        <div
          className={cn(
            "fixed z-[75] flex flex-col",
            isQuoteAnalyzer
              ? "bottom-24 right-4 lg:bottom-[5.25rem]"
              : "bottom-[5.25rem] right-4",
            "w-[min(100vw-1.5rem,22.5rem)]",
          )}
        >
          <div
            ref={panelRef}
            id="site-chatbot-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative flex max-h-[min(70vh,32rem)] flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl shadow-primary/10 outline-none transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none"
          >
            <div className="flex items-start gap-3 border-b border-border/70 bg-primary px-4 py-3 text-primary-foreground">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <MessageCircle className="h-4 w-4" aria-hidden />
              </div>
              <div className="min-w-0 flex-1 pr-6">
                <h2 id={titleId} className="text-sm font-semibold tracking-tight">
                  CostReno guide
                </h2>
                <p className="mt-0.5 text-xs text-white/75">
                  Guides first, broader search if needed
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 rounded-md p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div
              ref={listRef}
              className="flex-1 space-y-3 overflow-y-auto bg-muted/20 px-3 py-3"
              aria-live="polite"
            >
              {messages.length === 0 ? (
                <div className="rounded-xl border border-border/80 bg-white px-3 py-3">
                  <WelcomeBody onPrompt={(p) => void send(p)} />
                </div>
              ) : (
                messages.map((msg) =>
                  msg.role === "user" ? (
                    <div key={msg.id} className="flex justify-end">
                      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3 py-2 text-sm text-primary-foreground">
                        {msg.text}
                      </div>
                    </div>
                  ) : (
                    <div key={msg.id} className="flex justify-start">
                      <div className="max-w-[95%] rounded-2xl rounded-bl-md border border-border/80 bg-white px-3 py-2.5 text-sm text-ink shadow-sm">
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        {msg.pending && (
                          <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                            Searching more broadly…
                          </p>
                        )}
                        {msg.links && msg.links.length > 0 && !msg.pending && (
                          <LinkCards links={msg.links} onNavigate={() => setOpen(false)} />
                        )}
                      </div>
                    </div>
                  ),
                )
              )}
            </div>

            <form
              className="border-t border-border/70 bg-white p-2.5"
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
            >
              <div className="flex items-center gap-2 rounded-xl border border-border bg-white px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-primary/25">
                <label htmlFor="site-chat-input" className="sr-only">
                  Ask about renovation costs or guides
                </label>
                <input
                  ref={inputRef}
                  id="site-chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about costs, quotes, or guides…"
                  autoComplete="off"
                  disabled={busy}
                  className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-ink placeholder:text-muted-foreground focus:outline-none disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || busy}
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  aria-label="Send message"
                >
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <ArrowUp className="h-4 w-4" aria-hidden />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      {!open && !inviteDismissed && (
        <div
          className={cn(
            "fixed z-[70] max-w-[14.5rem]",
            isQuoteAnalyzer ? "bottom-24 right-[4.75rem] lg:bottom-5" : "bottom-5 right-[4.75rem]",
            "transition-opacity duration-200 motion-reduce:transition-none",
            inviteVisible ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="relative rounded-xl border border-border bg-white px-3 py-2.5 shadow-lg shadow-primary/10">
            <button
              type="button"
              onClick={() => openWithPrompt(invite.prompt)}
              className="pr-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-md"
            >
              <p className="text-xs font-semibold text-ink">{invite.bubble}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Tap to ask · find answers</p>
            </button>
            <button
              type="button"
              onClick={() => setInviteDismissed(true)}
              className="absolute right-1 top-1 rounded p-1 text-muted-foreground hover:bg-muted/50 hover:text-ink"
              aria-label="Dismiss suggestion"
            >
              <X className="h-3 w-3" />
            </button>
            <span
              className="absolute -right-1.5 bottom-3 h-3 w-3 rotate-45 border-r border-t border-border bg-white"
              aria-hidden
            />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          setInviteDismissed(true);
          setOpen((prev) => !prev);
        }}
        className={cn(
          "fixed z-[70] inline-flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition",
          "hover:scale-[1.03] hover:bg-[#0a355c] motion-reduce:hover:scale-100",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
          isQuoteAnalyzer ? "bottom-24 right-4 lg:bottom-5" : "bottom-5 right-4",
          open && "ring-2 ring-primary/20",
        )}
        aria-label={open ? "Close CostReno guide chat" : "Open CostReno guide chat"}
        aria-expanded={open}
        aria-controls={open ? "site-chatbot-panel" : undefined}
      >
        {open ? <X className="h-5 w-5" aria-hidden /> : <MessageCircle className="h-5 w-5" aria-hidden />}
      </button>

      {panel}
    </>
  );
}
