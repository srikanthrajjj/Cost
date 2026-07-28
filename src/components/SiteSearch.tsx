import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Calculator,
  FileSearch,
  FolderKanban,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { POPULAR_SEARCHES, SEARCH_GROUPS, type SearchGroup } from "@/lib/search-catalog";
import { groupRankedResults, rankSearchResults, rankSuggestions } from "@/lib/smart-search";
import { cn } from "@/lib/utils";

const GROUP_ICON: Record<SearchGroup, typeof Search> = {
  Tools: Calculator,
  Topics: Sparkles,
  Guides: BookOpen,
  Projects: FolderKanban,
};

function highlightMatch(text: string, query: string) {
  const words = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .sort((a, b) => b.length - a.length);
  if (!words.length) return text;

  const lower = text.toLowerCase();
  let bestIdx = -1;
  let bestLen = 0;
  for (const word of words) {
    const idx = lower.indexOf(word);
    if (idx !== -1 && word.length > bestLen) {
      bestIdx = idx;
      bestLen = word.length;
    }
    // Prefix highlight for typos like "kitch" inside "Kitchen"
    for (let i = 0; i < lower.length; i++) {
      const slice = lower.slice(i, i + Math.max(word.length, 4));
      if (slice.startsWith(word) && word.length >= 3 && word.length > bestLen) {
        bestIdx = i;
        bestLen = word.length;
      }
    }
  }
  if (bestIdx === -1) return text;
  return (
    <>
      {text.slice(0, bestIdx)}
      <mark className="bg-primary/10 text-ink rounded-sm px-0.5 font-semibold not-italic">
        {text.slice(bestIdx, bestIdx + bestLen)}
      </mark>
      {text.slice(bestIdx + bestLen)}
    </>
  );
}

function goTo(href: string) {
  window.location.href = href;
}

type SiteSearchProps = {
  className?: string;
};

export function SiteSearch({ className }: SiteSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [shortcutLabel, setShortcutLabel] = useState("Ctrl K");

  useEffect(() => {
    if (/Mac|iPhone|iPad/i.test(navigator.platform)) {
      setShortcutLabel("⌘K");
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const ranked = useMemo(() => (query.trim() ? rankSearchResults(query) : []), [query]);
  const suggestions = useMemo(() => (query.trim() ? rankSuggestions(query) : []), [query]);
  const grouped = useMemo(() => groupRankedResults(ranked), [ranked]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex h-9 items-center gap-2 rounded-lg border border-border/80 bg-white text-sm text-muted-foreground transition hover:border-border hover:bg-muted/40 hover:text-ink",
          "w-9 justify-center px-0 sm:w-auto sm:justify-start sm:px-3",
          className,
        )}
        aria-label="Search the site"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center rounded border border-border bg-muted/60 px-1.5 font-mono text-[10px] font-medium text-muted-foreground xl:inline-flex">
          {shortcutLabel}
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={cn(
            "top-[18%] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl",
            "[&>button]:right-3 [&>button]:top-3 [&>button]:z-10",
            "[&>button]:data-[state=open]:bg-transparent [&>button]:data-[state=open]:text-muted-foreground",
          )}
        >
          <DialogTitle className="sr-only">Search CostReno</DialogTitle>
          <Command shouldFilter={false} className="rounded-lg border-0 shadow-none">
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder="Search guides, tools, and costs..."
              className="h-12 text-base"
            />
            <CommandList className="max-h-[min(420px,55vh)]">
              {query.trim() && ranked.length === 0 && suggestions.length === 0 && (
                <CommandEmpty>
                  No results for “{query.trim()}”. Try a project type or guide topic.
                </CommandEmpty>
              )}

              {!query.trim() ? (
                <CommandGroup heading="Popular searches">
                  {POPULAR_SEARCHES.map((term) => (
                    <CommandItem
                      key={term}
                      value={`popular ${term}`}
                      onSelect={() => setQuery(term)}
                      className="cursor-pointer data-[selected=true]:bg-muted data-[selected=true]:text-ink"
                    >
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <span className="text-ink">{term}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                <>
                  {suggestions.length > 0 && (
                    <CommandGroup heading="Suggestions">
                      {suggestions.map((term) => (
                        <CommandItem
                          key={term}
                          value={`suggest ${term}`}
                          onSelect={() => setQuery(term)}
                          className="cursor-pointer data-[selected=true]:bg-muted data-[selected=true]:text-ink"
                        >
                          <Search className="h-4 w-4 text-muted-foreground" />
                          <span className="text-ink">{highlightMatch(term, query)}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                  {SEARCH_GROUPS.map((group) => {
                    const items = grouped.get(group);
                    if (!items?.length) return null;
                    const Icon = GROUP_ICON[group];
                    return (
                      <CommandGroup key={group} heading={group}>
                        {items.map((item) => (
                          <CommandItem
                            key={item.href}
                            value={`${item.score} ${item.href} ${item.title}`}
                            onSelect={() => {
                              setOpen(false);
                              goTo(item.href);
                            }}
                            className="cursor-pointer items-start gap-3 py-2.5 data-[selected=true]:bg-muted data-[selected=true]:text-ink"
                          >
                            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <span className="min-w-0 flex-1">
                              <span className="block font-medium text-ink">
                                {highlightMatch(item.title, query)}
                              </span>
                              <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                                {item.description}
                              </span>
                            </span>
                            {item.href.startsWith("/locations") || item.group === "Projects" ? (
                              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                            ) : item.group === "Guides" ? (
                              <FileSearch className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                            ) : null}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    );
                  })}
                </>
              )}
            </CommandList>
            <div className="flex items-center justify-between border-t border-border/60 px-3 py-2 text-[11px] text-muted-foreground">
              <span>{query.trim() ? `${ranked.length} related result${ranked.length === 1 ? "" : "s"}` : "Type to find guides and tools"}</span>
              <span className="hidden sm:inline">
                <kbd className="rounded border border-border bg-muted/50 px-1 font-mono">↑↓</kbd> navigate{" "}
                <kbd className="ml-1 rounded border border-border bg-muted/50 px-1 font-mono">Enter</kbd> open{" "}
                <kbd className="ml-1 rounded border border-border bg-muted/50 px-1 font-mono">Esc</kbd> close
              </span>
            </div>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
