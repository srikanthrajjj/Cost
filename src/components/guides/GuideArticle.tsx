import type { ReactNode } from "react";
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
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav active="guides" />
      <main className="container-x py-10 md:py-14">
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
