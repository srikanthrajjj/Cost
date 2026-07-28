export type TopicHub = {
  href: string;
  title: string;
  desc: string;
};

export type GuideEntry = {
  href: string;
  title: string;
  desc: string;
  tag: string;
};

export const TOPIC_HUBS: TopicHub[] = [
  {
    href: "/topics/quotes",
    title: "Contractor quotes",
    desc: "Read bids, ask better questions, and use quote tools before you hire.",
  },
  {
    href: "/topics/roof",
    title: "Roof costs",
    desc: "National guides, material comparisons, and local roofing pages.",
  },
  {
    href: "/topics/kitchen",
    title: "Kitchen costs",
    desc: "Remodel ranges, countertop comparisons, and local kitchen pages.",
  },
  {
    href: "/topics/windows",
    title: "Window costs",
    desc: "Replacement ranges, energy factors, and local window pages.",
  },
  {
    href: "/topics/hvac",
    title: "HVAC costs",
    desc: "Installation ranges, repair vs replace, and local HVAC pages.",
  },
  {
    href: "/topics/energy",
    title: "Energy costs",
    desc: "Solar, EV charger, and smart thermostat planning guides.",
  },
  {
    href: "/topics/flooring",
    title: "Flooring costs",
    desc: "Material comparisons and local flooring installation pages.",
  },
];

export const GUIDES: GuideEntry[] = [
  {
    href: "/guides/how-to-read-a-contractor-quote",
    title: "How to read a contractor quote",
    desc: "Line-item checklist for scope, allowances, exclusions, and payment terms.",
    tag: "Quotes",
  },
  {
    href: "/guides/is-contractor-quote-fair",
    title: "Is this contractor quote fair?",
    desc: "Judge fairness by scope match, itemization, and local pricing context.",
    tag: "Quotes",
  },
  {
    href: "/guides/contractor-quote-too-high",
    title: "Contractor quote too high",
    desc: "Separate real cost drivers from padding, then negotiate or get another bid.",
    tag: "Quotes",
  },
  {
    href: "/guides/how-to-compare-contractor-quotes",
    title: "How to compare contractor quotes",
    desc: "Align scope across bids before you compare totals.",
    tag: "Quotes",
  },
  {
    href: "/guides/allowances-and-change-orders",
    title: "Allowances and change orders",
    desc: "Read soft numbers and extras so surprise costs do not blow the budget.",
    tag: "Quotes",
  },
  {
    href: "/guides/contractor-payment-schedules",
    title: "Contractor payment schedules",
    desc: "What fair milestone payments look like and which deposit terms are risky.",
    tag: "Quotes",
  },
  {
    href: "/guides/missing-scope-in-contractor-quotes",
    title: "Missing scope in contractor quotes",
    desc: "Common gaps that turn a cheap bid into expensive change orders.",
    tag: "Quotes",
  },
  {
    href: "/guides/kitchen-quote-review",
    title: "Kitchen remodel quote review",
    desc: "Cabinet, layout, allowance, and mechanical checks for kitchen bids.",
    tag: "Quotes",
  },
  {
    href: "/guides/what-to-do-after-getting-contractor-quotes",
    title: "What to do after getting contractor quotes",
    desc: "A next-step checklist from bid review to hiring decision.",
    tag: "Quotes",
  },
  {
    href: "/guides/questions-before-signing",
    title: "Questions to ask before signing",
    desc: "Credential, insurance, change-order, and warranty questions to ask.",
    tag: "Quotes",
  },
  {
    href: "/guides/inflated-quote-signs",
    title: "Signs a contractor quote is inflated",
    desc: "Red flags, vague scope, and pricing patterns to watch for.",
    tag: "Quotes",
  },
  {
    href: "/guides/quartz-vs-granite-countertops",
    title: "Quartz vs granite countertops",
    desc: "Cost, maintenance, and durability trade-offs for two popular surfaces.",
    tag: "Comparison",
  },
  {
    href: "/guides/roof-replacement",
    title: "Roof replacement cost guide",
    desc: "Pricing by material, size, and region, plus what quotes often miss.",
    tag: "Roofing",
  },
  {
    href: "/guides/kitchen-remodel",
    title: "Kitchen remodel cost guide",
    desc: "Budget ranges, cost drivers, and how to plan a clearer kitchen scope.",
    tag: "Kitchen",
  },
  {
    href: "/guides/bathroom-remodel",
    title: "Bathroom remodel cost guide",
    desc: "Typical ranges for refreshes and full gut renovations.",
    tag: "Bathroom",
  },
  {
    href: "/guides/hvac-installation",
    title: "HVAC installation cost guide",
    desc: "System sizing, labor factors, and what to check before you buy.",
    tag: "HVAC",
  },
  {
    href: "/guides/window-replacement",
    title: "Window replacement cost guide",
    desc: "Material and labor ranges, plus energy and install considerations.",
    tag: "Windows",
  },
  {
    href: "/guides/flooring",
    title: "Flooring cost guide",
    desc: "Compare common flooring options and install cost drivers.",
    tag: "Flooring",
  },
  {
    href: "/guides/metal-vs-asphalt-roof",
    title: "Metal vs asphalt roof",
    desc: "Cost, lifespan, and trade-offs to help you choose a roofing material.",
    tag: "Comparison",
  },
  {
    href: "/guides/roof-replacement-cost-by-state",
    title: "Roof replacement cost by state",
    desc: "Indicative ranges and labor context for every state we track.",
    tag: "Roofing",
  },
  {
    href: "/guides/roof-replacement-cost-by-city",
    title: "Roof replacement cost by city",
    desc: "Metro-level roof pricing pages with local factors and FAQs.",
    tag: "Roofing",
  },
  {
    href: "/guides/roof-replacement-timeline",
    title: "Roof replacement timeline",
    desc: "Typical phases from inspection through cleanup and final inspection.",
    tag: "Roofing",
  },
  {
    href: "/guides/roof-permits",
    title: "Roof permits",
    desc: "When permits are required, who pulls them, and what to verify on quotes.",
    tag: "Roofing",
  },
  {
    href: "/guides/roof-financing",
    title: "Roof financing",
    desc: "Compare savings, HELOCs, personal loans, and contractor financing.",
    tag: "Roofing",
  },
  {
    href: "/guides/roof-insurance-claims",
    title: "Roof insurance claims",
    desc: "Document storm damage, work with adjusters, and review settlement scope.",
    tag: "Roofing",
  },
  {
    href: "/guides/roof-quote-review",
    title: "Roof quote review",
    desc: "Line-item checklist for tear-off, materials, permits, and warranties.",
    tag: "Roofing",
  },
  {
    href: "/guides/can-insurance-cover-roof-replacement",
    title: "Can insurance cover roof replacement?",
    desc: "Covered perils, ACV vs RCV, claim process, supplements, and contractor choice.",
    tag: "Roofing",
  },
  {
    href: "/guides/is-30k-enough-for-kitchen-remodel",
    title: "Is $30,000 enough for a kitchen remodel?",
    desc: "Scope, materials, and labor breakdown for a $30k kitchen budget.",
    tag: "Kitchen",
  },
  {
    href: "/guides/quartz-countertop-cost",
    title: "How much should quartz countertops cost?",
    desc: "Installed pricing by brand tier, hidden fees, and quote comparison checklist.",
    tag: "Kitchen",
  },
  {
    href: "/guides/cabinet-install-labor-cost",
    title: "How much does labor cost to install cabinets?",
    desc: "Per-box and per-linear-foot rates, RTA vs custom, hidden fees, and quote comparison.",
    tag: "Kitchen",
  },
  {
    href: "/guides/solar-panel-cost",
    title: "How much does solar panel installation cost?",
    desc: "Cost per watt, typical system totals, battery add-ons, and solar quote checks.",
    tag: "Energy",
  },
  {
    href: "/guides/ev-charger-installation-cost",
    title: "How much does EV charger installation cost?",
    desc: "Level 2 pricing, panel upgrade risk, permits, rebates, and electrician quote tips.",
    tag: "Energy",
  },
  {
    href: "/guides/smart-thermostat-installation-cost",
    title: "How much does smart thermostat installation cost?",
    desc: "Installed ranges, C-wire costs, DIY vs pro, and HVAC control quote red flags.",
    tag: "HVAC",
  },
];
