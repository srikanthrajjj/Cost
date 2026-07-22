/**
 * Seeds src/data/cities.json for the SEO city-page MVP (~32 metros).
 * Run: node scripts/seed-mvp-cities.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "../src/data/cities.json");

const CATEGORY_IDS = [
  "roof-replacement",
  "kitchen-remodel",
  "bathroom-remodel",
  "hvac-installation",
];

/** @type {Array<Omit<import('../src/lib/city-data').City, 'introParagraphs'> & { introSeed?: Partial<Record<string, string>> }>} */
const SEED = [
  {
    city: "Austin",
    state: "Texas",
    stateAbbr: "TX",
    slug: "austin",
    stateSlug: "texas",
    zipPrefix: "78701",
    laborCostMultiplier: 1.05,
    typicalHomeAge: "2000s suburbs with 1970s to 1990s stock in central neighborhoods",
    climateNotes:
      "Hot semi-arid climate with intense summer heat, high UV, and occasional hail.",
    regionalNotes:
      "Fast growth keeps contractor demand high and schedules tight across popular zip codes.",
    nearestPermitOffice: "Austin Development Services Department",
    population: 961855,
    medianHomeValue: 550000,
  },
  {
    city: "Dallas",
    state: "Texas",
    stateAbbr: "TX",
    slug: "dallas",
    stateSlug: "texas",
    zipPrefix: "75201",
    laborCostMultiplier: 1.02,
    typicalHomeAge: "Mix of postwar ranch homes and newer suburban builds",
    climateNotes:
      "Hot summers, severe thunderstorms, and hail risk that drive impact-resistant roofing demand.",
    regionalNotes:
      "Large metro competition can widen quote ranges between national and local contractors.",
    nearestPermitOffice: "City of Dallas Building Inspection",
    population: 1304379,
    medianHomeValue: 340000,
  },
  {
    city: "Houston",
    state: "Texas",
    stateAbbr: "TX",
    slug: "houston",
    stateSlug: "texas",
    zipPrefix: "77002",
    laborCostMultiplier: 1.0,
    typicalHomeAge: "Broad mix from mid-century homes to rapid new construction",
    climateNotes:
      "Humid subtropical climate with heavy rain, tropical storms, and high moisture load.",
    regionalNotes:
      "Flood and storm resilience often shape material and drainage choices on renovations.",
    nearestPermitOffice: "Houston Permitting Center",
    population: 2304580,
    medianHomeValue: 310000,
  },
  {
    city: "San Antonio",
    state: "Texas",
    stateAbbr: "TX",
    slug: "san-antonio",
    stateSlug: "texas",
    zipPrefix: "78205",
    laborCostMultiplier: 0.95,
    typicalHomeAge: "Older central neighborhoods plus expanding suburban housing",
    climateNotes: "Hot summers, mild winters, and strong solar exposure year-round.",
    regionalNotes:
      "Labor tends to run slightly below larger Texas metros, with steady remodel demand.",
    nearestPermitOffice: "City of San Antonio Development Services",
    population: 1492990,
    medianHomeValue: 275000,
  },
  {
    city: "Phoenix",
    state: "Arizona",
    stateAbbr: "AZ",
    slug: "phoenix",
    stateSlug: "arizona",
    zipPrefix: "85001",
    laborCostMultiplier: 1.08,
    typicalHomeAge: "Large share of 1980s to 2000s suburban homes and tile roofs",
    climateNotes:
      "Desert climate with extreme heat, intense UV, and monsoon storms in summer.",
    regionalNotes:
      "Heat-rated materials, attic ventilation, and AC capacity are frequent renovation priorities.",
    nearestPermitOffice: "City of Phoenix Planning and Development",
    population: 1650070,
    medianHomeValue: 430000,
  },
  {
    city: "Tucson",
    state: "Arizona",
    stateAbbr: "AZ",
    slug: "tucson",
    stateSlug: "arizona",
    zipPrefix: "85701",
    laborCostMultiplier: 0.98,
    typicalHomeAge: "Mid-century homes mixed with desert contemporary builds",
    climateNotes: "Hot, dry climate with monsoon moisture spikes and high sun exposure.",
    regionalNotes:
      "Cooling efficiency and sun-resistant exterior materials strongly affect project specs.",
    nearestPermitOffice: "City of Tucson Planning and Development Services",
    population: 546079,
    medianHomeValue: 320000,
  },
  {
    city: "Denver",
    state: "Colorado",
    stateAbbr: "CO",
    slug: "denver",
    stateSlug: "colorado",
    zipPrefix: "80202",
    laborCostMultiplier: 1.12,
    typicalHomeAge: "Brick bungalows, mid-century homes, and densifying urban infill",
    climateNotes:
      "High altitude, large temperature swings, snow load, and strong hail seasons.",
    regionalNotes:
      "Labor and material costs run above national averages due to growth and climate stress.",
    nearestPermitOffice: "Denver Community Planning and Development",
    population: 711463,
    medianHomeValue: 560000,
  },
  {
    city: "Colorado Springs",
    state: "Colorado",
    stateAbbr: "CO",
    slug: "colorado-springs",
    stateSlug: "colorado",
    zipPrefix: "80903",
    laborCostMultiplier: 1.05,
    typicalHomeAge: "1970s to 2000s suburban stock with mountain-adjacent newer builds",
    climateNotes: "Four-season climate with snow, freeze-thaw cycles, and hail risk.",
    regionalNotes:
      "Roofing and HVAC projects often prioritize weather durability over cosmetic upgrades.",
    nearestPermitOffice: "Colorado Springs Land Use Review",
    population: 488664,
    medianHomeValue: 450000,
  },
  {
    city: "Atlanta",
    state: "Georgia",
    stateAbbr: "GA",
    slug: "atlanta",
    stateSlug: "georgia",
    zipPrefix: "30301",
    laborCostMultiplier: 1.04,
    typicalHomeAge: "Early 20th-century intown homes plus large suburban inventory",
    climateNotes: "Humid subtropical weather with heavy rain, humidity, and storm seasons.",
    regionalNotes:
      "Humidity and older plumbing or electrical systems frequently expand remodel scope.",
    nearestPermitOffice: "City of Atlanta Office of Buildings",
    population: 498715,
    medianHomeValue: 390000,
  },
  {
    city: "Charlotte",
    state: "North Carolina",
    stateAbbr: "NC",
    slug: "charlotte",
    stateSlug: "north-carolina",
    zipPrefix: "28202",
    laborCostMultiplier: 1.03,
    typicalHomeAge: "Rapid suburban growth with pockets of older urban housing",
    climateNotes: "Hot humid summers, mild winters, and thunderstorm activity.",
    regionalNotes:
      "Strong in-migration supports active renovation markets and variable contractor pricing.",
    nearestPermitOffice: "City of Charlotte Development Center",
    population: 911311,
    medianHomeValue: 380000,
  },
  {
    city: "Raleigh",
    state: "North Carolina",
    stateAbbr: "NC",
    slug: "raleigh",
    stateSlug: "north-carolina",
    zipPrefix: "27601",
    laborCostMultiplier: 1.06,
    typicalHomeAge: "Newer suburban homes with growing intown renovation activity",
    climateNotes: "Humid summers, mild winters, and occasional severe storms.",
    regionalNotes:
      "Tech-driven population growth keeps remodeling demand and labor markets competitive.",
    nearestPermitOffice: "City of Raleigh Development Services",
    population: 474069,
    medianHomeValue: 420000,
  },
  {
    city: "Miami",
    state: "Florida",
    stateAbbr: "FL",
    slug: "miami",
    stateSlug: "florida",
    zipPrefix: "33101",
    laborCostMultiplier: 1.15,
    typicalHomeAge: "Condo-heavy inventory plus older coastal and urban homes",
    climateNotes:
      "Tropical climate with hurricanes, salt air, and extreme humidity year-round.",
    regionalNotes:
      "Wind codes, moisture control, and coastal material standards raise project complexity.",
    nearestPermitOffice: "Miami Building Department",
    population: 449514,
    medianHomeValue: 520000,
  },
  {
    city: "Tampa",
    state: "Florida",
    stateAbbr: "FL",
    slug: "tampa",
    stateSlug: "florida",
    zipPrefix: "33602",
    laborCostMultiplier: 1.07,
    typicalHomeAge: "Postwar homes and fast-growing suburban communities",
    climateNotes: "Hot humid weather, heavy rain, and hurricane exposure.",
    regionalNotes:
      "Storm preparedness and mold-resistant detailing are common renovation requirements.",
    nearestPermitOffice: "City of Tampa Construction Services",
    population: 403364,
    medianHomeValue: 380000,
  },
  {
    city: "Orlando",
    state: "Florida",
    stateAbbr: "FL",
    slug: "orlando",
    stateSlug: "florida",
    zipPrefix: "32801",
    laborCostMultiplier: 1.05,
    typicalHomeAge: "1980s to 2010s suburban housing dominant across the metro",
    climateNotes: "Humid subtropical climate with intense summer storms and heat.",
    regionalNotes:
      "Tourism-driven growth sustains remodeling demand and seasonal contractor swings.",
    nearestPermitOffice: "City of Orlando Permitting Services",
    population: 320742,
    medianHomeValue: 360000,
  },
  {
    city: "Jacksonville",
    state: "Florida",
    stateAbbr: "FL",
    slug: "jacksonville",
    stateSlug: "florida",
    zipPrefix: "32202",
    laborCostMultiplier: 0.98,
    typicalHomeAge: "Large suburban footprint with varied coastal and inland stock",
    climateNotes: "Humid climate with hurricane risk and high moisture year-round.",
    regionalNotes:
      "Labor can run below South Florida pricing while storm codes still shape specs.",
    nearestPermitOffice: "City of Jacksonville Building Inspection",
    population: 971319,
    medianHomeValue: 310000,
  },
  {
    city: "Chicago",
    state: "Illinois",
    stateAbbr: "IL",
    slug: "chicago",
    stateSlug: "illinois",
    zipPrefix: "60601",
    laborCostMultiplier: 1.18,
    typicalHomeAge: "Dense older housing, brick bungalows, and vintage multifamily stock",
    climateNotes:
      "Cold winters, freeze-thaw cycles, lake-effect weather, and wide seasonal swings.",
    regionalNotes:
      "Older mechanical systems and insulation upgrades often appear during remodel scopes.",
    nearestPermitOffice: "City of Chicago Department of Buildings",
    population: 2664452,
    medianHomeValue: 320000,
  },
  {
    city: "Columbus",
    state: "Ohio",
    stateAbbr: "OH",
    slug: "columbus",
    stateSlug: "ohio",
    zipPrefix: "43215",
    laborCostMultiplier: 0.97,
    typicalHomeAge: "Mid-century suburbs with revitalizing urban neighborhoods",
    climateNotes: "Four-season Midwest climate with snow, freeze-thaw, and humid summers.",
    regionalNotes:
      "Generally moderate labor rates with steady demand from growing employment centers.",
    nearestPermitOffice: "City of Columbus Building and Zoning Services",
    population: 913175,
    medianHomeValue: 280000,
  },
  {
    city: "Indianapolis",
    state: "Indiana",
    stateAbbr: "IN",
    slug: "indianapolis",
    stateSlug: "indiana",
    zipPrefix: "46204",
    laborCostMultiplier: 0.94,
    typicalHomeAge: "Postwar ranch homes and expanding suburban developments",
    climateNotes: "Cold winters, humid summers, and frequent freeze-thaw stress.",
    regionalNotes:
      "Lower-than-coastal labor costs can improve value, but older systems may need upgrades.",
    nearestPermitOffice: "City of Indianapolis Department of Business and Neighborhood Services",
    population: 880621,
    medianHomeValue: 240000,
  },
  {
    city: "Nashville",
    state: "Tennessee",
    stateAbbr: "TN",
    slug: "nashville",
    stateSlug: "tennessee",
    zipPrefix: "37201",
    laborCostMultiplier: 1.09,
    typicalHomeAge: "Older intown homes plus rapid suburban and infill construction",
    climateNotes: "Humid summers, mild winters, and severe thunderstorm seasons.",
    regionalNotes:
      "High in-migration has tightened contractor calendars and lifted remodel pricing.",
    nearestPermitOffice: "Metropolitan Nashville Codes Department",
    population: 689447,
    medianHomeValue: 450000,
  },
  {
    city: "Seattle",
    state: "Washington",
    stateAbbr: "WA",
    slug: "seattle",
    stateSlug: "washington",
    zipPrefix: "98101",
    laborCostMultiplier: 1.25,
    typicalHomeAge: "Early 20th-century homes and dense urban remodels",
    climateNotes: "Mild wet climate with long rainy seasons and moss-prone roofing conditions.",
    regionalNotes:
      "High labor costs and strict energy codes significantly influence renovation budgets.",
    nearestPermitOffice: "Seattle Department of Construction and Inspections",
    population: 755078,
    medianHomeValue: 850000,
  },
  {
    city: "Portland",
    state: "Oregon",
    stateAbbr: "OR",
    slug: "portland",
    stateSlug: "oregon",
    zipPrefix: "97201",
    laborCostMultiplier: 1.16,
    typicalHomeAge: "Craftsman homes, mid-century stock, and compact urban lots",
    climateNotes: "Wet winters, mild summers, and persistent moisture exposure.",
    regionalNotes:
      "Sustainability preferences and older housing details often expand project scope.",
    nearestPermitOffice: "Portland Bureau of Development Services",
    population: 635067,
    medianHomeValue: 540000,
  },
  {
    city: "Los Angeles",
    state: "California",
    stateAbbr: "CA",
    slug: "los-angeles",
    stateSlug: "california",
    zipPrefix: "90012",
    laborCostMultiplier: 1.28,
    typicalHomeAge: "Wide mix from early bungalows to hillside and postwar homes",
    climateNotes:
      "Mediterranean climate with wildfire, heat, and seismic considerations.",
    regionalNotes:
      "Permitting complexity and high labor rates make detailed scopes especially important.",
    nearestPermitOffice: "Los Angeles Department of Building and Safety",
    population: 3820914,
    medianHomeValue: 950000,
  },
  {
    city: "San Diego",
    state: "California",
    stateAbbr: "CA",
    slug: "san-diego",
    stateSlug: "california",
    zipPrefix: "92101",
    laborCostMultiplier: 1.22,
    typicalHomeAge: "Postwar homes, coastal properties, and suburban ranch stock",
    climateNotes: "Mild coastal climate with salt air and strong sun exposure.",
    regionalNotes:
      "Coastal corrosion, energy rules, and high labor push remodel costs above national norms.",
    nearestPermitOffice: "City of San Diego Development Services",
    population: 1386932,
    medianHomeValue: 900000,
  },
  {
    city: "San Francisco",
    state: "California",
    stateAbbr: "CA",
    slug: "san-francisco",
    stateSlug: "california",
    zipPrefix: "94102",
    laborCostMultiplier: 1.45,
    typicalHomeAge: "Dense Victorian and early 20th-century housing with complex renovations",
    climateNotes: "Cool marine climate with fog, wind, and moisture exposure.",
    regionalNotes:
      "Among the highest labor and permitting costs in the U.S., with strict seismic rules.",
    nearestPermitOffice: "San Francisco Department of Building Inspection",
    population: 808437,
    medianHomeValue: 1400000,
  },
  {
    city: "San Jose",
    state: "California",
    stateAbbr: "CA",
    slug: "san-jose",
    stateSlug: "california",
    zipPrefix: "95110",
    laborCostMultiplier: 1.35,
    typicalHomeAge: "Postwar suburban homes with extensive remodel and ADU activity",
    climateNotes: "Mild Mediterranean climate with dry summers and wet winters.",
    regionalNotes:
      "Bay Area labor scarcity and high home values keep renovation budgets elevated.",
    nearestPermitOffice: "City of San Jose Planning, Building and Code Enforcement",
    population: 969655,
    medianHomeValue: 1300000,
  },
  {
    city: "New York",
    state: "New York",
    stateAbbr: "NY",
    slug: "new-york",
    stateSlug: "new-york",
    zipPrefix: "10001",
    laborCostMultiplier: 1.4,
    typicalHomeAge: "Dense older housing, brownstones, and high-rise residential stock",
    climateNotes: "Four-season climate with cold winters, humid summers, and coastal storms.",
    regionalNotes:
      "Labor, logistics, and building rules make renovations more complex than national averages.",
    nearestPermitOffice: "NYC Department of Buildings",
    population: 8253213,
    medianHomeValue: 750000,
  },
  {
    city: "Boston",
    state: "Massachusetts",
    stateAbbr: "MA",
    slug: "boston",
    stateSlug: "massachusetts",
    zipPrefix: "02108",
    laborCostMultiplier: 1.3,
    typicalHomeAge: "Historic triple-deckers, brick homes, and compact urban lots",
    climateNotes: "Cold snowy winters, humid summers, and coastal weather exposure.",
    regionalNotes:
      "Historic housing and high labor rates frequently increase remodel contingencies.",
    nearestPermitOffice: "City of Boston Inspectional Services Department",
    population: 653833,
    medianHomeValue: 780000,
  },
  {
    city: "Philadelphia",
    state: "Pennsylvania",
    stateAbbr: "PA",
    slug: "philadelphia",
    stateSlug: "pennsylvania",
    zipPrefix: "19102",
    laborCostMultiplier: 1.1,
    typicalHomeAge: "Rowhomes and older masonry housing across many neighborhoods",
    climateNotes: "Humid summers, cold winters, and freeze-thaw exterior wear.",
    regionalNotes:
      "Older building systems often surface unexpected costs during gut renovations.",
    nearestPermitOffice: "Philadelphia Department of Licenses and Inspections",
    population: 1555064,
    medianHomeValue: 250000,
  },
  {
    city: "Washington",
    state: "District of Columbia",
    stateAbbr: "DC",
    slug: "washington",
    stateSlug: "dc",
    zipPrefix: "20001",
    laborCostMultiplier: 1.32,
    typicalHomeAge: "Historic rowhouses and dense urban housing with renovation overlays",
    climateNotes: "Humid subtropical weather with hot summers and occasional winter freezes.",
    regionalNotes:
      "Historic district rules and high labor can extend timelines and raise budgets.",
    nearestPermitOffice: "DC Department of Buildings",
    population: 678972,
    medianHomeValue: 720000,
  },
  {
    city: "Minneapolis",
    state: "Minnesota",
    stateAbbr: "MN",
    slug: "minneapolis",
    stateSlug: "minnesota",
    zipPrefix: "55401",
    laborCostMultiplier: 1.08,
    typicalHomeAge: "Early 20th-century homes and durable Midwest housing stock",
    climateNotes: "Long cold winters, snow load, and freeze-thaw stress on exteriors.",
    regionalNotes:
      "Insulation, ice damming prevention, and HVAC capacity are frequent upgrade drivers.",
    nearestPermitOffice: "City of Minneapolis Community Planning and Economic Development",
    population: 425336,
    medianHomeValue: 340000,
  },
  {
    city: "Detroit",
    state: "Michigan",
    stateAbbr: "MI",
    slug: "detroit",
    stateSlug: "michigan",
    zipPrefix: "48201",
    laborCostMultiplier: 0.92,
    typicalHomeAge: "Early to mid-20th-century homes with active neighborhood revitalization",
    climateNotes: "Cold winters, humid summers, and freeze-thaw cycles.",
    regionalNotes:
      "Lower labor rates can improve value, while older systems often need modernization.",
    nearestPermitOffice: "City of Detroit Buildings, Safety Engineering and Environmental Department",
    population: 620376,
    medianHomeValue: 90000,
  },
  {
    city: "Las Vegas",
    state: "Nevada",
    stateAbbr: "NV",
    slug: "las-vegas",
    stateSlug: "nevada",
    zipPrefix: "89101",
    laborCostMultiplier: 1.06,
    typicalHomeAge: "1990s to 2010s suburban housing with tile roofs common",
    climateNotes: "Desert heat, intense sun, and monsoon storm bursts.",
    regionalNotes:
      "Cooling loads, UV exposure, and tile roof systems shape many renovation choices.",
    nearestPermitOffice: "City of Las Vegas Building and Safety",
    population: 656274,
    medianHomeValue: 410000,
  },
];

function shortClimate(notes) {
  const first = notes.split(/[.!?]/)[0]?.trim();
  return first ? `${first.toLowerCase()}` : "local climate conditions";
}

function shortHomeAge(notes) {
  return notes.replace(/\.$/, "").toLowerCase();
}

function laborLabel(m) {
  if (m >= 1.15) return `${Math.round((m - 1) * 100)}% above the national average`;
  if (m <= 0.95) return `${Math.round((1 - m) * 100)}% below the national average`;
  return "near the national average";
}

function buildIntros(city) {
  const climate = shortClimate(city.climateNotes);
  const homeAge = shortHomeAge(city.typicalHomeAge);
  const labor = laborLabel(city.laborCostMultiplier);
  const regional = city.regionalNotes.replace(/\.$/, "");

  return {
    "roof-replacement": `Homeowners planning a roof replacement in ${city.city}, ${city.state} face pricing shaped by local labor (${labor}), housing stock (${homeAge}), and climate (${climate}). ${regional}. CostReno helps you estimate a fair range for ${city.city} before you compare contractor quotes.`,
    "kitchen-remodel": `A kitchen remodel in ${city.city}, ${city.state} is priced by cabinets, appliances, layout changes, and local labor (${labor}). Many homes here are ${homeAge}, which can mean electrical or plumbing updates mid-project. ${regional}. Use CostReno to set a realistic ${city.city} budget before collecting bids.`,
    "bathroom-remodel": `Bathroom remodel costs in ${city.city}, ${city.state} depend on fixtures, waterproofing, and whether the layout stays the same. Local labor runs ${labor}, and older housing (${homeAge}) can hide plumbing issues. ${regional}. CostReno helps ${city.city} homeowners estimate a fair range before hiring.`,
    "hvac-installation": `HVAC installation costs in ${city.city}, ${city.state} track system size, efficiency, duct condition, and climate load (${climate}). Labor here is ${labor}. ${regional}. CostReno helps you estimate a fair HVAC budget for ${city.city} homes before you book an install.`,
  };
}

const cities = SEED.map((city) => ({
  ...city,
  introParagraphs: buildIntros(city),
}));

// Validate uniqueness
const slugs = new Set(cities.map((c) => `${c.stateSlug}/${c.slug}`));
if (slugs.size !== cities.length) {
  throw new Error("Duplicate city slugs detected");
}

fs.writeFileSync(OUT, JSON.stringify(cities, null, 2) + "\n", "utf-8");
console.log(
  `Wrote ${cities.length} cities × ${CATEGORY_IDS.length} categories = ${cities.length * CATEGORY_IDS.length} pages to ${OUT}`,
);
