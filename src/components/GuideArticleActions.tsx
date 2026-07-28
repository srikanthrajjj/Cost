import { useEffect, useMemo, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Check, Heart, Share2 } from "lucide-react";

function normalizeTitle(rawTitle: string) {
  return rawTitle.replace(/\s+\|\s+CostReno$/, "").trim();
}

export function GuideArticleActions() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isGuideArticle = pathname.startsWith("/guides/") && pathname !== "/guides/";

  const likeStorageKey = useMemo(() => `costreno-guide-like:${pathname}`, [pathname]);
  const likeCountStorageKey = useMemo(() => `costreno-guide-like-count:${pathname}`, [pathname]);

  const [articleTitle, setArticleTitle] = useState("This guide");
  const [articleDescription, setArticleDescription] = useState("");
  const [articleUrl, setArticleUrl] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [shareState, setShareState] = useState<"idle" | "copied" | "shared">("idle");

  useEffect(() => {
    if (!isGuideArticle || typeof window === "undefined") return;

    setArticleUrl(window.location.href);
    setArticleTitle(normalizeTitle(document.title || "This guide"));
    setArticleDescription(
      document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "",
    );

    try {
      setLiked(localStorage.getItem(likeStorageKey) === "1");
      setLikeCount(Number(localStorage.getItem(likeCountStorageKey) ?? "0"));
    } catch {
      /* ignore storage access issues */
    }
  }, [isGuideArticle, likeCountStorageKey, likeStorageKey, pathname]);

  useEffect(() => {
    if (shareState === "idle") return;
    const timer = window.setTimeout(() => setShareState("idle"), 2200);
    return () => window.clearTimeout(timer);
  }, [shareState]);

  if (!isGuideArticle) return null;

  const toggleLike = () => {
    const nextLiked = !liked;
    const nextCount = Math.max(0, likeCount + (nextLiked ? 1 : -1));

    setLiked(nextLiked);
    setLikeCount(nextCount);

    try {
      localStorage.setItem(likeStorageKey, nextLiked ? "1" : "0");
      localStorage.setItem(likeCountStorageKey, String(nextCount));
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
          title: articleTitle,
          text: articleDescription,
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
    <>
      <div className="pointer-events-none fixed right-4 bottom-28 z-40 hidden lg:block xl:bottom-24">
        <div className="pointer-events-auto w-60 rounded-2xl border border-primary/10 bg-white/95 p-3 shadow-lg shadow-primary/10 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Enjoying this guide?
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-ink">{likeCount}</span>
            <span>{likeCount === 1 ? "like" : "likes"}</span>
          </div>
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

      <div className="pointer-events-none fixed right-3 bottom-24 z-40 lg:hidden">
        <div className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-primary/10 bg-white/95 px-3 py-2 shadow-lg shadow-primary/10 backdrop-blur-sm">
          <button
            type="button"
            onClick={toggleLike}
            aria-pressed={liked}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Heart
              className={
                liked
                  ? "h-4 w-4 fill-current text-primary motion-safe:animate-pulse"
                  : "h-4 w-4 text-muted-foreground transition-transform duration-200 motion-safe:animate-[pulse_3.8s_ease-in-out_infinite]"
              }
              aria-hidden="true"
            />
            {likeCount}
          </button>
          <button
            type="button"
            onClick={shareArticle}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/92 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
      </div>
    </>
  );
}
