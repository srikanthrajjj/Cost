import { GUIDES, TOPIC_HUBS } from "@/lib/guides/catalog";
import { PROJECT_CONFIGS } from "@/lib/project-config";

export type SearchGroup = "Tools" | "Topics" | "Guides" | "Projects";

export type SearchItem = {
  href: string;
  title: string;
  description: string;
  group: SearchGroup;
  /** Extra terms for typeahead matching (not shown). */
  keywords: string;
};

const TOOLS: SearchItem[] = [
  {
    href: "/estimate",
    title: "Cost estimator",
    description: "Get a local renovation cost estimate by ZIP code.",
    group: "Tools",
    keywords: "estimate calculator budget planning start renovation repair project",
  },
  {
    href: "/estimate?project=plumbing",
    title: "Plumbing estimate",
    description: "Plan plumbing repair, repiping, or fixture work with a ZIP-based range.",
    group: "Tools",
    keywords: "plumbing plumber pipe leak water heater faucet drain sewer repair",
  },
  {
    href: "/estimate?project=electrical",
    title: "Electrical estimate",
    description: "Panel upgrades, rewiring, outlets, and related electrical scope.",
    group: "Tools",
    keywords: "electrical electrician panel upgrade rewiring outlets wiring breaker",
  },
  {
    href: "/estimate?project=painting",
    title: "Painting estimate",
    description: "Interior and exterior painting cost planning by ZIP.",
    group: "Tools",
    keywords: "painting paint painter interior exterior walls",
  },
  {
    href: "/estimate?project=deck",
    title: "Deck estimate",
    description: "Deck build or rebuild planning with material and size inputs.",
    group: "Tools",
    keywords: "deck patio porch outdoor wood composite railing",
  },
  {
    href: "/estimate?project=solar",
    title: "Solar estimate",
    description: "ZIP-based solar planning range for panel count and battery options.",
    group: "Tools",
    keywords: "solar panels photovoltaic pv battery sun energy",
  },
  {
    href: "/quote-analyzer",
    title: "Quote analyzer",
    description: "Upload or paste a contractor quote for a fairness check.",
    group: "Tools",
    keywords: "bid analyze review fair inflated proposal",
  },
  {
    href: "/compare-quotes",
    title: "Compare quotes",
    description: "Compare two contractor bids side by side.",
    group: "Tools",
    keywords: "compare bids side by side",
  },
  {
    href: "/locations",
    title: "Costs by city",
    description: "Browse renovation cost pages for major metros.",
    group: "Tools",
    keywords: "city local metro zip location near me nearby",
  },
  {
    href: "/guides",
    title: "All guides",
    description: "Browse every CostReno renovation and quote guide.",
    group: "Tools",
    keywords: "articles blog learning guides",
  },
  {
    href: "/methodology",
    title: "Methodology",
    description: "How CostReno builds estimates and quote checks.",
    group: "Tools",
    keywords: "data accuracy trust how it works",
  },
  {
    href: "/about",
    title: "About CostReno",
    description: "Who we are and what we help homeowners decide.",
    group: "Tools",
    keywords: "company team",
  },
  {
    href: "/contact",
    title: "Contact",
    description: "Get in touch with the CostReno team.",
    group: "Tools",
    keywords: "support help email",
  },
];

export const SEARCH_CATALOG: SearchItem[] = [
  ...TOOLS,
  ...TOPIC_HUBS.map((hub) => ({
    href: hub.href,
    title: hub.title,
    description: hub.desc,
    group: "Topics" as const,
    keywords: `${hub.title} topic hub costs price estimate local`,
  })),
  ...GUIDES.map((guide) => ({
    href: guide.href,
    title: guide.title,
    description: guide.desc,
    group: "Guides" as const,
    keywords: `${guide.tag} ${guide.title} guide`,
  })),
  ...PROJECT_CONFIGS.map((project) => ({
    href: `/${project.slug}`,
    title: `${project.name} cost`,
    description: project.seoDescription.slice(0, 120),
    group: "Projects" as const,
    keywords: `${project.name} ${project.projectType} cost estimate average price`,
  })),
];

/** Popular starting suggestions (Google-style empty state). */
export const POPULAR_SEARCHES = [
  "roof replacement cost",
  "kitchen remodel",
  "solar panel cost",
  "EV charger installation",
  "smart thermostat cost",
  "contractor quote",
  "quartz countertops",
  "costs near me",
] as const;

export function searchItemValue(item: SearchItem): string {
  return `${item.title} ${item.description} ${item.keywords} ${item.group}`;
}

export const SEARCH_GROUPS: SearchGroup[] = ["Tools", "Topics", "Guides", "Projects"];
