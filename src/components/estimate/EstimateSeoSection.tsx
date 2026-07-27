import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ProjectType } from "@/lib/estimator-engine";

export const ESTIMATOR_FAQS = [
  {
    q: "How accurate is this renovation cost estimate?",
    a: "This tool gives planning ranges based on your project type, ZIP code, property details, and regional labor and material data. It is useful for budgeting and comparing quotes, but it is not a contractor bid or a guaranteed price.",
  },
  {
    q: "Why do you ask for my ZIP code?",
    a: "Renovation costs vary by metro area. Your ZIP helps us apply local labor rates, permit patterns, and regional pricing instead of a single national average.",
  },
  {
    q: "Is this the same as a contractor quote?",
    a: "No. A contractor quote reflects your home, materials, access, and scope after a site visit. Use this estimate to plan your budget, then upload contractor quotes to our quote analyzer to check line items and red flags.",
  },
  {
    q: "What projects can I estimate?",
    a: "You can estimate roof replacement, kitchen remodel, bathroom remodel, HVAC, windows, flooring, painting, deck, plumbing, electrical, and solar. Pick a project type at the start and answer a few questions to see a range.",
  },
  {
    q: "Do I need an account to use the estimator?",
    a: "No signup is required to run an estimate. Your answers are saved in your browser so you can finish later on the same device.",
  },
  {
    q: "How should I use my estimate with contractor quotes?",
    a: "Use the range to set expectations before you request bids. When quotes arrive, compare them with our quote analyzer or compare-quotes tool to spot missing scope, vague line items, and prices that look high for your area.",
  },
] as const;

const DEFAULT_GUIDE_LINKS = [
  { href: "/guides/roof-replacement", label: "Roof replacement cost guide" },
  { href: "/guides/kitchen-remodel", label: "Kitchen remodel cost guide" },
  { href: "/guides/bathroom-remodel", label: "Bathroom remodel cost guide" },
  { href: "/guides/hvac-installation", label: "HVAC installation cost guide" },
  { href: "/guides/window-replacement", label: "Window replacement cost guide" },
  { href: "/guides/flooring", label: "Flooring cost guide" },
  { href: "/quote-analyzer", label: "Quote analyzer" },
  { href: "/methodology", label: "How we calculate estimates" },
] as const;

const PROJECT_GUIDE_LINKS: Partial<
  Record<ProjectType, { href: string; label: string }[]>
> = {
  roof: [
    { href: "/guides/roof-replacement", label: "Roof replacement cost guide" },
    { href: "/topics/roof", label: "Roof costs topic hub" },
    { href: "/guides/roof-replacement-cost-by-city", label: "Roof cost by city" },
    { href: "/guides/roof-quote-review", label: "Roof quote review" },
    { href: "/quote-analyzer", label: "Quote analyzer" },
    { href: "/methodology", label: "How we calculate estimates" },
  ],
  kitchen: [
    { href: "/guides/kitchen-remodel", label: "Kitchen remodel cost guide" },
    { href: "/topics/kitchen", label: "Kitchen costs topic hub" },
    { href: "/guides/quartz-vs-granite-countertops", label: "Quartz vs granite" },
    { href: "/quote-analyzer", label: "Quote analyzer" },
    { href: "/methodology", label: "How we calculate estimates" },
  ],
  bathroom: [
    { href: "/guides/bathroom-remodel", label: "Bathroom remodel cost guide" },
    { href: "/quote-analyzer", label: "Quote analyzer" },
    { href: "/methodology", label: "How we calculate estimates" },
  ],
  hvac: [
    { href: "/guides/hvac-installation", label: "HVAC installation cost guide" },
    { href: "/topics/hvac", label: "HVAC costs topic hub" },
    { href: "/hvac-installation-cost", label: "HVAC cost overview" },
    { href: "/quote-analyzer", label: "Quote analyzer" },
    { href: "/methodology", label: "How we calculate estimates" },
  ],
  windows: [
    { href: "/guides/window-replacement", label: "Window replacement cost guide" },
    { href: "/topics/windows", label: "Window costs topic hub" },
    { href: "/window-replacement-cost", label: "Window cost overview" },
    { href: "/quote-analyzer", label: "Quote analyzer" },
    { href: "/methodology", label: "How we calculate estimates" },
  ],
  flooring: [
    { href: "/guides/flooring", label: "Flooring cost guide" },
    { href: "/topics/flooring", label: "Flooring costs topic hub" },
    { href: "/flooring-cost", label: "Flooring cost overview" },
    { href: "/quote-analyzer", label: "Quote analyzer" },
    { href: "/methodology", label: "How we calculate estimates" },
  ],
};

interface EstimateSeoSectionProps {
  projectType?: ProjectType;
}

export function EstimateSeoSection({ projectType }: EstimateSeoSectionProps) {
  const guideLinks =
    (projectType && PROJECT_GUIDE_LINKS[projectType]) || DEFAULT_GUIDE_LINKS;

  return (
    <section
      className="mt-12 md:mt-16 pt-10 border-t border-border/60"
      aria-labelledby="estimator-faq-heading"
    >
      <div className="max-w-3xl">
        <h2
          id="estimator-faq-heading"
          className="font-display text-xl md:text-2xl font-bold text-ink"
        >
          About this estimator
        </h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Free ZIP-based planning ranges for roof, kitchen, bathroom, HVAC, windows, flooring, and
          other common home projects. For deeper pricing by project type, see our guides below.
        </p>

        <Accordion type="single" collapsible className="mt-6">
          {ESTIMATOR_FAQS.map((faq, index) => (
            <AccordionItem key={faq.q} value={`faq-${index}`} className="border-border/70">
              <AccordionTrigger className="text-sm font-semibold text-ink hover:no-underline py-3.5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Related guides and tools
          </h3>
          <ul className="flex flex-col sm:flex-row sm:flex-wrap gap-x-4 gap-y-2">
            {guideLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm font-medium text-primary hover:text-accent transition underline-offset-2 hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
