import {
  detectNearMeIntent,
  extractSearchPasses,
  rankSearchResults,
  type RankedSearchItem,
} from "@/lib/smart-search";
import { SEARCH_CATALOG, type SearchGroup } from "@/lib/search-catalog";

export type ChatLink = {
  href: string;
  title: string;
  description: string;
  group: SearchGroup;
};

export type NavigatorReply = {
  text: string;
  links: ChatLink[];
  /** True when catalog matched real articles/tools for the query. */
  found: boolean;
  /** True when UI should call the broader knowledge API. */
  needsBroaderSearch: boolean;
};

export type ChatInvite = {
  id: string;
  bubble: string;
  prompt: string;
};

/** Rotating invites shown near the closed launcher. */
export const CHAT_INVITES: ChatInvite[] = [
  {
    id: "solar",
    bubble: "Curious about solar costs?",
    prompt: "Solar panel installation cost",
  },
  {
    id: "ev",
    bubble: "Planning an EV charger?",
    prompt: "EV charger installation cost near me",
  },
  {
    id: "thermostat",
    bubble: "Upgrading your thermostat?",
    prompt: "Smart thermostat installation cost",
  },
  {
    id: "near",
    bubble: "Need costs near you?",
    prompt: "Show renovation costs near me",
  },
  {
    id: "roof",
    bubble: "Looking for roof costs?",
    prompt: "Find a roof cost guide",
  },
  {
    id: "quotes",
    bubble: "Got contractor bids?",
    prompt: "Compare contractor quotes",
  },
];

/** Quick prompts shown inside the open panel. */
export const STARTER_PROMPTS = [
  "Solar panel installation cost",
  "EV charger installation cost",
  "Show renovation costs near me",
  "Compare contractor quotes",
  "Help me get a cost estimate",
] as const;

function toLinks(items: RankedSearchItem[], limit = 4): ChatLink[] {
  return items.slice(0, limit).map(({ href, title, description, group }) => ({
    href,
    title,
    description,
    group,
  }));
}

function detectIntent(query: string): "quote" | "estimate" | "guide" | "location" | "general" {
  const q = query.toLowerCase();
  if (detectNearMeIntent(q) || /\b(city|cities|local|state|zip|nearby)\b/.test(q)) return "location";
  if (/\b(quote|bid|bids|proposal|compare|fair|inflated|analyzer)\b/.test(q)) return "quote";
  if (/\b(estimate|calculator|budget|how much|pricing)\b/.test(q)) return "estimate";
  if (
    /\b(guide|article|read|learn|insurance|labor|install|solar|ev|thermostat|plumbing|paint|deck)\b/.test(
      q,
    )
  ) {
    return "guide";
  }
  return "general";
}

function fallbackLinks(): ChatLink[] {
  return [
    {
      href: "/estimate",
      title: "Cost estimator",
      description: "Get a local renovation cost estimate by ZIP code.",
      group: "Tools",
    },
    {
      href: "/quote-analyzer",
      title: "Quote analyzer",
      description: "Upload or paste a contractor quote for a fairness check.",
      group: "Tools",
    },
    {
      href: "/guides",
      title: "All guides",
      description: "Browse every CostReno renovation and quote guide.",
      group: "Tools",
    },
    {
      href: "/topics/energy",
      title: "Energy costs",
      description: "Solar, EV charger, and smart thermostat guides.",
      group: "Topics",
    },
  ];
}

function ensureTool(results: RankedSearchItem[], href: string): RankedSearchItem[] {
  if (results.some((r) => r.href === href)) return results;
  const tool = SEARCH_CATALOG.find((item) => item.href === href);
  if (!tool) return results;
  return [{ ...tool, score: 999 }, ...results];
}

function searchCatalogMultiPass(query: string): RankedSearchItem[] {
  const passes = extractSearchPasses(query);
  for (const pass of passes) {
    const strict = rankSearchResults(pass, 8);
    if (strict.length) return strict;
  }
  for (const pass of passes) {
    const loose = rankSearchResults(pass, 8, { loose: true });
    if (loose.length) return loose;
  }
  return [];
}

/**
 * Rule + catalog navigator. Reuses site search ranking so chat and search stay aligned.
 * When nothing matches, returns found=false so the UI can call broader API search.
 */
export function answerSiteQuestion(query: string): NavigatorReply {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      text: "Ask about a renovation cost, quote, or guide. I can point you to the right page.",
      links: fallbackLinks(),
      found: true,
      needsBroaderSearch: false,
    };
  }

  const intent = detectIntent(trimmed);
  let results = searchCatalogMultiPass(trimmed);

  // Intent tools only when the query clearly asks for that workflow
  if (intent === "quote") {
    results = ensureTool(results, "/quote-analyzer");
    results = ensureTool(results, "/compare-quotes");
  } else if (intent === "estimate") {
    results = ensureTool(results, "/estimate");
  } else if (intent === "location") {
    results = ensureTool(results, "/locations");
    results = ensureTool(results, "/estimate");
  }

  const substantive = results.filter((r) => r.score < 900);
  const found = substantive.length > 0;

  if (!found) {
    return {
      text: `No matching articles found for “${trimmed}”. Trying a broader search…`,
      links: fallbackLinks(),
      found: false,
      needsBroaderSearch: true,
    };
  }

  const links = toLinks(results);
  const top = links[0];
  const detail = top
    ? ` Top match: ${top.title}${top.group === "Guides" || top.group === "Topics" ? " (guide/topic)" : ""}.`
    : "";

  let intro: string;
  switch (intent) {
    case "quote":
      intro = "Here are the best tools and guides for reviewing contractor quotes.";
      break;
    case "estimate":
      intro = "These tools and pages help you plan a renovation budget with local context.";
      break;
    case "location":
      intro =
        "For costs near you, start with city pages or a ZIP estimate. CostReno shows local price context, not a contractor directory.";
      break;
    case "guide":
      intro = "I found guides and related pages that should answer this.";
      break;
    default:
      intro = "Here is what I found across CostReno tools, topics, and guides.";
  }

  return {
    text: `${intro}${detail}`,
    links,
    found: true,
    needsBroaderSearch: false,
  };
}

/** Map ACTION tags from knowledge chat into floating-bot links. */
export function parseBroaderSearchResponse(raw: string): { text: string; links: ChatLink[] } {
  const links: ChatLink[] = [];
  const actionRe = /\[ACTION:([^:]+):([^:]+):([^\]]+)\]/g;
  let text = raw.replace(actionRe, (_full, name: string, desc: string, id: string) => {
    const key = String(id).trim().toLowerCase();
    const href =
      key === "estimate" || key === "plan" || key === "roi" || key === "material"
        ? "/estimate"
        : key === "quote-review"
          ? "/quote-analyzer"
          : key === "insurance"
            ? "/guides/can-insurance-cover-roof-replacement"
            : "/guides";
    links.push({
      href,
      title: String(name).trim(),
      description: String(desc).trim(),
      group: "Tools",
    });
    return "";
  });

  text = text
    .replace(/💡\s*/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!links.length) {
    return { text, links: fallbackLinks() };
  }

  // Dedupe by href
  const seen = new Set<string>();
  const unique = links.filter((l) => {
    if (seen.has(l.href)) return false;
    seen.add(l.href);
    return true;
  });

  return { text, links: unique.slice(0, 4) };
}
