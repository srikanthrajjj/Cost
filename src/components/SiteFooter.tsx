import { NewsletterSignup } from "./NewsletterSignup";

export function SiteFooter() {
  return (
    <footer className="bg-[#082A4B] text-white">
      {/* Newsletter Banner */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-lg font-bold text-white mb-1">
                Stay updated on renovation costs
              </h3>
              <p className="text-sm text-white/50">
                Get monthly market data, new tools, and guides. No spam.
              </p>
            </div>
            <div className="w-full md:w-auto md:min-w-[360px]">
              <NewsletterSignup source="footer" compact />
            </div>
          </div>
        </div>
      </div>
      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <a href="/" className="inline-block mb-4">
              <img src="/logo.svg" alt="CostReno" style={{ height: "32px", width: "auto" }} />
            </a>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs mb-5">
              Clear home renovation cost estimates, AI-powered quote analysis, and expert guides to
              help you make confident decisions.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-4">Tools</h3>
            <ul className="space-y-2.5">
              <li>
                <a href="/estimate" className="text-sm text-white/70 hover:text-accent transition">
                  Cost Estimator
                </a>
              </li>
              <li>
                <a
                  href="/quote-analyzer"
                  className="text-sm text-white/70 hover:text-accent transition"
                >
                  Quote Analyzer
                </a>
              </li>
              <li>
                <a
                  href="/kitchen-remodel-cost"
                  className="text-sm text-white/70 hover:text-accent transition"
                >
                  Kitchen Estimator
                </a>
              </li>
              <li>
                <a
                  href="/estimate?project=roof"
                  className="text-sm text-white/70 hover:text-accent transition"
                >
                  Roof Estimator
                </a>
              </li>
              <li>
                <a
                  href="/estimate?project=bathroom"
                  className="text-sm text-white/70 hover:text-accent transition"
                >
                  Bathroom Estimator
                </a>
              </li>
            </ul>
          </div>

          {/* Guides */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-4">
              Guides
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="/guides/roof-replacement"
                  className="text-sm text-white/70 hover:text-accent transition"
                >
                  Roof Replacement
                </a>
              </li>
              <li>
                <a
                  href="/guides/kitchen-remodel"
                  className="text-sm text-white/70 hover:text-accent transition"
                >
                  Kitchen Remodel
                </a>
              </li>
              <li>
                <a
                  href="/guides/bathroom-remodel"
                  className="text-sm text-white/70 hover:text-accent transition"
                >
                  Bathroom Remodel
                </a>
              </li>
              <li>
                <a
                  href="/guides/hvac-installation"
                  className="text-sm text-white/70 hover:text-accent transition"
                >
                  HVAC Installation
                </a>
              </li>
              <li>
                <a
                  href="/guides/window-replacement"
                  className="text-sm text-white/70 hover:text-accent transition"
                >
                  Window Replacement
                </a>
              </li>
              <li>
                <a
                  href="/guides/flooring"
                  className="text-sm text-white/70 hover:text-accent transition"
                >
                  Flooring
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a href="/about" className="text-sm text-white/70 hover:text-accent transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white/70 hover:text-accent transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-sm text-white/70 hover:text-accent transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/disclaimer"
                  className="text-sm text-white/70 hover:text-accent transition"
                >
                  Disclaimer
                </a>
              </li>
              <li>
                <a href="/terms" className="text-sm text-white/70 hover:text-accent transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white/70 hover:text-accent transition">
                  Sitemap
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © 2026 CostReno. All rights reserved. Estimates are for planning purposes only.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <a href="/privacy" className="hover:text-white/70 transition">
              Privacy
            </a>
            <a href="/disclaimer" className="hover:text-white/70 transition">
              Disclaimer
            </a>
            <a href="/terms" className="hover:text-white/70 transition">
              Terms
            </a>
            <a href="#" className="hover:text-white/70 transition">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
