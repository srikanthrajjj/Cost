import { createFileRoute } from "@tanstack/react-router";
import {
  Search, Home, ChefHat, Bath,
  Calculator, GitCompare, Shield, MapPin, Sparkles, Lock,
  ArrowRight, ArrowUpRight, Star, Check, TrendingUp,
  Facebook, Instagram, Youtube, Linkedin,
  Fan,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import heroHome from "@/assets/hero-home.jpg";
import projRoof from "@/assets/proj-roof.jpg";
import projKitchen from "@/assets/proj-kitchen.jpg";
import projBathroom from "@/assets/proj-bathroom.jpg";
import projHvac from "@/assets/proj-hvac.jpg";
import cmpRoof from "@/assets/cmp-roof.jpg";
import cmpCounter from "@/assets/cmp-counter.jpg";
import cmpHvac from "@/assets/cmp-hvac.jpg";
import cmpWater from "@/assets/cmp-water.jpg";
import blueprint from "@/assets/house-blueprint.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:image", content: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200" },
    ],
  }),
  component: Landing,
});

const trend = [
  { v: 20 },{ v: 24 },{ v: 22 },{ v: 28 },{ v: 26 },{ v: 32 },
  { v: 30 },{ v: 36 },{ v: 34 },{ v: 42 },{ v: 40 },{ v: 48 },
];
const breakdown = [
  { name: "Materials", value: 5440, color: "oklch(0.55 0.22 262)" },
  { name: "Labor", value: 4250, color: "oklch(0.68 0.17 155)" },
  { name: "Permits", value: 420, color: "oklch(0.75 0.18 70)" },
  { name: "Waste", value: 380, color: "oklch(0.65 0.24 25)" },
  { name: "Other", value: 1990, color: "oklch(0.6 0.2 305)" },
];
const projects = [
  { img: projRoof, icon: Home, name: "Roof Replacement", price: "$8,600 – $24,700", time: "3 – 5 Days" },
  { img: projKitchen, icon: ChefHat, name: "Kitchen Remodel", price: "$25,000 – $75,000", time: "4 – 8 Weeks" },
  { img: projBathroom, icon: Bath, name: "Bathroom Remodel", price: "$8,000 – $30,000", time: "2 – 4 Weeks" },
  { img: projHvac, icon: Fan, name: "HVAC Replacement", price: "$4,500 – $12,000", time: "1 – 2 Days" },
];
const steps = [
  { icon: Search, title: "Choose Your Project", desc: "Select from 100+ home improvement projects" },
  { icon: Calculator, title: "Estimate Your Cost", desc: "Get accurate, location-based estimates in seconds" },
  { icon: GitCompare, title: "Compare Your Options", desc: "Materials, styles, and contractors side by side" },
  { icon: Check, title: "Plan With Confidence", desc: "Make the best decision for your home and budget" },
];
const trust = [
  { icon: MapPin, title: "Accurate & Local Data", desc: "Real pricing from thousands of projects in your area." },
  { icon: Sparkles, title: "Unbiased Recommendations", desc: "We don't sell. We help you make the best decision for your home." },
  { icon: TrendingUp, title: "Expert-Backed Insights", desc: "Guidance from industry professionals and building experts." },
  { icon: Lock, title: "Privacy First", desc: "Your data is secure and never shared with contractors." },
];
const comparisons = [
  { img: cmpRoof, title: "Asphalt vs Metal Roofing", desc: "Compare durability, cost, and ROI" },
  { img: cmpCounter, title: "Quartz vs Granite Countertops", desc: "See which is best for your kitchen" },
  { img: cmpHvac, title: "Repair vs Replace HVAC", desc: "Which option saves you more in the long run?" },
  { img: cmpWater, title: "Tank vs Tankless Water Heaters", desc: "Compare upfront costs and long-term savings" },
];

function Logo() {
  return (
    <a href="#" className="flex items-center gap-2">
      <img src="/logo.svg" alt="Logo" style={{ height: "48px", width: "auto" }} />
    </a>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="container-x flex h-16 items-center justify-between">
          <div className="flex items-center gap-10">
            <Logo />
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
              {["Projects","Calculators","Compare","Guides","ROI Center","Resources"].map((l) => (
                <a key={l} href="#" className="hover:text-foreground transition-colors">{l}</a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden sm:grid h-9 w-9 place-items-center rounded-full hover:bg-muted">
              <Search color="white" className="h-4 w-4" />
            </button>
            <a href="#" className="hidden sm:inline text-sm font-medium hover:text-primary">Log in</a>
            <a href="#" className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-sm hover:bg-accent/90 transition">
              Start Planning
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="container-x pt-10 md:pt-16 pb-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              <Check color="white" className="h-3.5 w-3.5" /> Trusted by homeowners across the U.S.
            </span>
            <h1 className="mt-5 font-display text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-ink leading-[1.02]">
              Plan your next home project with confidence.
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-lg">
              Accurate estimates, expert guidance, and data-driven insights to help you plan any home improvement project with confidence.
            </p>

            <div className="mt-7 flex items-stretch gap-2 rounded-xl border border-border bg-card p-2 shadow-sm max-w-xl">
              <div className="flex flex-1 items-center gap-2 px-3">
                <Search color="white" className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search any project (e.g. roof replacement, kitchen remodel)"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/80"
                />
              </div>
              <button className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                Search
              </button>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <span className="text-muted-foreground">Popular:</span>
              {["Roof Replacement","Kitchen Remodel","Bathroom Remodel","HVAC","Solar"].map((p) => (
                <a key={p} href="#" className="text-primary font-medium hover:underline">{p}</a>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
              {[
                { icon: Calculator, k: "100+", v: "Interactive Calculators" },
                { icon: TrendingUp, k: "Updated Weekly", v: "Real-time pricing data" },
                { icon: Shield, k: "Trusted by", v: "1M+ Homeowners" },
              ].map((s) => (
                <div key={s.v} className="flex items-start gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-accent-foreground">
                    <s.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-ink">{s.k}</div>
                    <div className="text-xs text-muted-foreground">{s.v}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl border border-border shadow-lg">
              <img src={heroHome} alt="Modern home with lit windows at dusk" width={1024} height={1024} className="w-full h-[460px] object-cover" />
            </div>

            {/* Cost card */}
            <div className="absolute -top-4 right-4 md:right-6 w-64 rounded-xl bg-card p-4 shadow-xl border border-border">
              <div className="text-xs text-muted-foreground">Estimated Project Cost</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-ink">$23,450</span>
                <span className="text-xs text-muted-foreground">+/- 8%</span>
              </div>
              <div className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> High Confidence
              </div>
              <div className="mt-2 h-14 -mx-1">
                <ResponsiveContainer>
                  <AreaChart data={trend}>
                    <defs>
                      <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.68 0.17 155)" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="oklch(0.68 0.17 155)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="v" stroke="oklch(0.68 0.17 155)" strokeWidth={2} fill="url(#g1)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Timeline card */}
            <div className="absolute top-32 left-4 md:left-0 w-44 rounded-xl bg-card p-4 shadow-xl border border-border">
              <div className="text-xs text-muted-foreground">Project Timeline</div>
              <div className="mt-1 font-display text-xl font-bold text-ink">3 – 5 Weeks</div>
              <div className="mt-1 text-xs text-muted-foreground">Start to Finish</div>
            </div>

            {/* ROI card */}
            <div className="absolute -bottom-4 right-6 w-48 rounded-xl bg-card p-3 shadow-xl border border-border flex items-center gap-3">
              <div className="relative h-14 w-14">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={[{v:71},{v:29}]} dataKey="v" innerRadius={18} outerRadius={26} startAngle={90} endAngle={-270}>
                      <Cell fill="oklch(0.68 0.17 155)" />
                      <Cell fill="oklch(0.92 0.008 255)" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">ROI Potential</div>
                <div className="font-display text-lg font-bold text-ink">71%</div>
                <div className="text-[10px] font-medium text-success">● High</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR PROJECTS */}
      <section className="container-x py-10">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-ink">What project are you planning?</h2>
          <a href="#" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
            View all projects <ArrowRight color="white" className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((p) => (
            <article key={p.name} className="group rounded-xl overflow-hidden border border-border bg-card hover:shadow-md transition">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={p.img} alt={p.name} loading="lazy" width={1024} height={1024} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
                <span className="absolute bottom-2 left-2 grid h-8 w-8 place-items-center rounded-lg bg-card/95 text-primary shadow">
                  <p.icon className="h-4 w-4" />
                </span>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-ink truncate">{p.name}</h3>
                <div className="mt-1 text-xs text-muted-foreground">{p.price}</div>
                <div className="text-xs text-muted-foreground">{p.time}</div>
                <a href="#" className="mt-3 inline-flex items-center gap-1 rounded-md border border-primary px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition">
                  Calculate Estimate
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container-x py-10">
        <div className="rounded-2xl border border-border bg-card p-8 md:p-12">
          <h2 className="text-center font-display text-2xl md:text-3xl font-bold text-ink">How CostReno Works</h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-2 relative">
            {steps.map((s, i) => (
              <div key={s.title} className="relative text-center px-2">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-accent text-primary">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-ink">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                {i < steps.length - 1 && (
                  <ArrowRight color="white" className="hidden md:block absolute top-4 -right-2 h-5 w-5 text-muted-foreground/50" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE ESTIMATOR */}
      <section className="container-x py-10">
        <div className="rounded-2xl border border-border bg-card p-6 md:p-10">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">Try Our Interactive Estimator</h2>
              <p className="mt-1 text-sm text-muted-foreground">See how it works in less than 30 seconds</p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <Field label="Project Type" value="Roof Replacement" />
                <Field label="ZIP Code" value="90210" />
                <Field label="Roof Size (sq ft)" value="2,000" />
                <Field label="Roof Pitch" value="6/12 (Medium)" />
                <div className="col-span-2">
                  <Field label="Material" value="Architectural Shingles" />
                </div>
              </div>
              <button className="mt-6 w-full rounded-lg bg-accent py-3 text-sm font-semibold text-accent-foreground hover:bg-accent/90">
                Calculate My Estimate
              </button>
            </div>

            {/* Breakdown */}
            <div className="rounded-xl border border-border p-5">
              <div className="text-xs text-muted-foreground">Estimated Project Cost</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-ink">$12,480</span>
                <span className="text-xs text-muted-foreground">+/- $980</span>
              </div>
              <div className="mt-5 text-sm font-semibold text-ink">Cost Breakdown</div>
              <ul className="mt-3 space-y-2 text-sm">
                {[
                  ["Materials","$5,440"],
                  ["Labor","$4,250"],
                  ["Permits & Fees","$420"],
                  ["Waste Removal","$380"],
                  ["Other Costs","$1,990"],
                ].map(([k,v]) => (
                  <li key={k} className="flex justify-between border-b border-dashed border-border/70 pb-2">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-medium text-ink">{v}</span>
                  </li>
                ))}
                <li className="flex justify-between pt-1">
                  <span className="font-semibold text-ink">Total Estimate</span>
                  <span className="font-bold text-ink">$12,480</span>
                </li>
              </ul>
            </div>

            {/* Chart */}
            <div className="flex flex-col items-center">
              <div className="relative h-56 w-56">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={breakdown} dataKey="value" innerRadius={62} outerRadius={95} paddingAngle={2}>
                      {breakdown.map((e) => <Cell key={e.name} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 grid place-items-center text-center">
                  <div>
                    <div className="text-xs text-muted-foreground">Total</div>
                    <div className="font-display text-xl font-bold text-ink">$12,480</div>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-sm font-semibold text-ink">Project Timeline</div>
              <div className="text-xs text-muted-foreground">3 – 5 Days</div>
              <div className="mt-5 flex items-start gap-2 rounded-lg bg-accent px-3 py-2 text-xs">
                <Shield color="white" className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <div className="font-semibold text-ink">High Confidence Estimate</div>
                  <div className="text-muted-foreground">Based on 37 local projects completed in the last 30 days</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY TRUST */}
      <section className="container-x py-10">
        <div className="rounded-2xl border border-border bg-card p-8 md:p-12">
          <h2 className="text-center font-display text-2xl md:text-3xl font-bold text-ink">Why Homeowners Trust CostReno</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trust.map((t) => (
              <div key={t.title} className="flex gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent text-primary">
                  <t.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-sm font-bold text-ink">{t.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISONS */}
      <section className="container-x py-10">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-ink">Popular Comparisons</h2>
          <a href="#" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
            View all comparisons <ArrowRight color="white" className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {comparisons.map((c) => (
            <article key={c.title} className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={c.img} alt={c.title} loading="lazy" width={1024} height={1024} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-card text-xs font-bold text-ink shadow-lg">
                  VS
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-display text-base font-bold text-ink">{c.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{c.desc}</p>
                <a href="#" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                  Compare Now <ArrowRight color="white" className="h-3 w-3" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="mt-8 bg-ink text-white">
        <div className="container-x py-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-sm font-semibold">Trusted by homeowners nationwide</div>
              <div className="flex items-center gap-1 text-xs text-white/70">
                {[1,2,3,4,5].map((i) => <Star key={i} color="white" className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />)}
                <span className="ml-1">4.8/5 from 12,400+ reviews</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-white/80 font-display font-semibold">
            <span>Google</span>
            <span className="inline-flex items-center gap-1"><Star color="white" className="h-4 w-4" /> Trustpilot</span>
            <span>facebook</span>
            <span>BBB</span>
            <span>CR Consumer Reports</span>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="container-x py-12">
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 grid md:grid-cols-[auto_1fr_auto] gap-8 items-center">
          <img src={blueprint} alt="House blueprint" width={1024} height={1024} loading="lazy" className="h-32 w-40 object-contain" />
          <div>
            <h3 className="font-display text-xl md:text-2xl font-bold text-ink">Stay Informed. Plan Smarter.</h3>
            <p className="mt-1 text-sm text-muted-foreground">Get expert tips, cost trends, and project checklists straight to your inbox.</p>
            <form className="mt-4 flex gap-2 max-w-md">
              <input type="email" placeholder="Enter your email" className="flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
              <button className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90">Subscribe Free</button>
            </form>
          </div>
          <div className="flex md:flex-col gap-6 md:gap-4 text-center md:text-left md:border-l md:border-border md:pl-8">
            {[["100+","Guides & Articles"],["Weekly","Cost Updates"],["Free","Forever"]].map(([k,v]) => (
              <div key={v}>
                <div className="font-display text-lg font-bold text-ink">{k}</div>
                <div className="text-xs text-muted-foreground">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-surface">
        <div className="container-x py-12 grid grid-cols-2 md:grid-cols-6 gap-8 text-sm">
          <div className="col-span-2">
            <Logo />
            <p className="mt-3 text-xs text-muted-foreground max-w-xs">
              The most trusted home improvement intelligence platform. Know your data. Expert insights. Smarter decisions.
            </p>
            <div className="mt-4 flex gap-3 text-muted-foreground">
              {[Facebook, Instagram, Youtube, Linkedin].map((I, i) => (
                <a key={i} href="#" className="grid h-8 w-8 place-items-center rounded-full border border-border hover:text-primary hover:border-primary">
                  <I className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <FooterCol title="Projects" items={["Roofing","Kitchen","Bathroom","HVAC","Windows","View All Projects"]} />
          <FooterCol title="Calculators" items={["Cost Estimator","ROI Calculator","Material Calculator","Loan Calculator","View All Calculators"]} />
          <FooterCol title="Resources" items={["Guides","Cost Breakdown","Glossary","Project Checklists","FAQs"]} />
          <FooterCol title="Company" items={["About Us","Our Methodology","Careers","Contact Us","Press"]} />
          <FooterCol title="Legal" items={["Privacy Policy","Terms of Service","Disclaimer","Accessibility"]} />
        </div>
        <div className="border-t border-border">
          <div className="container-x py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <div>© 2025 CostReno. All rights reserved.</div>
            <div className="inline-flex items-center gap-1">Made with <span className="text-red-500">♥</span> for homeowners</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="mt-1 flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2.5 text-sm">
        <span className="text-ink">{value}</span>
        <ArrowUpRight color="white" className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
    </label>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="font-display text-sm font-bold text-ink">{title}</h4>
      <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
        {items.map((i) => (
          <li key={i}><a href="#" className="hover:text-primary">{i}</a></li>
        ))}
      </ul>
    </div>
  );
}
