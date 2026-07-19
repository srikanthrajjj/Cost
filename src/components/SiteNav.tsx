import { ChevronDown } from "lucide-react";

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

interface SiteNavProps {
  active?: "estimator" | "quote" | "guides";
}

export function SiteNav({ active }: SiteNavProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <a href="/" className="shrink-0">
          <img src="/logo.svg" alt="CostReno" style={{ height: "32px", width: "auto" }} />
        </a>
        <nav className="hidden lg:flex items-center gap-7 text-sm font-extrabold text-foreground absolute left-1/2 -translate-x-1/2">
          <a href="/estimate" className={`hover:text-foreground transition-colors whitespace-nowrap ${active === "estimator" ? "text-accent" : ""}`}>
            Cost Estimator
          </a>
          <a href="/quote-analyzer" className={`hover:text-foreground transition-colors whitespace-nowrap ${active === "quote" ? "text-accent" : ""}`}>
            Quote Review
          </a>
          <a href="#" className="hover:text-foreground transition-colors whitespace-nowrap">Insurance Claims</a>
          <div className="relative group">
            <button className={`hover:text-foreground transition-colors whitespace-nowrap flex items-center gap-1 ${active === "guides" ? "text-accent" : ""}`}>
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
          <a href="#" className="hover:text-foreground transition-colors whitespace-nowrap">Renovation Tools</a>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-bold text-accent-foreground shadow-sm hover:bg-accent/90 transition"
          >
            Start Free
          </a>
        </div>
      </div>
    </header>
  );
}
