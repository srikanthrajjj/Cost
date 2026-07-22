import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const GUIDE_LINKS = [
  { name: "All guides", href: "/guides" },
  { name: "Quote guides", href: "/topics/quotes" },
  { name: "Roof costs", href: "/topics/roof" },
  { name: "Kitchen costs", href: "/topics/kitchen" },
  { name: "Window costs", href: "/topics/windows" },
  { name: "Flooring costs", href: "/topics/flooring" },
  { name: "Roofing", href: "/guides/roof-replacement" },
  { name: "Kitchen", href: "/guides/kitchen-remodel" },
];

const QUOTE_LINKS = [
  { name: "Analyze & compare quotes", href: "/quote-analyzer" },
  { name: "How to read a quote", href: "/guides/how-to-read-a-contractor-quote" },
];

interface SiteNavProps {
  active?: "estimator" | "quote" | "guides" | "locations";
}

export function SiteNav({ active }: SiteNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [guidesOpen, setGuidesOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <a href="/" className="shrink-0">
          <img src="/logo.svg" alt="CostReno" style={{ height: "32px", width: "auto" }} />
        </a>

        <nav className="hidden lg:flex items-center gap-7 text-sm font-extrabold text-foreground absolute left-1/2 -translate-x-1/2">
          <a
            href="/estimate"
            className={cn(
              "hover:text-foreground transition-colors whitespace-nowrap",
              active === "estimator" && "text-accent",
            )}
          >
            Cost estimator
          </a>
          <div className="relative group">
            <button
              className={cn(
                "hover:text-foreground transition-colors whitespace-nowrap flex items-center gap-1",
                active === "quote" && "text-accent",
              )}
            >
              Quote tools
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="w-48 rounded-xl border border-border bg-white shadow-xl p-2">
                {QUOTE_LINKS.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-sm font-medium text-ink hover:bg-muted/50 rounded-lg transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <a
            href="/locations"
            className={cn(
              "hover:text-foreground transition-colors whitespace-nowrap",
              active === "locations" && "text-accent",
            )}
          >
            Costs by city
          </a>
          <div className="relative group">
            <button
              className={cn(
                "hover:text-foreground transition-colors whitespace-nowrap flex items-center gap-1",
                active === "guides" && "text-accent",
              )}
            >
              Guides
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="w-44 rounded-xl border border-border bg-white shadow-xl p-2">
                {GUIDE_LINKS.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-sm font-medium text-ink hover:bg-muted/50 rounded-lg transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/estimate"
            className="inline-flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-bold text-accent-foreground shadow-sm hover:bg-accent/90 transition"
          >
            Start free
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex lg:hidden items-center justify-center rounded-lg p-2 text-foreground hover:bg-muted transition"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          <a href="/estimate" className="block text-sm font-semibold text-ink">
            Cost estimator
          </a>
          <button
            type="button"
            onClick={() => setQuoteOpen(!quoteOpen)}
            className="flex w-full items-center justify-between text-sm font-semibold text-ink"
          >
            Quote tools
            <ChevronDown className={cn("h-4 w-4 transition", quoteOpen && "rotate-180")} />
          </button>
          {quoteOpen && (
            <div className="pl-3 space-y-2">
              {QUOTE_LINKS.map((item) => (
                <a key={item.href} href={item.href} className="block text-sm text-muted-foreground">
                  {item.name}
                </a>
              ))}
            </div>
          )}
          <a href="/locations" className="block text-sm font-semibold text-ink">
            Costs by city
          </a>
          <a href="/methodology" className="block text-sm font-semibold text-ink">
            Methodology
          </a>
          <button
            type="button"
            onClick={() => setGuidesOpen(!guidesOpen)}
            className="flex w-full items-center justify-between text-sm font-semibold text-ink"
          >
            Guides
            <ChevronDown className={cn("h-4 w-4 transition", guidesOpen && "rotate-180")} />
          </button>
          {guidesOpen && (
            <div className="pl-3 space-y-2">
              {GUIDE_LINKS.map((item) => (
                <a key={item.href} href={item.href} className="block text-sm text-muted-foreground">
                  {item.name}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
