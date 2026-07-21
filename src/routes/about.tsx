import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  Shield,
  Lightbulb,
  Users,
  Calculator,
  FileSearch,
  Brain,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Home,
  Zap,
  Eye,
  Lock,
  Heart,
} from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About CostReno — Our Mission to Make Renovation Pricing Transparent" },
      {
        name: "description",
        content:
          "Learn how CostReno helps homeowners make smarter renovation decisions with AI-powered cost estimates, quote analysis, and transparent pricing data.",
      },
      { property: "og:title", content: "About CostReno — Smarter Renovation Decisions" },
      {
        property: "og:description",
        content:
          "CostReno combines AI with construction pricing data to help homeowners estimate costs, compare quotes, and renovate with confidence.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

/* ─── Animated Counter Component ─── */
function AnimatedCounter({
  end,
  suffix = "",
  label,
}: {
  end: number;
  suffix?: string;
  label: string;
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  const ref = (node: HTMLDivElement | null) => {
    if (!node || hasAnimated) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          let current = 0;
          const step = Math.ceil(end / 40);
          const interval = setInterval(() => {
            current += step;
            if (current >= end) {
              setCount(end);
              clearInterval(interval);
            } else {
              setCount(current);
            }
          }, 30);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
  };

  return (
    <div ref={ref} className="text-center">
      <p className="font-display text-4xl md:text-5xl font-bold text-primary">
        {count.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

/* ─── Feature Card Component ─── */
function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Card className="group relative overflow-hidden border-border/60 hover:border-primary/20 hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="w-11 h-11 rounded-xl bg-primary/5 group-hover:bg-accent/10 flex items-center justify-center mb-4 transition-colors duration-300">
          <Icon className="h-5 w-5 text-primary group-hover:text-accent transition-colors duration-300" />
        </div>
        <h3 className="font-display text-base font-semibold text-ink mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

/* ─── Value Pill Component ─── */
function ValuePill({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-full border border-border/60 bg-card px-4 py-2.5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200">
      <Icon className="h-4 w-4 text-accent shrink-0" />
      <span className="text-sm font-medium text-foreground">{label}</span>
    </div>
  );
}

/* ─── Main About Page ─── */
function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/[0.03] via-transparent to-transparent" />
        <div className="container-x relative py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-5 px-3 py-1 text-xs font-medium">
              Our Mission
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-ink leading-[1.1] tracking-tight">
              Helping homeowners renovate <span className="text-accent">with confidence</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Renovating a home is one of the largest financial decisions most people will ever
              make. CostReno gives you the clarity and data you need to make informed choices.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section — Animated Counters */}
      <section className="container-x py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <AnimatedCounter end={100} suffix="+" label="Renovation Calculators" />
          <AnimatedCounter end={50} suffix="K+" label="Estimates Generated" />
          <AnimatedCounter end={200} suffix="+" label="Cities Covered" />
          <AnimatedCounter end={98} suffix="%" label="User Satisfaction" />
        </div>
      </section>

      {/* Problem / Solution Section */}
      <section className="bg-surface border-y border-border/40">
        <div className="container-x py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-4">
              Why We Built CostReno
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Most homeowners only renovate a few times in their lives. Contractors do it every day.
              That knowledge gap makes it hard to answer even basic questions.
            </p>
          </div>

          {/* Interactive Before/After Comparison */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="border-destructive/20 bg-destructive/[0.02]">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <Eye className="h-4 w-4 text-destructive" />
                  </div>
                  <h3 className="font-display font-semibold text-ink">Without CostReno</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "Is this quote reasonable?",
                    "What's included — and what's missing?",
                    "How much should this actually cost?",
                    "Should I get another quote?",
                    "Am I overpaying?",
                  ].map((q) => (
                    <li key={q} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-destructive/60 shrink-0" />
                      {q}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-accent/20 bg-accent/[0.02]">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                  </div>
                  <h3 className="font-display font-semibold text-ink">With CostReno</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "Clear cost breakdowns by project type",
                    "AI flags missing scope items",
                    "Regional pricing data for your area",
                    "Side-by-side quote comparison",
                    "Confidence score for every estimate",
                  ].map((q) => (
                    <li key={q} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-accent shrink-0" />
                      {q}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Do — Interactive Tabs */}
      <section className="container-x py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-4">
              What We Do
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              CostReno combines AI with construction pricing data to provide tools that empower
              homeowners at every stage.
            </p>
          </div>

          <Tabs defaultValue="estimate" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted/50">
              <TabsTrigger value="estimate" className="py-2.5 text-xs sm:text-sm">
                <Calculator className="h-4 w-4 mr-1.5 hidden sm:inline-block" />
                Estimate
              </TabsTrigger>
              <TabsTrigger value="analyze" className="py-2.5 text-xs sm:text-sm">
                <FileSearch className="h-4 w-4 mr-1.5 hidden sm:inline-block" />
                Analyze
              </TabsTrigger>
              <TabsTrigger value="plan" className="py-2.5 text-xs sm:text-sm">
                <Brain className="h-4 w-4 mr-1.5 hidden sm:inline-block" />
                Plan
              </TabsTrigger>
            </TabsList>

            <TabsContent value="estimate" className="mt-6">
              <Card className="border-border/60">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0">
                      <Calculator className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-lg font-semibold text-ink mb-3">
                        Cost Estimation
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Get instant, data-driven cost estimates for any renovation project. Our AI
                        analyzes regional pricing, material costs, and labor rates to give you an
                        accurate range before you talk to a contractor.
                      </p>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Kitchen Remodel</span>
                            <span className="font-medium text-foreground">$15K – $45K</span>
                          </div>
                          <Progress value={65} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Bathroom Renovation</span>
                            <span className="font-medium text-foreground">$8K – $25K</span>
                          </div>
                          <Progress value={45} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Roof Replacement</span>
                            <span className="font-medium text-foreground">$5K – $15K</span>
                          </div>
                          <Progress value={35} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analyze" className="mt-6">
              <Card className="border-border/60">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0">
                      <FileSearch className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-lg font-semibold text-ink mb-3">
                        Quote Analysis
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Upload any contractor quote and our AI will break it down line by line. We
                        identify missing items, flag potential red flags, and compare pricing
                        against regional benchmarks.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { label: "Missing Items Found", value: "3 items", icon: Eye },
                          { label: "Price vs. Average", value: "+12% above", icon: TrendingUp },
                          { label: "Red Flags", value: "1 detected", icon: Shield },
                        ].map((item) => (
                          <div key={item.label} className="rounded-lg bg-muted/50 p-3 text-center">
                            <item.icon className="h-4 w-4 text-primary mx-auto mb-1.5" />
                            <p className="text-xs text-muted-foreground">{item.label}</p>
                            <p className="text-sm font-semibold text-foreground">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="plan" className="mt-6">
              <Card className="border-border/60">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0">
                      <Brain className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-lg font-semibold text-ink mb-3">
                        Smart Planning
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Plan projects with greater confidence using educational guides, material
                        comparisons, and insurance-related repair preparation tools.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Renovation Guides",
                          "Material Comparison",
                          "Insurance Prep",
                          "Budget Tracking",
                          "Timeline Planning",
                          "Contractor Vetting",
                        ].map((item) => (
                          <Badge key={item} variant="secondary" className="font-normal text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Our Approach — Feature Grid */}
      <section className="bg-surface border-y border-border/40">
        <div className="container-x py-16 md:py-20">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-4">
              Our Approach
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              We believe homeowners deserve transparent information before making expensive
              decisions.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            <FeatureCard
              icon={Brain}
              title="AI-Powered Analysis"
              description="Machine learning models trained on real construction data to deliver accurate pricing insights."
            />
            <FeatureCard
              icon={Eye}
              title="Transparent Pricing"
              description="Clear cost breakdowns so you understand exactly where your money goes."
            />
            <FeatureCard
              icon={Lightbulb}
              title="Easy-to-Understand Reports"
              description="Complex data translated into simple, actionable insights anyone can follow."
            />
            <FeatureCard
              icon={TrendingUp}
              title="Educational Insights"
              description="Learn what to expect at every stage of your renovation project."
            />
            <FeatureCard
              icon={Lock}
              title="Privacy-First Handling"
              description="Your documents and data are processed securely and never shared with third parties."
            />
            <FeatureCard
              icon={Target}
              title="Continual Improvement"
              description="Our pricing models evolve with the market to keep estimates current and reliable."
            />
          </div>
        </div>
      </section>

      {/* Our Values — Interactive Pills */}
      <section className="container-x py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-4">
              Our Commitment
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              We are committed to building tools that put homeowners first.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <ValuePill icon={Target} label="Accurate & Improving" />
            <ValuePill icon={Zap} label="Easy to Use" />
            <ValuePill icon={Eye} label="Transparent About Limitations" />
            <ValuePill icon={Lock} label="Respectful of Privacy" />
            <ValuePill icon={Heart} label="Focused on Helping" />
          </div>
        </div>
      </section>

      {/* Built for Homeowners — Accordion FAQ */}
      <section className="bg-surface border-y border-border/40">
        <div className="container-x py-16 md:py-20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-4">
                Built for Every Project
              </h2>
              <p className="text-muted-foreground text-base md:text-lg">
                Whether you're planning a simple update or a full renovation, CostReno is designed
                to help.
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="kitchen">
                <AccordionTrigger className="text-base font-semibold hover:no-underline">
                  <span className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-primary" />
                    Kitchen Remodeling
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Get detailed cost breakdowns for cabinets, countertops, appliances, flooring, and
                  labor. Our estimator accounts for your kitchen size, material preferences, and
                  local pricing.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="roof">
                <AccordionTrigger className="text-base font-semibold hover:no-underline">
                  <span className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Roof Replacement
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Understand roofing costs by material type, square footage, and your region.
                  Compare shingle vs. metal vs. tile options with real pricing data.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="bathroom">
                <AccordionTrigger className="text-base font-semibold hover:no-underline">
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Bathroom Renovation
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  From simple vanity swaps to full gut renovations, understand what each component
                  costs and where your budget will have the most impact.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="quote">
                <AccordionTrigger className="text-base font-semibold hover:no-underline">
                  <span className="flex items-center gap-2">
                    <FileSearch className="h-4 w-4 text-primary" />
                    Reviewing Contractor Quotes
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Upload any contractor quote for instant AI analysis. We'll identify missing scope
                  items, compare line-item pricing, and flag potential concerns.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="insurance">
                <AccordionTrigger className="text-base font-semibold hover:no-underline">
                  <span className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Insurance Repair Planning
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Prepare for insurance-related repairs with cost estimates that align with typical
                  claim amounts. Understand what's covered and plan accordingly.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="container-x py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <Target className="h-7 w-7 text-accent" />
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-4">Our Mission</h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
            To make home renovation pricing more transparent, understandable, and accessible for
            every homeowner.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            We believe better information leads to better decisions, fewer surprises, and greater
            confidence throughout the renovation process.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/40 bg-primary/[0.02]">
        <div className="container-x py-16 md:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-4">
              Ready to Renovate Smarter?
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mb-8">
              Whether you're planning your first renovation or comparing multiple contractor quotes,
              CostReno is here to help you make informed decisions with confidence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/estimate"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-bold text-accent-foreground shadow-sm hover:bg-accent/90 transition"
              >
                Calculate My Estimate
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="/quote-analyzer"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-bold text-foreground hover:bg-muted/50 transition"
              >
                Analyze a Quote
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
