import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Check, Heart, Share2 } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

interface GuideArticleProps {
  title: string;
  description: string;
  lastUpdated: string;
  cluster?: { label: string; href: string };
  children: ReactNode;
  faqs?: { q: string; a: string }[];
  related?: { title: string; href: string }[];
}

export function GuideArticle({
  title,
  description,
  lastUpdated,
  cluster,
  children,
  faqs = [],
  related = [],
}: GuideArticleProps) {
  const likeStorageKey = useMemo(
    () => `costreno-guide-like:${title.toLowerCase().replace(/\s+/g, "-")}`,
    [title],
  );
  const [articleUrl, setArticleUrl] = useState("");
  const [liked, setLiked] = useState(false);
  const [shareState, setShareState] = useState<"idle" | "copied" | "shared">("idle");

  useEffect(() => {
    if (typeof window === "undefined") return;
    setArticleUrl(window.location.href);
    try {
      setLiked(localStorage.getItem(likeStorageKey) === "1");
    } catch {
      /* ignore storage access issues */
    }
  }, [likeStorageKey]);

  useEffect(() => {
    if (shareState === "idle") return;
    const timer = window.setTimeout(() => setShareState("idle"), 2200);
    return () => window.clearTimeout(timer);
  }, [shareState]);

  const toggleLike = () => {
    const next = !liked;
    setLiked(next);
    try {
      localStorage.setItem(likeStorageKey, next ? "1" : "0");
    } catch {
      /* ignore storage access issues */
    }
  };

  const shareArticle = async () => {
    const shareUrl = articleUrl || (typeof window !== "undefined" ? window.location.href : "");
    if (!shareUrl) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
        setShareState("shared");
        return;
      }
    } catch {
      /* fall back to clipboard */
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareState("copied");
    } catch {
      if (typeof window !== "undefined") {
        window.prompt("Copy this article link:", shareUrl);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav active="guides" />
      <main className="container-x py-10 md:py-14">
        <div className="pointer-events-none fixed right-4 bottom-28 z-40 hidden lg:block xl:bottom-24">
          <div className="pointer-events-auto w-56 rounded-2xl border border-primary/10 bg-white/95 p-3 shadow-lg shadow-primary/10 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Enjoying this guide?
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={toggleLike}
                aria-pressed={liked}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Heart
                  className={
                    liked
                      ? "h-4 w-4 fill-current text-primary motion-safe:animate-pulse"
                      : "h-4 w-4 text-muted-foreground transition-transform duration-200 motion-safe:animate-[pulse_3.8s_ease-in-out_infinite]"
                  }
                  aria-hidden="true"
                />
                {liked ? "Liked" : "Like"}
              </button>
              <button
                type="button"
                onClick={shareArticle}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/92 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {shareState === "idle" ? (
                  <Share2 className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Check className="h-4 w-4" aria-hidden="true" />
                )}
                {shareState === "copied"
                  ? "Copied"
                  : shareState === "shared"
                    ? "Shared"
                    : "Share"}
              </button>
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Share this article link or save it for later.
            </p>
          </div>
        </div>

        <article className="max-w-3xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <li>
                <a href="/" className="hover:text-primary">
                  Home
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <a href="/guides" className="hover:text-primary">
                  Guides
                </a>
              </li>
              {cluster && (
                <>
                  <li aria-hidden="true">/</li>
                  <li>
                    <a href={cluster.href} className="hover:text-primary">
                      {cluster.label}
                    </a>
                  </li>
                </>
              )}
              <li aria-hidden="true">/</li>
              <li className="text-ink truncate max-w-[14rem]">{title}</li>
            </ol>
          </nav>

          <p className="text-xs text-muted-foreground mb-3">Last reviewed {lastUpdated}</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink leading-tight mb-4">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10">{description}</p>

          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-primary/10 bg-primary/[0.03] p-3 lg:hidden">
            <button
              type="button"
              onClick={toggleLike}
              aria-pressed={liked}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Heart
                className={
                  liked
                    ? "h-4 w-4 fill-current text-primary motion-safe:animate-pulse"
                    : "h-4 w-4 text-muted-foreground transition-transform duration-200 motion-safe:animate-[pulse_3.8s_ease-in-out_infinite]"
                }
                aria-hidden="true"
              />
              {liked ? "Liked" : "Like"}
            </button>
            <button
              type="button"
              onClick={shareArticle}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/92 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {shareState === "idle" ? (
                <Share2 className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Check className="h-4 w-4" aria-hidden="true" />
              )}
              {shareState === "copied"
                ? "Copied link"
                : shareState === "shared"
                  ? "Shared"
                  : "Share article"}
            </button>
          </div>

          <div className="prose-like space-y-6 text-sm md:text-base text-muted-foreground leading-relaxed">
            {children}
          </div>

          {faqs.length > 0 && (
            <section className="mt-14 pt-10 border-t border-border">
              <h2 className="font-display text-2xl font-bold text-ink mb-6">
                Frequently asked questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.q} className="rounded-xl border border-border bg-white p-5">
                    <h3 className="font-semibold text-ink mb-2">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {related.length > 0 && (
            <section className="mt-12 pt-8 border-t border-border">
              <h2 className="font-display text-xl font-bold text-ink mb-4">Related reading</h2>
              <ul className="space-y-2">
                {related.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="text-sm text-primary hover:underline">
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-12 rounded-2xl border border-border bg-muted/20 p-6">
            <h2 className="font-display text-lg font-bold text-ink mb-2">Next step</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Have a bid in hand? Analyze one quote, or compare two side by side.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/quote-analyzer"
                className="inline-flex rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent/90"
              >
                Analyze a quote
              </a>
              <a
                href="/compare-quotes"
                className="inline-flex rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-muted"
              >
                Compare quotes
              </a>
            </div>
          </section>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
