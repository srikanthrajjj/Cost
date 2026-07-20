export function SiteFooter() {
  return (
    <footer className="bg-[#082A4B] text-white">
      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <a href="/" className="inline-block mb-4">
              <img src="/logo.svg" alt="CostReno" style={{ height: "32px", width: "auto" }} />
            </a>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs mb-5">
              Accurate home renovation cost estimates, AI-powered quote analysis, and expert guides
              to help you make confident decisions.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-accent/20 flex items-center justify-center transition"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-accent/20 flex items-center justify-center transition"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-accent/20 flex items-center justify-center transition"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
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
                <a href="#" className="text-sm text-white/70 hover:text-accent transition">
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
                <a href="#" className="text-sm text-white/70 hover:text-accent transition">
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
            <a href="#" className="hover:text-white/70 transition">
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
