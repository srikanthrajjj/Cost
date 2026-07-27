import fs from "fs";

const citiesPath = "C:/Users/LENOVO/Desktop/Costreno/src/data/cities.json";
const enrichPath = "C:/Users/LENOVO/Desktop/Costreno/src/data/city-enrichments.ts";

const cities = JSON.parse(fs.readFileSync(citiesPath, "utf8"));
const existing = new Set(cities.map((c) => c.slug));

function laborLabel(m) {
  if (m >= 1.15) return `${Math.round((m - 1) * 100)}% above the national average`;
  if (m <= 0.95) return `${Math.round((1 - m) * 100)}% below the national average`;
  return "near the national average";
}

const NEW_CITIES = [
  {
    city: "Pittsburgh",
    state: "Pennsylvania",
    stateAbbr: "PA",
    slug: "pittsburgh",
    stateSlug: "pennsylvania",
    zipPrefix: "15222",
    laborCostMultiplier: 1.02,
    typicalHomeAge: "Older brick homes and postwar suburban stock",
    climateNotes: "Four-season climate with freeze-thaw cycles and humid summers.",
    regionalNotes:
      "Steady remodel demand with older housing that often needs mechanical updates.",
    nearestPermitOffice: "City of Pittsburgh Bureau of Building Inspection",
    population: 302971,
    medianHomeValue: 245000,
  },
  {
    city: "Baltimore",
    state: "Maryland",
    stateAbbr: "MD",
    slug: "baltimore",
    stateSlug: "maryland",
    zipPrefix: "21201",
    laborCostMultiplier: 1.12,
    typicalHomeAge: "Rowhomes and mid-century neighborhoods mixed with newer suburbs",
    climateNotes: "Humid summers, cold winters, and coastal storm exposure nearby.",
    regionalNotes:
      "Aging housing stock and above-average labor raise the cost of incomplete scopes.",
    nearestPermitOffice: "Baltimore City Department of Housing and Community Development",
    population: 576498,
    medianHomeValue: 220000,
  },
  {
    city: "Cleveland",
    state: "Ohio",
    stateAbbr: "OH",
    slug: "cleveland",
    stateSlug: "ohio",
    zipPrefix: "44114",
    laborCostMultiplier: 0.94,
    typicalHomeAge: "Early 20th-century housing with later suburban expansion",
    climateNotes: "Lake-effect snow, freeze-thaw cycles, and humid summers.",
    regionalNotes:
      "Lower labor than coastal metros, but older homes often hide plumbing and electrical work.",
    nearestPermitOffice: "City of Cleveland Building and Housing Department",
    population: 367991,
    medianHomeValue: 110000,
  },
  {
    city: "Cincinnati",
    state: "Ohio",
    stateAbbr: "OH",
    slug: "cincinnati",
    stateSlug: "ohio",
    zipPrefix: "45202",
    laborCostMultiplier: 0.96,
    typicalHomeAge: "Victorian and postwar housing across hilly neighborhoods",
    climateNotes: "Four-season Midwest climate with humidity and freeze-thaw stress.",
    regionalNotes: "Hills and older homes affect access, layout changes, and mechanical upgrades.",
    nearestPermitOffice: "City of Cincinnati Department of Buildings and Inspections",
    population: 309317,
    medianHomeValue: 210000,
  },
  {
    city: "Kansas City",
    state: "Missouri",
    stateAbbr: "MO",
    slug: "kansas-city",
    stateSlug: "missouri",
    zipPrefix: "64106",
    laborCostMultiplier: 0.95,
    typicalHomeAge: "Mix of prewar homes and expanding suburban builds",
    climateNotes: "Hot summers, cold winters, and severe thunderstorm risk.",
    regionalNotes:
      "Competitive contractor market with wide quote ranges between local and regional firms.",
    nearestPermitOffice: "City of Kansas City Development Services",
    population: 508090,
    medianHomeValue: 235000,
  },
  {
    city: "St. Louis",
    state: "Missouri",
    stateAbbr: "MO",
    slug: "st-louis",
    stateSlug: "missouri",
    zipPrefix: "63101",
    laborCostMultiplier: 0.94,
    typicalHomeAge: "Brick historic homes and mid-century suburban stock",
    climateNotes: "Humid summers, cold winters, and strong storm seasons.",
    regionalNotes:
      "Older brick housing often needs electrical and plumbing modernization during remodels.",
    nearestPermitOffice: "City of St. Louis Building Division",
    population: 286578,
    medianHomeValue: 185000,
  },
  {
    city: "Milwaukee",
    state: "Wisconsin",
    stateAbbr: "WI",
    slug: "milwaukee",
    stateSlug: "wisconsin",
    zipPrefix: "53202",
    laborCostMultiplier: 1.0,
    typicalHomeAge: "Early 20th-century bungalows and postwar ranches",
    climateNotes: "Cold winters, freeze-thaw cycles, and humid summers near Lake Michigan.",
    regionalNotes: "Seasonal contractor demand and older mechanical systems shape remodel timelines.",
    nearestPermitOffice: "City of Milwaukee Development Center",
    population: 577222,
    medianHomeValue: 215000,
  },
  {
    city: "Oklahoma City",
    state: "Oklahoma",
    stateAbbr: "OK",
    slug: "oklahoma-city",
    stateSlug: "oklahoma",
    zipPrefix: "73102",
    laborCostMultiplier: 0.9,
    typicalHomeAge: "Postwar ranches plus rapid newer suburban growth",
    climateNotes: "Hot summers, severe storms, and hail risk.",
    regionalNotes:
      "Lower labor costs can still hide incomplete storm-hardening or mechanical scope.",
    nearestPermitOffice: "Oklahoma City Development Services",
    population: 687725,
    medianHomeValue: 210000,
  },
  {
    city: "Memphis",
    state: "Tennessee",
    stateAbbr: "TN",
    slug: "memphis",
    stateSlug: "tennessee",
    zipPrefix: "38103",
    laborCostMultiplier: 0.9,
    typicalHomeAge: "Mid-century homes mixed with older central neighborhoods",
    climateNotes: "Hot humid summers, mild winters, and heavy rain events.",
    regionalNotes:
      "Humidity and older plumbing raise moisture and mechanical risks during remodels.",
    nearestPermitOffice: "City of Memphis Division of Planning and Development",
    population: 633104,
    medianHomeValue: 175000,
  },
  {
    city: "Louisville",
    state: "Kentucky",
    stateAbbr: "KY",
    slug: "louisville",
    stateSlug: "kentucky",
    zipPrefix: "40202",
    laborCostMultiplier: 0.92,
    typicalHomeAge: "Victorian corridors and postwar suburban housing",
    climateNotes: "Humid subtropical climate with freeze-thaw winters.",
    regionalNotes: "Older homes and moderate labor create value if scope is fully itemized.",
    nearestPermitOffice: "Louisville Metro Department of Codes and Regulations",
    population: 633045,
    medianHomeValue: 230000,
  },
  {
    city: "Richmond",
    state: "Virginia",
    stateAbbr: "VA",
    slug: "richmond",
    stateSlug: "virginia",
    zipPrefix: "23219",
    laborCostMultiplier: 1.05,
    typicalHomeAge: "Historic urban homes and growing suburban stock",
    climateNotes: "Humid summers, mild winters, and occasional coastal storm effects.",
    regionalNotes:
      "Historic districts and permit rules can extend kitchen and bath renovation timelines.",
    nearestPermitOffice: "City of Richmond Department of Planning and Development Review",
    population: 226610,
    medianHomeValue: 320000,
  },
  {
    city: "Virginia Beach",
    state: "Virginia",
    stateAbbr: "VA",
    slug: "virginia-beach",
    stateSlug: "virginia",
    zipPrefix: "23451",
    laborCostMultiplier: 1.04,
    typicalHomeAge: "Coastal postwar homes and newer suburban builds",
    climateNotes: "Humid coastal climate with salt air, storms, and high moisture.",
    regionalNotes: "Coastal moisture and HOA rules often affect material and mechanical choices.",
    nearestPermitOffice: "City of Virginia Beach Planning and Community Development",
    population: 459470,
    medianHomeValue: 360000,
  },
  {
    city: "Salt Lake City",
    state: "Utah",
    stateAbbr: "UT",
    slug: "salt-lake-city",
    stateSlug: "utah",
    zipPrefix: "84101",
    laborCostMultiplier: 1.08,
    typicalHomeAge: "Early 20th-century bungalows and expanding valley suburbs",
    climateNotes: "Dry climate with hot summers, cold winters, and strong UV.",
    regionalNotes: "Growth keeps contractor schedules tight across popular remodel seasons.",
    nearestPermitOffice: "Salt Lake City Building Services",
    population: 209593,
    medianHomeValue: 520000,
  },
  {
    city: "Albuquerque",
    state: "New Mexico",
    stateAbbr: "NM",
    slug: "albuquerque",
    stateSlug: "new-mexico",
    zipPrefix: "87102",
    laborCostMultiplier: 0.95,
    typicalHomeAge: "Adobe-influenced and postwar Southwestern housing",
    climateNotes: "High desert climate with intense sun, low humidity, and monsoon bursts.",
    regionalNotes: "Sun and monsoon moisture swings influence ventilation and finish durability.",
    nearestPermitOffice: "City of Albuquerque Planning Department",
    population: 564559,
    medianHomeValue: 310000,
  },
  {
    city: "Sacramento",
    state: "California",
    stateAbbr: "CA",
    slug: "sacramento",
    stateSlug: "california",
    zipPrefix: "95814",
    laborCostMultiplier: 1.2,
    typicalHomeAge: "Mid-century homes and fast-growing suburban corridors",
    climateNotes: "Hot dry summers, mild winters, and strong solar exposure.",
    regionalNotes:
      "Above-average California labor and permitting raise the cost of vague kitchen scopes.",
    nearestPermitOffice: "City of Sacramento Community Development Department",
    population: 524943,
    medianHomeValue: 480000,
  },
  {
    city: "Fresno",
    state: "California",
    stateAbbr: "CA",
    slug: "fresno",
    stateSlug: "california",
    zipPrefix: "93721",
    laborCostMultiplier: 1.1,
    typicalHomeAge: "Postwar housing with newer suburban expansion",
    climateNotes: "Hot Central Valley summers, mild winters, and intense UV.",
    regionalNotes:
      "Heat-aware materials and electrical capacity matter for kitchen appliance upgrades.",
    nearestPermitOffice: "City of Fresno Planning and Development",
    population: 542107,
    medianHomeValue: 370000,
  },
  {
    city: "Providence",
    state: "Rhode Island",
    stateAbbr: "RI",
    slug: "providence",
    stateSlug: "rhode-island",
    zipPrefix: "02903",
    laborCostMultiplier: 1.18,
    typicalHomeAge: "Dense historic housing and triple-decker stock",
    climateNotes: "Cold winters, humid summers, and coastal storm exposure.",
    regionalNotes: "Tight footprints and older mechanicals make kitchen layout changes expensive.",
    nearestPermitOffice: "City of Providence Department of Inspections and Standards",
    population: 190934,
    medianHomeValue: 340000,
  },
  {
    city: "Hartford",
    state: "Connecticut",
    stateAbbr: "CT",
    slug: "hartford",
    stateSlug: "connecticut",
    zipPrefix: "06103",
    laborCostMultiplier: 1.2,
    typicalHomeAge: "Older urban housing with surrounding suburban ranches",
    climateNotes: "Cold winters, humid summers, and freeze-thaw cycles.",
    regionalNotes: "Above-average Northeast labor rewards clear itemization on remodel bids.",
    nearestPermitOffice: "City of Hartford Department of Development Services",
    population: 121054,
    medianHomeValue: 230000,
  },
  {
    city: "New Orleans",
    state: "Louisiana",
    stateAbbr: "LA",
    slug: "new-orleans",
    stateSlug: "louisiana",
    zipPrefix: "70112",
    laborCostMultiplier: 1.0,
    typicalHomeAge: "Historic cottages and elevated homes with aging systems",
    climateNotes: "Hot humid subtropical climate with heavy rain and storm risk.",
    regionalNotes: "Moisture, elevations, and older plumbing heavily influence remodel scope.",
    nearestPermitOffice: "City of New Orleans Department of Safety and Permits",
    population: 383997,
    medianHomeValue: 295000,
  },
  {
    city: "Birmingham",
    state: "Alabama",
    stateAbbr: "AL",
    slug: "birmingham",
    stateSlug: "alabama",
    zipPrefix: "35203",
    laborCostMultiplier: 0.88,
    typicalHomeAge: "Mid-century homes and older urban neighborhoods",
    climateNotes: "Hot humid summers, mild winters, and heavy rainfall.",
    regionalNotes:
      "Lower labor costs still require careful moisture and electrical scope on older homes.",
    nearestPermitOffice: "City of Birmingham Department of Planning, Engineering and Permits",
    population: 200733,
    medianHomeValue: 165000,
  },
  {
    city: "Omaha",
    state: "Nebraska",
    stateAbbr: "NE",
    slug: "omaha",
    stateSlug: "nebraska",
    zipPrefix: "68102",
    laborCostMultiplier: 0.95,
    typicalHomeAge: "Postwar ranches and growing suburban developments",
    climateNotes: "Hot summers, cold winters, and severe storm seasons.",
    regionalNotes: "Competitive Midwest pricing with seasonal demand spikes for remodel crews.",
    nearestPermitOffice: "City of Omaha Planning Department",
    population: 486051,
    medianHomeValue: 275000,
  },
  {
    city: "Boise",
    state: "Idaho",
    stateAbbr: "ID",
    slug: "boise",
    stateSlug: "idaho",
    zipPrefix: "83702",
    laborCostMultiplier: 1.1,
    typicalHomeAge: "Older central neighborhoods and fast-growing suburbs",
    climateNotes: "Semi-arid climate with hot summers, cold winters, and strong sun.",
    regionalNotes: "Rapid growth keeps contractor demand high and schedules tight.",
    nearestPermitOffice: "City of Boise Planning and Development Services",
    population: 235684,
    medianHomeValue: 470000,
  },
  {
    city: "Buffalo",
    state: "New York",
    stateAbbr: "NY",
    slug: "buffalo",
    stateSlug: "new-york",
    zipPrefix: "14202",
    laborCostMultiplier: 1.05,
    typicalHomeAge: "Early 20th-century housing and dense urban stock",
    climateNotes: "Lake-effect snow, freeze-thaw cycles, and humid summers.",
    regionalNotes:
      "Older mechanical systems and cold-climate detailing often expand remodel scope.",
    nearestPermitOffice: "City of Buffalo Department of Permit and Inspection Services",
    population: 278349,
    medianHomeValue: 195000,
  },
  {
    city: "Rochester",
    state: "New York",
    stateAbbr: "NY",
    slug: "rochester",
    stateSlug: "new-york",
    zipPrefix: "14604",
    laborCostMultiplier: 1.04,
    typicalHomeAge: "Prewar homes and postwar suburban corridors",
    climateNotes: "Cold snowy winters, freeze-thaw cycles, and humid summers.",
    regionalNotes:
      "Older housing stock makes electrical and plumbing updates common in kitchen jobs.",
    nearestPermitOffice: "City of Rochester Bureau of Buildings and Zoning",
    population: 211328,
    medianHomeValue: 175000,
  },
];

const added = [];
for (const c of NEW_CITIES) {
  if (existing.has(c.slug)) continue;
  const label = laborLabel(c.laborCostMultiplier);
  cities.push({
    ...c,
    introParagraphs: {
      "kitchen-remodel": `A kitchen remodel in ${c.city}, ${c.state} is priced by cabinets, appliances, layout changes, and local labor (${label}). Many homes here are ${c.typicalHomeAge.toLowerCase()}, which can mean electrical or plumbing updates mid-project. ${c.regionalNotes} Use CostReno to set a realistic ${c.city} budget before collecting bids.`,
      "roof-replacement": `Homeowners planning a roof replacement in ${c.city}, ${c.state} face pricing shaped by local labor (${label}), housing stock (${c.typicalHomeAge.toLowerCase()}), and climate (${c.climateNotes.toLowerCase()}). ${c.regionalNotes} CostReno helps you estimate a fair range for ${c.city} before you compare contractor quotes.`,
    },
  });
  added.push(c.slug);
}

fs.writeFileSync(citiesPath, JSON.stringify(cities, null, 2) + "\n");

function climateShort(notes) {
  const first = notes.split(/[.!?]/)[0]?.trim();
  return first ? first.toLowerCase() : "local climate conditions";
}

function buildKitchenEnrichment(c) {
  const label = laborLabel(c.laborCostMultiplier);
  const climate = climateShort(c.climateNotes);
  return {
    intro: `Kitchen remodel costs in ${c.city}, ${c.state} are shaped by cabinet and countertop choices, whether the layout stays put, and local labor that runs ${label}. Housing stock (${c.typicalHomeAge.toLowerCase()}) often means electrical, plumbing, or ventilation updates once demolition starts. Climate context (${climate}) also affects finish durability and mechanical load. ${c.regionalNotes} CostReno helps ${c.city} homeowners set a realistic kitchen budget and review contractor quotes with metro-level pricing context before they hire.`,
    localFactors: [
      `Local labor in ${c.city} runs ${label}, so vague allowances get expensive quickly`,
      `Common housing stock: ${c.typicalHomeAge.toLowerCase()}`,
      `Climate factor: ${climate}`,
      `Permit starting point: ${c.nearestPermitOffice}`,
    ],
  };
}

let enrichSrc = fs.readFileSync(enrichPath, "utf8");
const missingKitchen = cities.filter((c) => !enrichSrc.includes(`"${c.slug}:kitchen-remodel"`));
const blocks = missingKitchen
  .map((c) => {
    const e = buildKitchenEnrichment(c);
    const factors = e.localFactors.map((f) => `      ${JSON.stringify(f)},`).join("\n");
    return `  "${c.slug}:kitchen-remodel": {\n    lastReviewed: "2026-07-27",\n    intro:\n      ${JSON.stringify(e.intro)},\n    localFactors: [\n${factors}\n    ],\n  },`;
  })
  .join("\n");

if (blocks) {
  const marker = "\n};\n\nexport function getCityEnrichment";
  if (!enrichSrc.includes(marker)) throw new Error("could not find CITY_ENRICHMENTS close");
  enrichSrc = enrichSrc.replace(
    marker,
    `\n\n  // ── Expanded kitchen pages (${missingKitchen.length}) ─────────────────────────\n${blocks}\n};\n\nexport function getCityEnrichment`,
  );
  fs.writeFileSync(enrichPath, enrichSrc);
}

console.log(
  JSON.stringify(
    {
      totalCities: cities.length,
      addedCities: added.length,
      kitchenEnrichmentsAdded: missingKitchen.length,
      kitchenIndexableTarget: cities.length,
    },
    null,
    2,
  ),
);
