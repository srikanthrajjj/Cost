// ─── Reusable Project Configuration ────────────────────────────────────────────
// All SEO landing pages and the estimator are driven from this configuration.

export interface ProjectConfig {
  slug: string;
  projectType: string;
  name: string;
  image: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  intro: string;
  avgCost: string;
  costRange: string;
  timeline: string;
  roi: string;
  costFactors: string[];
  costBreakdown: { item: string; pct: string }[];
  reviews: { name: string; location: string; text: string; rating: number }[];
  faqs: { q: string; a: string }[];
  relatedProjects: string[];
}

export const PROJECT_CONFIGS: ProjectConfig[] = [
  {
    slug: "roof-replacement-cost",
    projectType: "roof",
    name: "Roof Replacement",
    image: "https://images.unsplash.com/photo-1632759145351-1d592919f522?w=800&q=80",
    seoTitle: "Roof Replacement Cost 2026 — Average Prices & Estimates | CostReno",
    seoDescription:
      "How much does a roof replacement cost in 2026? Average cost is $16,650. Get local estimates by ZIP code, compare materials, and review contractor quotes free.",
    h1: "How Much Does a Roof Replacement Cost in 2026?",
    intro:
      "A roof replacement is one of the most significant investments a homeowner can make. Whether you're dealing with storm damage, aging shingles, or upgrading to a more durable material, understanding the true cost helps you plan and budget effectively. CostReno provides accurate, location-based estimates using current labor and material pricing data.",
    avgCost: "$16,650",
    costRange: "$8,600 – $24,700",
    timeline: "3–5 days",
    roi: "68%",
    costBreakdown: [
      { item: "Materials (shingles, underlayment)", pct: "40%" },
      { item: "Labor", pct: "35%" },
      { item: "Tear-off & disposal", pct: "10%" },
      { item: "Flashing & trim", pct: "8%" },
      { item: "Permits & inspections", pct: "4%" },
      { item: "Miscellaneous", pct: "3%" },
    ],
    reviews: [
      {
        name: "Sarah M.",
        location: "Austin, TX",
        text: "CostReno's estimate was within $500 of my final bill. Saved me from overpaying the first contractor by $4,200.",
        rating: 5,
      },
      {
        name: "Tom H.",
        location: "Nashville, TN",
        text: "I used the quote analyzer for my roof and it caught that ice & water shield was missing. Contractor added it at no extra charge.",
        rating: 5,
      },
      {
        name: "Patricia W.",
        location: "Phoenix, AZ",
        text: "The cost breakdown helped me understand where my money goes. I felt confident negotiating because I had real data.",
        rating: 5,
      },
    ],
    costFactors: [
      "Roof size (square footage)",
      "Material type (asphalt, metal, tile, slate)",
      "Roof pitch and complexity",
      "Number of layers to remove",
      "Local labor rates",
      "Permit and inspection fees",
      "Underlayment and flashing",
      "Geographic location and climate",
    ],
    faqs: [
      {
        q: "How much does a new roof cost for a 2,000 sq ft house?",
        a: "For a 2,000 sq ft home, expect to pay between $10,000 and $18,000 for standard asphalt shingles, or $15,000–$30,000 for metal roofing. Costs vary by location, pitch, and material quality.",
      },
      {
        q: "What is the cheapest roof to replace?",
        a: "Asphalt three-tab shingles are the most affordable option at $3.50–$5.50 per square foot installed. Architectural shingles cost slightly more but offer better durability and curb appeal.",
      },
      {
        q: "How long does a roof replacement take?",
        a: "Most roof replacements take 3–5 days for an average-sized home. Complex roofs with multiple layers, steep pitches, or weather delays may take longer.",
      },
      {
        q: "Does insurance cover roof replacement?",
        a: "Homeowners insurance typically covers roof damage from storms, hail, and fallen trees. Normal wear and aging are usually not covered. Document all damage with photos and file claims promptly.",
      },
      {
        q: "When is the best time to replace a roof?",
        a: "Late spring through early fall offers the best conditions for roofing work. Avoid peak summer months when contractor demand and prices are highest.",
      },
    ],
    relatedProjects: ["kitchen-remodel-cost", "window-replacement-cost", "hvac-installation-cost"],
  },
  {
    slug: "kitchen-remodel-cost",
    projectType: "kitchen",
    name: "Kitchen Remodel",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    seoTitle: "Kitchen Remodel Cost 2026 — Average Prices & Budget Guide | CostReno",
    seoDescription:
      "How much does a kitchen remodel cost in 2026? Average cost is $50,000. Get personalized estimates, compare materials, and plan your renovation budget.",
    h1: "How Much Does a Kitchen Remodel Cost in 2026?",
    intro:
      "A kitchen remodel is the most popular home renovation project and typically delivers the highest return on investment. From minor cosmetic updates to full gut renovations, costs vary widely based on scope, materials, and your local market. CostReno helps you understand exactly what to expect before you hire.",
    avgCost: "$50,000",
    costRange: "$25,000 – $75,000",
    timeline: "4–8 weeks",
    roi: "72%",
    costBreakdown: [
      { item: "Cabinets & hardware", pct: "35%" },
      { item: "Labor & installation", pct: "25%" },
      { item: "Countertops", pct: "12%" },
      { item: "Appliances", pct: "12%" },
      { item: "Flooring", pct: "8%" },
      { item: "Plumbing & electrical", pct: "5%" },
      { item: "Permits & design", pct: "3%" },
    ],
    reviews: [
      {
        name: "James R.",
        location: "Denver, CO",
        text: "The estimator showed my kitchen quote was $8K over market rate. Got a second quote and saved a fortune.",
        rating: 5,
      },
      {
        name: "Linda C.",
        location: "Chicago, IL",
        text: "Having the cost breakdown by category helped me decide where to splurge and where to save. Ended up with a dream kitchen under budget.",
        rating: 5,
      },
      {
        name: "Mike T.",
        location: "Seattle, WA",
        text: "I was quoted $65K. CostReno's data showed the average for my area was $48K. I negotiated and landed at $52K.",
        rating: 5,
      },
    ],
    costFactors: [
      "Kitchen size and layout changes",
      "Cabinet quality (stock, semi-custom, custom)",
      "Countertop material (laminate, quartz, granite)",
      "Appliance upgrades",
      "Flooring replacement",
      "Plumbing and electrical updates",
      "Backsplash and lighting",
      "Permits and design fees",
    ],
    faqs: [
      {
        q: "How much does a kitchen remodel cost for a small kitchen?",
        a: "A small kitchen remodel (under 100 sq ft) typically costs $15,000–$30,000 for a mid-range update. Cosmetic refreshes with painted cabinets and new hardware can be done for $5,000–$10,000.",
      },
      {
        q: "What is the most expensive part of a kitchen remodel?",
        a: "Cabinets are the biggest cost, typically 30-40% of total budget. Custom cabinets can cost $20,000–$40,000 alone. Countertops and labor are the next largest expenses.",
      },
      {
        q: "How long does a full kitchen remodel take?",
        a: "A full kitchen remodel takes 4–8 weeks on average. Minor updates can be done in 2–3 weeks. Plan for eating out or setting up a temporary kitchen during construction.",
      },
      {
        q: "Is a kitchen remodel worth the investment?",
        a: "Kitchen remodels typically return 60-80% of costs at resale. They also significantly improve daily quality of life and are the #1 feature buyers look for.",
      },
      {
        q: "Can I remodel my kitchen for $20,000?",
        a: "Yes, a $20,000 budget allows for new countertops, refaced cabinets, updated hardware, fresh paint, and new flooring. Prioritize high-impact changes over full replacements.",
      },
    ],
    relatedProjects: ["bathroom-remodel-cost", "flooring-cost", "roof-replacement-cost"],
  },
  {
    slug: "bathroom-remodel-cost",
    projectType: "bathroom",
    name: "Bathroom Remodel",
    image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
    seoTitle: "Bathroom Remodel Cost 2026 — Average Prices & Estimates | CostReno",
    seoDescription:
      "How much does a bathroom remodel cost in 2026? Average cost is $19,000. Get instant estimates, compare fixtures, and plan your renovation.",
    h1: "How Much Does a Bathroom Remodel Cost in 2026?",
    intro:
      "A bathroom remodel can transform one of the most-used rooms in your home. Whether you're updating a guest bath or completely renovating a master bathroom, understanding costs upfront helps you avoid budget surprises. CostReno provides personalized estimates based on your specific project details and location.",
    avgCost: "$19,000",
    costRange: "$8,000 – $30,000",
    timeline: "2–4 weeks",
    roi: "65%",
    costBreakdown: [
      { item: "Tile & surfaces", pct: "25%" },
      { item: "Labor", pct: "30%" },
      { item: "Vanity & countertop", pct: "15%" },
      { item: "Shower/tub", pct: "15%" },
      { item: "Plumbing", pct: "8%" },
      { item: "Fixtures & lighting", pct: "5%" },
      { item: "Permits", pct: "2%" },
    ],
    reviews: [
      {
        name: "Maria L.",
        location: "Tampa, FL",
        text: "The estimator helped me budget accurately. My final cost was within 5% of what CostReno predicted.",
        rating: 5,
      },
      {
        name: "Karen S.",
        location: "Atlanta, GA",
        text: "I compared 3 bathroom quotes using the analyzer. One was clearly missing waterproofing — would've been a disaster.",
        rating: 5,
      },
      {
        name: "David K.",
        location: "Portland, OR",
        text: "Simple, fast, and accurate. Felt confident picking the right contractor after seeing the data.",
        rating: 5,
      },
    ],
    costFactors: [
      "Bathroom size",
      "Tile selection and coverage area",
      "Vanity and countertop quality",
      "Shower/tub replacement or refinishing",
      "Plumbing relocations",
      "Lighting and ventilation",
      "Waterproofing and subfloor repairs",
      "Labor rates in your area",
    ],
    faqs: [
      {
        q: "How much does a small bathroom remodel cost?",
        a: "A small bathroom (under 50 sq ft) remodel typically costs $8,000–$15,000 for a mid-range update. A basic refresh with new fixtures and paint can be done for $3,000–$6,000.",
      },
      {
        q: "What adds the most value in a bathroom remodel?",
        a: "Updating the vanity, adding a walk-in shower, and replacing outdated tile offer the highest ROI. Heated floors and double vanities are popular upgrades that add perceived value.",
      },
      {
        q: "How long does a bathroom renovation take?",
        a: "A standard bathroom remodel takes 2–4 weeks. Complex renovations involving plumbing moves or structural changes can take 6+ weeks.",
      },
      {
        q: "Do I need a permit for a bathroom remodel?",
        a: "Yes, if you're moving plumbing, adding electrical circuits, or changing the layout. Cosmetic updates like paint, fixtures, and tile typically don't require permits.",
      },
    ],
    relatedProjects: ["kitchen-remodel-cost", "flooring-cost", "roof-replacement-cost"],
  },
  {
    slug: "window-replacement-cost",
    projectType: "windows",
    name: "Window Replacement",
    image: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=800&q=80",
    seoTitle: "Window Replacement Cost 2026 — Prices Per Window & Estimates | CostReno",
    seoDescription:
      "How much does window replacement cost in 2026? Average total cost is $12,500. Get estimates per window, compare brands, and find local installers.",
    h1: "How Much Does Window Replacement Cost in 2026?",
    intro:
      "Replacing old windows improves energy efficiency, comfort, and curb appeal. Whether you're upgrading single-pane windows or replacing damaged frames, costs depend on window type, material, and installation complexity. Get an accurate estimate for your home with CostReno.",
    avgCost: "$12,500",
    costRange: "$6,000 – $21,000",
    timeline: "1–3 days",
    roi: "72%",
    costBreakdown: [
      { item: "Windows (materials)", pct: "45%" },
      { item: "Installation labor", pct: "30%" },
      { item: "Trim & finishing", pct: "12%" },
      { item: "Structural repairs", pct: "8%" },
      { item: "Permits & disposal", pct: "5%" },
    ],
    reviews: [
      {
        name: "Robert P.",
        location: "Minneapolis, MN",
        text: "Replaced 12 windows. CostReno's estimate was spot-on and helped me compare vinyl vs fiberglass options.",
        rating: 5,
      },
      {
        name: "Jennifer W.",
        location: "Charlotte, NC",
        text: "My energy bill dropped 28% after the replacement. The cost estimator helped me justify the investment.",
        rating: 5,
      },
      {
        name: "Steve L.",
        location: "Boston, MA",
        text: "The quote analyzer caught that my contractor didn't include Low-E glass in the bid. Huge savings on energy.",
        rating: 5,
      },
    ],
    costFactors: [
      "Number of windows",
      "Window type (double-hung, casement, picture)",
      "Frame material (vinyl, wood, fiberglass)",
      "Glass type (double-pane, triple-pane, Low-E)",
      "Custom sizes vs standard",
      "Installation complexity",
      "Structural repairs needed",
      "Energy efficiency rating",
    ],
    faqs: [
      {
        q: "How much does it cost to replace one window?",
        a: "A single window replacement costs $400–$1,200 including installation for standard vinyl windows. Premium wood or fiberglass windows can cost $800–$2,000+ per window.",
      },
      {
        q: "Are replacement windows worth the cost?",
        a: "Yes, energy-efficient windows can reduce heating/cooling costs by 25-30% and typically return 70%+ at resale. They also reduce noise and improve comfort.",
      },
      {
        q: "How long do replacement windows last?",
        a: "Quality vinyl windows last 20-40 years. Wood windows can last 30+ years with proper maintenance. Fiberglass windows often last 50+ years.",
      },
    ],
    relatedProjects: ["roof-replacement-cost", "hvac-installation-cost", "flooring-cost"],
  },
  {
    slug: "flooring-cost",
    projectType: "flooring",
    name: "Flooring Installation",
    image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&q=80",
    seoTitle: "Flooring Installation Cost 2026 — Prices Per Sq Ft & Estimates | CostReno",
    seoDescription:
      "How much does new flooring cost in 2026? Average cost is $7,500. Compare hardwood, tile, LVP, and carpet prices per square foot.",
    h1: "How Much Does New Flooring Cost in 2026?",
    intro:
      "New flooring transforms the look and feel of your entire home. From luxury vinyl plank to hardwood, costs vary significantly by material, room size, and installation method. CostReno helps you compare options and get accurate estimates for your specific project.",
    avgCost: "$7,500",
    costRange: "$3,000 – $15,000",
    timeline: "2–5 days",
    roi: "70%",
    costBreakdown: [
      { item: "Flooring material", pct: "50%" },
      { item: "Installation labor", pct: "30%" },
      { item: "Subfloor preparation", pct: "10%" },
      { item: "Removal of existing", pct: "5%" },
      { item: "Transitions & trim", pct: "5%" },
    ],
    reviews: [
      {
        name: "Amy F.",
        location: "San Diego, CA",
        text: "Compared LVP vs hardwood costs instantly. Went with LVP and saved $4K while getting a beautiful result.",
        rating: 5,
      },
      {
        name: "Carlos R.",
        location: "Houston, TX",
        text: "The per-square-foot breakdown helped me understand that my contractor's quote was fair. No stress.",
        rating: 5,
      },
      {
        name: "Nancy B.",
        location: "Raleigh, NC",
        text: "Used the estimator for 3 rooms and the total was within $200 of my actual bill. Incredibly accurate.",
        rating: 5,
      },
    ],
    costFactors: [
      "Total square footage",
      "Material type (hardwood, tile, LVP, carpet)",
      "Subfloor preparation needs",
      "Removal of existing flooring",
      "Room complexity and transitions",
      "Material grade and brand",
      "Installation method",
      "Underlayment and moisture barriers",
    ],
    faqs: [
      {
        q: "What is the cheapest flooring to install?",
        a: "Luxury vinyl plank (LVP) and laminate are the most affordable options at $2–$5 per sq ft installed. They're durable, waterproof, and available in realistic wood looks.",
      },
      {
        q: "How much does hardwood flooring cost?",
        a: "Hardwood flooring costs $6–$12 per sq ft installed for solid hardwood, or $4–$8 for engineered hardwood. Exotic species can exceed $15 per sq ft.",
      },
      {
        q: "What flooring adds the most home value?",
        a: "Hardwood flooring consistently ranks as the top value-add. Homes with hardwood floors sell for 2-5% more on average. LVP is a budget-friendly alternative with similar appeal.",
      },
    ],
    relatedProjects: ["kitchen-remodel-cost", "bathroom-remodel-cost", "window-replacement-cost"],
  },
  {
    slug: "hvac-installation-cost",
    projectType: "hvac",
    name: "HVAC Installation",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80",
    seoTitle: "HVAC Installation Cost 2026 — Replacement Prices & Estimates | CostReno",
    seoDescription:
      "How much does HVAC replacement cost in 2026? Average cost is $8,250. Compare central air, heat pumps, and furnace prices with local estimates.",
    h1: "How Much Does HVAC Replacement Cost in 2026?",
    intro:
      "Your HVAC system is essential for year-round comfort. Whether you need a full system replacement or an upgrade to a more efficient unit, understanding costs helps you make the right choice. CostReno provides estimates based on your home size, climate zone, and system preferences.",
    avgCost: "$8,250",
    costRange: "$4,500 – $12,000",
    timeline: "1–2 days",
    roi: "58%",
    costBreakdown: [
      { item: "Equipment (unit)", pct: "50%" },
      { item: "Installation labor", pct: "30%" },
      { item: "Ductwork modifications", pct: "10%" },
      { item: "Thermostat & controls", pct: "5%" },
      { item: "Permits & inspections", pct: "5%" },
    ],
    reviews: [
      {
        name: "Maria L.",
        location: "Tampa, FL",
        text: "The AI caught that my HVAC quote was missing the permit fee and ductwork inspection. Would have been a $1,500 surprise.",
        rating: 5,
      },
      {
        name: "Greg P.",
        location: "Dallas, TX",
        text: "Compared heat pump vs central air costs in minutes. Made an informed decision that saves me $80/month on energy.",
        rating: 5,
      },
      {
        name: "Angela W.",
        location: "Columbus, OH",
        text: "My contractor quoted $14K. CostReno showed the average was $8K for my size home. Got a second quote at $8,500.",
        rating: 5,
      },
    ],
    costFactors: [
      "System type (central air, heat pump, furnace)",
      "Home square footage",
      "SEER rating and efficiency",
      "Ductwork condition or replacement",
      "Brand and warranty",
      "Local labor rates",
      "Thermostat and controls",
      "Permits and inspections",
    ],
    faqs: [
      {
        q: "How much does a new HVAC system cost?",
        a: "A complete HVAC system (furnace + AC) costs $8,000–$15,000 installed. AC-only replacement is $4,000–$8,000. Heat pumps cost $5,000–$12,000 depending on type.",
      },
      {
        q: "How long does an HVAC system last?",
        a: "Most HVAC systems last 15-20 years with proper maintenance. Heat pumps typically last 10-15 years. Regular filter changes and annual tune-ups extend lifespan.",
      },
      {
        q: "Should I repair or replace my HVAC?",
        a: "Replace if your system is 15+ years old, repairs exceed 50% of replacement cost, or energy bills are rising significantly. Modern systems are 40-60% more efficient.",
      },
    ],
    relatedProjects: ["roof-replacement-cost", "window-replacement-cost", "bathroom-remodel-cost"],
  },
];

export function getProjectBySlug(slug: string): ProjectConfig | undefined {
  return PROJECT_CONFIGS.find((p) => p.slug === slug);
}

export function getProjectByType(type: string): ProjectConfig | undefined {
  return PROJECT_CONFIGS.find((p) => p.projectType === type);
}
