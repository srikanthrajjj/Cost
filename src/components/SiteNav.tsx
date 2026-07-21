import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const GUIDE_LINKS = [
  { name: "Roofing", href: "/guides/roof-replacement" },
  { name: "Kitchen", href: "/guides/kitchen-remodel" },
  { name: "Bathroom", href: "/guides/bathroom-remodel" },
  { name: "HVAC", href: "/guides/hvac-installation" },
  { name: "Windows", href: "/guides/window-replacement" },
  { name: "Flooring", href: "/guides/flooring" },
  { name: "Solar", href: "#" },
  { name: "Foundation", href: "#" },
];

const QUOTE_LINKS = [
  { name: "Analyze quote", href: "/quote-analyzer" },
  { name: "Compare multiple quotes", href: "/compare-quotes" },
];

interface SiteNavProps {
  active?: "estimator" | "quote" | "guides";
}

export function SiteNav({ active }: SiteNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [guidesOpen, setGuidesOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);

  const linkClass = (isActive?: boolean) =>
    cn(
      "hover:text-foreground transition-colors whitespace-nowrap",
      isActive && active === "guides" ? "text-accent" : "",
    );

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <a href="/" className="shrink-0">
          <img src="/logo.svg" alt="CostReno" style={{ height: "32px", width: "auto" }} />
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-extrabold text-foreground absolute left-1/2 -translate-x-1/2">
          <a
            href="/estimate"
            className={cn(
              "hover:text-foreground transition-colors whitespace-nowrap",
              active === "estimator" && "text-accent",
            )}
          >
            Cost Estimator
          </a>
          <div className="relative group">
            <button
              className={cn(
                "hover:text-foreground transition-colors whitespace-nowrap flex items-center gap-1",
                active === "quote" && "text-accent",
              )}
            >
              Quote Review
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
          <a href="#" className="hover:text-foreground transition-colors whitespace-nowrap">
            Insurance Claims
          </a>
          <div className="relative group">
            <button
              className={cn(
                "hover:text-foreground transition-colors whitespace-nowrap flex items-center gap-1",
                active === "guides" && "text-accent",
              )}
            >
              Renovation Guides
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

        {/* Right side */}
        <div className="flex items-center gap-3">
          <a
            href="/estimate"
            className="inline-flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-bold text-accent-foreground shadow-sm hover:bg-accent/90 transition"
          >
            Start Free
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

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-border/60 bg-background">
          <nav className="container-x flex flex-col gap-1 py-4 text-sm font-extrabold text-foreground">
            <a
              href="/estimate"
              onClick={() => setMenuOpen(false)}
              className={cn(
                "rounded-lg px-3 py-2.5 transition-colors",
                active === "estimator" ? "text-accent bg-accent/5" : "hover:bg-muted",
              )}
            >
              Cost Estimator
            </a>
            <div>
              <button
                type="button"
                onClick={() => setQuoteOpen(!quoteOpen)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2.5 transition-colors",
                  active === "quote" ? "text-accent bg-accent/5" : "hover:bg-muted",
                )}
              >
                Quote Review
                <ChevronDown
                  className={cn("h-3.5 w-3.5 transition-transform", quoteOpen && "rotate-180")}
                />
              </button>
              {quoteOpen && (
                <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-border pl-3">
                  {QUOTE_LINKS.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-muted transition-colors"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <a
              href="#"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 hover:bg-muted transition-colors"
            >
              Insurance Claims
            </a>
            <div>
              <button
                type="button"
                onClick={() => setGuidesOpen(!guidesOpen)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2.5 transition-colors",
                  active === "guides" ? "text-accent bg-accent/5" : "hover:bg-muted",
                )}
              >
                Renovation Guides
                <ChevronDown
                  className={cn("h-3.5 w-3.5 transition-transform", guidesOpen && "rotate-180")}
                />
              </button>
              {guidesOpen && (
                <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-border pl-3">
                  {GUIDE_LINKS.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-muted transition-colors"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
