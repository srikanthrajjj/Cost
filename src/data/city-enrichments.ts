/**
 * Hand-enriched city copy for Phase 3 SEO depth.
 * Key format: "{citySlug}:{categoryId}"
 */
export interface CityEnrichment {
  intro: string;
  localFactors: string[];
  lastReviewed: string;
}

export const CITY_CONTENT_LAST_REVIEWED = "2026-07-22";

export const CITY_ENRICHMENTS: Record<string, CityEnrichment> = {
  // ── Top 15 roof pages ──────────────────────────────────────────────────────
  "new-york:roof-replacement": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Roof replacement in New York City is shaped by dense housing, limited staging space, and strict building rules. Brownstones and older multifamily roofs often need careful tear-off logistics, sidewalk protection, and coordination with co-op or condo boards. Labor runs well above the national baseline, so quotes that look 'cheap' against national averages can still be incomplete for NYC conditions. CostReno helps you sanity-check scope and pricing before you sign.",
    localFactors: [
      "High labor and logistics costs for urban access, parking, and debris removal",
      "Older roof decks and parapets that can expand scope after tear-off",
      "Strong wind and freeze-thaw exposure on coastal and high-rise-adjacent roofs",
      "Permit and inspection timelines that can stretch project schedules",
    ],
  },
  "los-angeles:roof-replacement": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "In Los Angeles, roof replacement pricing reflects wildfire risk zones, intense sun, and a mix of flat and low-slope roofs across hillside and postwar homes. Material choice often leans toward Class A assemblies, reflective coatings, or tile systems that handle heat and ember exposure. Permitting complexity and high labor rates mean incomplete scopes show up quickly as change orders. Use CostReno to review what is included before comparing bids.",
    localFactors: [
      "Heat and UV accelerate asphalt aging across many LA neighborhoods",
      "Wildfire-adjacent areas may need higher fire-rated assemblies",
      "Hillside access can raise labor and safety costs",
      "Title 24 and local energy rules can influence underlayment and ventilation choices",
    ],
  },
  "chicago:roof-replacement": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Chicago roofing projects have to handle snow load, ice damming risk, and freeze-thaw cycles that punish weak flashing details. Brick bungalows and vintage housing often hide decking repairs once shingles come off. Labor sits above national averages, and winter weather windows can compress schedules. CostReno helps Chicago homeowners compare quotes against local climate and scope expectations.",
    localFactors: [
      "Ice and water shield at eaves and valleys is especially important",
      "Snow load and ice dams drive ventilation and insulation conversations",
      "Older bungalow and flat-roof details can add tear-off surprises",
      "Seasonal contractor demand spikes in spring and fall",
    ],
  },
  "houston:roof-replacement": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Houston roof replacements are influenced by humidity, heavy rain, and tropical storm exposure. Underlayment quality, drip edge, and attic ventilation matter as much as shingle brand. Many homes also need attention to decking after prior storm repairs. Local labor is nearer the national average, but incomplete moisture details create expensive follow-up work. CostReno helps you spot missing storm-ready scope before you hire.",
    localFactors: [
      "High moisture and storm exposure raise underlayment and flashing importance",
      "Hail and wind events make impact and wind ratings a common quote topic",
      "Prior storm patches can hide decking damage until tear-off",
      "Flood and drainage context can affect fascia and gutter work tied to the roof",
    ],
  },
  "phoenix:roof-replacement": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Phoenix roofs face extreme heat, intense UV, and monsoon bursts that stress tile and asphalt systems differently. Tile is common, and underlayment condition often drives replacement timing more than the tile itself. Attic ventilation and reflective options affect comfort and HVAC load after a roof project. CostReno helps Phoenix homeowners evaluate whether a quote matches desert climate needs.",
    localFactors: [
      "Extreme heat and UV shorten asphalt life without strong ventilation",
      "Tile roof jobs often hinge on underlayment and battens, not just tile",
      "Monsoon wind and debris can expose weak edge details",
      "Cooling load impact makes attic airflow part of the roof conversation",
    ],
  },
  "philadelphia:roof-replacement": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Philadelphia roofing work often involves rowhomes, shared walls, and older masonry details that complicate flashing and drainage. Freeze-thaw cycles and humid summers reward careful valley and chimney work. Labor sits somewhat above national norms, and incomplete scopes on older homes show up as decking or flashing extras. CostReno helps you check whether a Philly quote covers the details that matter on attached housing.",
    localFactors: [
      "Rowhome party walls and shared roofs need clear responsibility language",
      "Chimney, parapet, and flat-to-slope transitions are common weak points",
      "Older decking and multiple layers can expand tear-off costs",
      "Freeze-thaw and moisture demand solid ice protection and flashing",
    ],
  },
  "san-antonio:roof-replacement": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "San Antonio roof replacements deal with intense sun, hot summers, and hail risk that push many homeowners toward impact-resistant shingles. Labor tends to run a bit below larger Texas metros, which can improve value if scope is complete. Older central neighborhoods and expanding suburbs create different attic and decking conditions. CostReno helps you compare San Antonio quotes with local climate context in mind.",
    localFactors: [
      "Hail and heat make impact ratings and UV durability relevant",
      "Slightly lower local labor can still hide incomplete scope",
      "Older homes may need decking or ventilation upgrades mid-project",
      "Permit and HOA rules vary across city and suburban jurisdictions",
    ],
  },
  "san-diego:roof-replacement": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "San Diego roofing costs reflect coastal salt air, strong sun, and above-average labor rates. Tile and asphalt both appear across coastal and inland neighborhoods, with corrosion and underlayment aging common on older coastal homes. Energy rules and high home values keep renovation budgets elevated. CostReno helps San Diego homeowners review whether quotes include the coastal durability details that matter.",
    localFactors: [
      "Salt air can accelerate fastener and flashing corrosion near the coast",
      "High labor rates make incomplete line items expensive later",
      "Tile systems often need underlayment evaluation, not just surface tiles",
      "Mild climate still brings strong UV and occasional wind-driven rain",
    ],
  },
  "dallas:roof-replacement": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Dallas-area roofing is heavily influenced by hail and severe thunderstorm seasons. Impact-resistant shingles and thorough inspection language show up often in competitive quotes. Labor is near national averages, but metro competition creates wide price spreads between thin and complete scopes. CostReno helps you separate a low bid from a missing-scope bid in Dallas.",
    localFactors: [
      "Hail history makes impact resistance a frequent material decision",
      "Wide contractor competition can produce outlier low bids",
      "Insurance-related replacements need clear like-kind and code-upgrade language",
      "Postwar ranch roofs may hide multiple layers or soft decking",
    ],
  },
  "san-jose:roof-replacement": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "San Jose roof replacements sit in a high-cost Bay Area labor market with mild but wet winters and strong summer sun. Postwar suburban stock and ADU-driven renovations mean many homes get roof work alongside other upgrades. Incomplete ventilation or underlayment details are easy to miss in busy bids. CostReno helps San Jose homeowners check quotes against local cost pressure and climate needs.",
    localFactors: [
      "Bay Area labor scarcity keeps installed prices elevated",
      "Wet winters reward quality underlayment and flashing",
      "ADU and remodel projects often coordinate roof and attic work",
      "Energy and ventilation choices affect long-term comfort costs",
    ],
  },
  "austin:roof-replacement": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Austin roofs take heavy UV, summer heat above 100°F, and occasional Central Texas hail. Impact-resistant asphalt and strong attic ventilation are common recommendations. Fast growth keeps crews busy, so schedules and change-order risk rise when scope is vague. CostReno helps Austin homeowners estimate a fair range and review what each quote actually includes.",
    localFactors: [
      "Extreme summer heat accelerates shingle aging without good ventilation",
      "Hail events increase demand for impact-rated products",
      "Growth-driven contractor backlog can stretch start dates",
      "Mix of new suburbs and older central homes changes decking expectations",
    ],
  },
  "jacksonville:roof-replacement": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Jacksonville roofing sits in a humid, hurricane-exposed Florida market where wind ratings, underlayment, and fastening patterns matter. Labor can run below South Florida pricing, but storm codes still shape acceptable assemblies. Moisture and prior repairs often expand tear-off discoveries. CostReno helps Jacksonville homeowners check that quotes match coastal storm expectations.",
    localFactors: [
      "Hurricane and wind codes influence fastening and underlayment choices",
      "Humidity and moisture raise mold and ventilation concerns",
      "Labor may be lower than South Florida while code requirements stay strict",
      "Prior storm repairs can hide inconsistent decking or patches",
    ],
  },
  "san-francisco:roof-replacement": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "San Francisco roof work combines some of the highest labor costs in the U.S. with cool marine weather, fog moisture, and seismic considerations on older housing. Compact lots and historic details raise logistics and flashing complexity. Thin quotes rarely survive first contact with inspection reality. CostReno helps SF homeowners pressure-test scope completeness before comparing prices.",
    localFactors: [
      "Very high labor and permitting costs amplify incomplete scopes",
      "Fog and moisture demand durable underlayment and ventilation details",
      "Seismic and historic-home constraints can limit material options",
      "Tight urban access increases staging and disposal costs",
    ],
  },
  "columbus:roof-replacement": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Columbus roofing projects face Midwest freeze-thaw cycles, snow, and humid summers at labor rates near or slightly below national averages. Mid-century suburbs and revitalizing urban homes create different decking and ventilation conditions. Fair quotes usually spell out ice protection, tear-off layers, and ventilation clearly. CostReno helps Columbus homeowners compare those details across bids.",
    localFactors: [
      "Freeze-thaw and snow load make ice protection and ventilation important",
      "Moderate labor rates improve value when scope is complete",
      "Older suburbs may need decking repairs after tear-off",
      "Spring storm seasons can tighten contractor calendars",
    ],
  },
  "seattle:roof-replacement": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Seattle roofs live with long wet seasons, moss pressure, and high labor costs. Underlayment quality, ventilation, and detailing at valleys and chimneys matter more than shingle brand alone. Energy code expectations and older housing stock often expand project scope. CostReno helps Seattle homeowners review whether a quote accounts for Pacific Northwest moisture realities.",
    localFactors: [
      "Persistent rain and moss make underlayment and maintenance critical",
      "High labor and code requirements elevate total project cost",
      "Older homes frequently need ventilation and insulation upgrades",
      "Weather windows can delay installs through wet months",
    ],
  },

  // ── Top 10 kitchen pages ───────────────────────────────────────────────────
  "new-york:kitchen-remodel": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Kitchen remodels in New York City are constrained by compact footprints, aging plumbing and electrical systems, and building rules that slow layout changes. Cabinetry and labor dominate cost, and co-op or condo approvals can extend timelines. A clear scope for electrical, ventilation, and waterproofing prevents mid-project surprises. CostReno helps NYC homeowners set a realistic budget before collecting bids.",
    localFactors: [
      "Tight footprints raise custom cabinet and layout complexity",
      "Older electrical and plumbing systems often need upgrades",
      "Building approvals can add time beyond construction duration",
      "High labor rates make vague allowances expensive",
    ],
  },
  "los-angeles:kitchen-remodel": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Los Angeles kitchen remodels vary widely between cosmetic refreshes and full gut renovations in hillside or older bungalow homes. Labor and permitting are costly, so moving walls or relocating plumbing should be decided early. Material choices for counters and cabinets swing budgets quickly. CostReno helps LA homeowners separate must-have scope from optional upgrades before hiring.",
    localFactors: [
      "Permit complexity rises with structural or plumbing moves",
      "High labor makes design changes after demolition costly",
      "Older bungalows may hide electrical capacity limits",
      "Material upgrades (cabinets, stone) drive most budget variance",
    ],
  },
  "chicago:kitchen-remodel": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Chicago kitchen projects often update vintage homes where wiring, plumbing, and ventilation need modernization. Winter schedules and older floor plans can constrain layouts. Labor is above national averages, so incomplete allowances for electrical or plaster repair add up fast. CostReno helps Chicago homeowners plan a clearer kitchen budget and review contractor quotes with local context.",
    localFactors: [
      "Vintage housing frequently needs electrical and plumbing updates",
      "Above-average labor increases the cost of vague line items",
      "Ventilation and range-hood ducting can be tricky in older homes",
      "Seasonal timing affects contractor availability",
    ],
  },
  "houston:kitchen-remodel": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Houston kitchen remodels balance humid-climate durability with a wide range of home ages, from mid-century stock to new builds. Labor is nearer national averages, but moisture, ventilation, and appliance electrical capacity still drive change orders. Clear cabinet, countertop, and rough-in specs keep bids comparable. CostReno helps Houston homeowners set a realistic remodel range before negotiating.",
    localFactors: [
      "Humidity makes ventilation and moisture detailing important",
      "Broad housing mix means very different starting conditions",
      "Near-average labor still rewards itemized material specs",
      "Flood and drainage history can affect ground-level remodel decisions",
    ],
  },
  "phoenix:kitchen-remodel": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Phoenix kitchen remodels often focus on heat-aware material choices, cooling load, and updates to 1980s–2000s suburban layouts. Labor runs above national averages, and tile or stone selections move totals quickly. Electrical capacity for modern appliances is a frequent mid-project discovery. CostReno helps Phoenix homeowners estimate a fair kitchen budget and compare bids with clearer scope.",
    localFactors: [
      "Above-average labor elevates cabinet and install costs",
      "Suburban stock often needs electrical upgrades for modern appliances",
      "Heat and sun exposure influence finish durability near windows",
      "Open-plan updates can trigger HVAC and lighting scope changes",
    ],
  },
  "dallas:kitchen-remodel": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Dallas kitchen renovations range from cosmetic refreshes in postwar ranches to full gut jobs in growing suburbs. Metro competition creates wide quote spreads, so comparing line items matters more than the bottom line alone. Labor is near national averages, but unclear cabinet or electrical allowances still cause overruns. CostReno helps Dallas homeowners align budget expectations before signing.",
    localFactors: [
      "Competitive bidding can hide missing rough-in or finish details",
      "Ranch layouts may need structural work for open concepts",
      "Near-average labor still requires itemized cabinet packages",
      "Permit needs rise when plumbing or electrical moves",
    ],
  },
  "san-francisco:kitchen-remodel": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "San Francisco kitchen remodels are among the most expensive in the country because of labor, logistics, and older housing constraints. Soft-story, electrical, and historic details can expand scope beyond finishes. Compact kitchens demand careful cabinet planning. CostReno helps SF homeowners pressure-test budgets and quote completeness before committing.",
    localFactors: [
      "Very high labor and permitting costs dominate budgets",
      "Older buildings often need electrical panel or gas-line updates",
      "Compact footprints increase custom cabinet costs",
      "Building rules can limit layout or appliance changes",
    ],
  },
  "seattle:kitchen-remodel": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Seattle kitchen projects combine high labor rates with craftsman and mid-century homes that often need electrical and ventilation updates. Wet-climate durability and energy expectations influence finish and appliance choices. Incomplete scopes around plumbing relocates are a common overrun source. CostReno helps Seattle homeowners set clearer remodel budgets before hiring.",
    localFactors: [
      "High labor rates make design changes after demo expensive",
      "Older homes frequently need electrical and ventilation upgrades",
      "Energy and moisture goals influence appliance and fan selections",
      "Permit timelines can extend projects beyond construction days",
    ],
  },
  "austin:kitchen-remodel": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Austin kitchen remodels sit in a fast-growth market where contractor schedules run tight and labor is near national averages. Newer suburbs and older central homes create different electrical and layout starting points. Cabinet packages and layout changes drive most cost variance. CostReno helps Austin homeowners estimate a realistic range and compare quotes before work begins.",
    localFactors: [
      "Growth-driven demand can lengthen contractor lead times",
      "Central older homes may need electrical or plumbing upgrades",
      "Cabinet and countertop selections dominate budget swings",
      "Clear allowances prevent apples-to-oranges bid comparisons",
    ],
  },
  "denver:kitchen-remodel": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Denver kitchen remodels face above-average labor costs, altitude and climate swings, and a mix of brick bungalows plus newer infill. Dry climate finishes still need good ventilation, and older homes often hide electrical limits. Incomplete rough-in details are a frequent source of change orders. CostReno helps Denver homeowners plan a clearer kitchen budget and review bids carefully.",
    localFactors: [
      "Above-average labor raises installed cabinet and finish costs",
      "Bungalow and infill stock create very different layout constraints",
      "Electrical capacity upgrades are common mid-remodel discoveries",
      "Seasonal demand can affect start dates and crew availability",
    ],
  },

  // ── Top 10 bathroom pages ──────────────────────────────────────────────────
  "new-york:bathroom-remodel": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Bathroom remodels in New York City are shaped by compact footprints, aging plumbing stacks, and building rules that slow layout changes. Waterproofing and ventilation matter as much as finishes, and co-op or condo approvals can extend timelines. Vague tile or fixture allowances create expensive change orders. CostReno helps NYC homeowners set a realistic bath budget before comparing bids.",
    localFactors: [
      "Compact baths raise custom vanity and tile complexity",
      "Older plumbing stacks often expand rough-in scope",
      "Building approvals can add time beyond construction days",
      "High labor rates punish incomplete waterproofing details",
    ],
  },
  "los-angeles:bathroom-remodel": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Los Angeles bathroom projects range from cosmetic refreshes to full guts in hillside and mid-century homes. Labor and permitting are costly, so moving fixtures should be decided early. Moisture detailing and exhaust performance matter in coastal and inland climates. CostReno helps LA homeowners separate must-have scope from optional upgrades before hiring.",
    localFactors: [
      "Permit complexity rises with plumbing or structural moves",
      "High labor makes design changes after demo expensive",
      "Older homes may need electrical upgrades for heated floors or fans",
      "Tile and waterproofing quality drive long-term leak risk",
    ],
  },
  "chicago:bathroom-remodel": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Chicago bathroom remodels often update vintage homes where cast-iron drains, plaster walls, and weak ventilation need modernization. Winter schedules and older layouts constrain options. Labor runs above national averages, so incomplete tile or waterproofing allowances add up fast. CostReno helps Chicago homeowners plan a clearer bath budget and review quotes carefully.",
    localFactors: [
      "Vintage plumbing and plaster frequently expand demo scope",
      "Above-average labor increases the cost of vague line items",
      "Ventilation upgrades are common in older Chicago baths",
      "Seasonal timing affects contractor availability",
    ],
  },
  "houston:bathroom-remodel": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Houston bathroom remodels must account for humidity, moisture control, and a wide mix of home ages. Labor is nearer national averages, but poor waterproofing or weak exhaust fans create costly callbacks. Clear specs for tile, shower systems, and rough-ins keep bids comparable. CostReno helps Houston homeowners estimate a fair range before negotiating.",
    localFactors: [
      "Humidity makes waterproofing and ventilation critical",
      "Broad housing mix means different starting plumbing conditions",
      "Near-average labor still rewards itemized finish packages",
      "Ground-level moisture history can affect subfloor decisions",
    ],
  },
  "phoenix:bathroom-remodel": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Phoenix bathroom renovations often update 1980s to 2000s suburban layouts with heat-aware materials and better ventilation. Labor runs above national averages, and tile or stone selections move totals quickly. Plumbing relocates and niche details are common overrun sources. CostReno helps Phoenix homeowners estimate a fair bath budget and compare bids with clearer scope.",
    localFactors: [
      "Above-average labor elevates tile and install costs",
      "Suburban stock often needs updated exhaust and lighting",
      "Hard-water regions increase finish and fixture maintenance needs",
      "Clear shower-system specs prevent apples-to-oranges quotes",
    ],
  },
  "dallas:bathroom-remodel": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Dallas bathroom projects range from cosmetic refreshes in postwar ranches to full guts in growing suburbs. Metro competition creates wide quote spreads, so comparing waterproofing and fixture packages matters more than the bottom line alone. Labor is near national averages, but unclear allowances still cause overruns. CostReno helps Dallas homeowners align budget expectations before signing.",
    localFactors: [
      "Competitive bidding can hide missing waterproofing details",
      "Ranch layouts may need plumbing moves for modern baths",
      "Near-average labor still requires itemized tile packages",
      "Permit needs rise when plumbing or electrical changes",
    ],
  },
  "san-francisco:bathroom-remodel": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "San Francisco bathroom remodels are expensive because of labor, logistics, and older building constraints. Compact footprints demand careful fixture planning, and plumbing stack access can expand scope. Incomplete waterproofing details are a frequent failure point. CostReno helps SF homeowners pressure-test bath budgets and quote completeness before committing.",
    localFactors: [
      "Very high labor and permitting costs dominate budgets",
      "Older buildings often need plumbing access or venting updates",
      "Compact footprints increase custom vanity and tile costs",
      "Building rules can limit layout or fixture changes",
    ],
  },
  "seattle:bathroom-remodel": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Seattle bathroom projects combine high labor rates with craftsman and mid-century homes that often need better ventilation and moisture control. Wet-climate durability influences tile and membrane choices. Incomplete scopes around shower pans are a common overrun source. CostReno helps Seattle homeowners set clearer remodel budgets before hiring.",
    localFactors: [
      "High labor rates make design changes after demo expensive",
      "Moisture-prone climate raises waterproofing standards",
      "Older homes frequently need fan and duct upgrades",
      "Permit timelines can extend projects beyond construction days",
    ],
  },
  "austin:bathroom-remodel": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Austin bathroom remodels sit in a fast-growth market where contractor schedules run tight and labor is near national averages. Newer suburbs and older central homes create different plumbing starting points. Tile packages and layout changes drive most cost variance. CostReno helps Austin homeowners estimate a realistic range and compare quotes before work begins.",
    localFactors: [
      "Growth-driven demand can lengthen contractor lead times",
      "Central older homes may need plumbing or electrical upgrades",
      "Tile and shower-system selections dominate budget swings",
      "Clear allowances prevent incomplete bid comparisons",
    ],
  },
  "miami:bathroom-remodel": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Miami bathroom remodels must handle humidity, coastal moisture, and a mix of condo and single-family rules. Waterproofing, ventilation, and corrosion-resistant hardware matter more than finish brand alone. Labor and association approvals can stretch schedules. CostReno helps Miami homeowners plan a clearer bath budget before comparing contractor quotes.",
    localFactors: [
      "High humidity makes waterproofing and exhaust performance critical",
      "Condo rules can limit layout changes and work hours",
      "Coastal moisture influences finish and hardware durability",
      "Permit and association approvals can extend timelines",
    ],
  },

  // ── Top 10 HVAC pages ──────────────────────────────────────────────────────
  "new-york:hvac-installation": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "HVAC replacement in New York City is constrained by building access, older duct or radiator systems, and strict installation rules. Equipment sizing, electrical capacity, and condensate routing often expand scope beyond a simple swap. High labor rates make incomplete bids costly. CostReno helps NYC homeowners estimate a realistic HVAC range before comparing installers.",
    localFactors: [
      "Building access and logistics raise install costs",
      "Older systems may need electrical or duct upgrades",
      "Co-op or condo rules can limit equipment placement",
      "High labor rates punish vague line items",
    ],
  },
  "los-angeles:hvac-installation": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Los Angeles HVAC projects must handle cooling-dominant loads, hillside access, and a mix of ducted and ductless homes. Permitting and high labor rates mean incomplete duct or electrical scopes show up as change orders. Right-sizing matters in both coastal and inland microclimates. CostReno helps LA homeowners review whether a quote covers equipment, ducts, and permits.",
    localFactors: [
      "Cooling load and microclimates affect equipment sizing",
      "Hillside and multi-story access can raise labor",
      "Duct repairs are a common mid-install discovery",
      "Permit and inspection timelines vary by jurisdiction",
    ],
  },
  "chicago:hvac-installation": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Chicago HVAC replacements need strong heating performance, reliable cooling, and attention to older ductwork in vintage homes. Labor runs above national averages, and winter timing can constrain installs. Incomplete scopes around electrical upgrades or flue changes create overruns. CostReno helps Chicago homeowners set a clearer HVAC budget before hiring.",
    localFactors: [
      "Cold winters demand properly sized heating capacity",
      "Older duct systems often need sealing or redesign",
      "Above-average labor elevates change-order costs",
      "Seasonal demand affects start dates and pricing",
    ],
  },
  "houston:hvac-installation": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Houston HVAC installs are driven by long cooling seasons, humidity control, and a wide mix of home ages. Labor is near national averages, but undersized equipment or weak ducts show up quickly in comfort complaints. Clear tonnage, SEER, and duct scopes keep bids comparable. CostReno helps Houston homeowners estimate a fair HVAC range before booking installs.",
    localFactors: [
      "High humidity makes dehumidification and duct sealing important",
      "Long cooling seasons favor efficient equipment choices",
      "Broad housing mix means different duct starting conditions",
      "Permit and inspection steps should be listed in the bid",
    ],
  },
  "phoenix:hvac-installation": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Phoenix HVAC replacements face extreme heat, high runtime hours, and above-average labor. Equipment sizing, attic duct condition, and electrical capacity are frequent overrun sources. Incomplete warranty or condenser pad details create bid gaps. CostReno helps Phoenix homeowners compare HVAC quotes with clearer local context.",
    localFactors: [
      "Extreme heat requires careful load calculation and equipment sizing",
      "Attic ducts often need repair or insulation upgrades",
      "Above-average labor elevates install totals",
      "Electrical panel capacity can limit equipment choices",
    ],
  },
  "dallas:hvac-installation": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Dallas HVAC projects balance hot summers, storm-related replacement demand, and competitive metro bidding. Labor is near national averages, but quote spreads are wide when ductwork and electrical scopes differ. Clear equipment model numbers and warranty terms matter. CostReno helps Dallas homeowners sanity-check HVAC pricing before signing.",
    localFactors: [
      "Competitive bidding can hide missing duct or electrical work",
      "Hot summers and storm seasons drive replacement demand",
      "Near-average labor still requires itemized equipment packages",
      "Permit and disposal fees should appear in writing",
    ],
  },
  "miami:hvac-installation": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Miami HVAC installs must handle heat, humidity, coastal corrosion, and condo or HOA constraints. Equipment placement, condensate routing, and corrosion-resistant components affect long-term reliability. Labor and association rules can stretch schedules. CostReno helps Miami homeowners estimate a realistic HVAC budget before comparing bids.",
    localFactors: [
      "Humidity and salt air influence equipment and coil durability",
      "Condo rules can limit outdoor unit placement and work hours",
      "Condensate and drainage details are critical in multi-story buildings",
      "Permit and association approvals can extend timelines",
    ],
  },
  "seattle:hvac-installation": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Seattle HVAC projects emphasize heating performance, moisture control, and high labor costs. Heat pumps are common, but older homes may need electrical or duct upgrades. Incomplete scopes around ventilation or condensate create change orders. CostReno helps Seattle homeowners plan a clearer HVAC budget before hiring.",
    localFactors: [
      "High labor rates elevate install and change-order costs",
      "Older homes often need electrical panel or duct updates",
      "Wet climate makes condensate and ventilation detailing important",
      "Energy expectations influence equipment selection",
    ],
  },
  "austin:hvac-installation": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Austin HVAC replacements sit in a fast-growth market with hot summers and tight contractor schedules. Labor is near national averages, but incomplete duct or electrical scopes still cause overruns. Clear tonnage and efficiency specs keep bids comparable. CostReno helps Austin homeowners estimate a fair HVAC range before booking work.",
    localFactors: [
      "Growth-driven demand can lengthen lead times",
      "Hot summers require careful equipment sizing",
      "Duct condition varies widely between older and newer homes",
      "Itemized electrical and permit fees prevent bid gaps",
    ],
  },
  "minneapolis:hvac-installation": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Minneapolis HVAC replacements must handle harsh winters, strong heating loads, and older housing stock. Labor and cold-weather install constraints can raise costs. Incomplete flue, combustion-air, or electrical details are common overrun sources. CostReno helps Minneapolis homeowners review HVAC quotes with clearer cold-climate context.",
    localFactors: [
      "Cold winters demand properly sized heating capacity",
      "Older homes may need flue, combustion-air, or electrical upgrades",
      "Seasonal timing affects install windows and pricing",
      "Duct sealing improves comfort in leaky vintage homes",
    ],
  },

  // ── Top 12 window pages ────────────────────────────────────────────────────
  "new-york:window-replacement": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Window replacement in New York City is shaped by building rules, older openings, and high labor costs. Co-op or condo approvals, lead paint considerations, and custom sizes can expand scope beyond a simple swap. Energy performance and sound control matter in dense neighborhoods. CostReno helps NYC homeowners estimate a realistic window budget before comparing installers.",
    localFactors: [
      "Building approvals can slow projects and limit product choices",
      "Older openings often need custom sizing or frame repairs",
      "High labor rates elevate install and trim costs",
      "Noise and energy goals influence glass package selection",
    ],
  },
  "los-angeles:window-replacement": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Los Angeles window projects balance solar heat gain, coastal vs inland climates, and high labor rates. Retrofit vs full-frame installs change both cost and performance. Incomplete scopes around trim, disposal, or structural repairs create bid gaps. CostReno helps LA homeowners compare window quotes with clearer local context.",
    localFactors: [
      "Sun exposure and cooling load influence Low-E glass choices",
      "High labor makes full-frame installs more expensive",
      "Hillside and multi-story access can raise staging costs",
      "Permit needs rise when openings change size",
    ],
  },
  "chicago:window-replacement": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Chicago window replacements must handle cold winters, wind, and older masonry or wood openings. Labor runs above national averages, and poor air sealing shows up quickly in comfort and energy bills. Clear specs for glass package, trim, and disposal keep bids comparable. CostReno helps Chicago homeowners plan a clearer window budget before hiring.",
    localFactors: [
      "Cold winters reward better U-factor and air sealing",
      "Older openings frequently need frame or sill repairs",
      "Above-average labor elevates install totals",
      "Lead paint and historic details can expand scope",
    ],
  },
  "houston:window-replacement": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Houston window replacements focus on heat, humidity, and storm resilience. Labor is near national averages, but impact ratings and moisture detailing can change the package. Incomplete trim or disposal scopes create quote gaps. CostReno helps Houston homeowners estimate a fair window range before comparing installers.",
    localFactors: [
      "Heat and humidity influence glass and frame durability",
      "Storm exposure can justify impact-rated products",
      "Near-average labor still requires itemized install scopes",
      "Moisture around openings can trigger sill repairs",
    ],
  },
  "phoenix:window-replacement": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Phoenix window projects are driven by intense sun, cooling load, and above-average labor. Low-E glass and proper shading details matter as much as frame brand. Incomplete scopes around stucco repairs or disposal create overruns. CostReno helps Phoenix homeowners compare window bids with clearer desert-climate context.",
    localFactors: [
      "High UV and heat make Low-E glass packages common",
      "Above-average labor elevates install costs",
      "Stucco and exterior finish repairs can expand scope",
      "Clear window counts and sizes prevent bid mismatches",
    ],
  },
  "dallas:window-replacement": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Dallas window replacements sit in a competitive metro market with hot summers and storm exposure. Labor is near national averages, but quote spreads widen when glass packages and trim scopes differ. Clear brand, series, and disposal details matter. CostReno helps Dallas homeowners sanity-check window pricing before signing.",
    localFactors: [
      "Competitive bidding can hide missing trim or disposal work",
      "Heat and storm exposure influence glass package choices",
      "Near-average labor still rewards itemized product specs",
      "Custom sizes raise cost versus standard openings",
    ],
  },
  "san-francisco:window-replacement": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "San Francisco window replacements are expensive because of labor, logistics, and older housing constraints. Historic details, fog exposure, and building rules can limit product choices. Incomplete scopes around frame repairs create change orders. CostReno helps SF homeowners pressure-test window budgets before committing.",
    localFactors: [
      "Very high labor and access costs dominate budgets",
      "Older and historic openings often need custom work",
      "Coastal fog and wind influence performance requirements",
      "Building rules can limit style or material choices",
    ],
  },
  "seattle:window-replacement": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Seattle window projects combine high labor rates with wet-climate durability needs and older craftsman openings. Condensation control and air sealing matter as much as U-factor. Incomplete trim or sill repair scopes are common overrun sources. CostReno helps Seattle homeowners set a clearer window budget before hiring.",
    localFactors: [
      "High labor rates elevate install and finish costs",
      "Wet climate makes flashing and sill detailing critical",
      "Older homes frequently need frame or trim repairs",
      "Energy expectations influence glass package selection",
    ],
  },
  "austin:window-replacement": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Austin window replacements sit in a fast-growth market with hot summers and tight installer schedules. Labor is near national averages, but incomplete glass or trim scopes still cause overruns. Clear window counts and series specs keep bids comparable. CostReno helps Austin homeowners estimate a fair window range before booking work.",
    localFactors: [
      "Growth-driven demand can lengthen lead times",
      "Heat load influences Low-E and SHGC choices",
      "Older central homes may need custom sizes",
      "Itemized disposal and trim prevent bid gaps",
    ],
  },
  "miami:window-replacement": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Miami window replacements often require impact ratings, humidity resilience, and condo or HOA approvals. Labor and association rules can stretch schedules. Incomplete scopes around installation methods or exterior finish repairs create expensive surprises. CostReno helps Miami homeowners plan a clearer window budget before comparing quotes.",
    localFactors: [
      "Impact and wind requirements can raise product cost",
      "Condo rules may limit styles, colors, and work hours",
      "Humidity and salt air influence frame and hardware durability",
      "Permit and association approvals can extend timelines",
    ],
  },
  "boston:window-replacement": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Boston window replacements must handle cold winters, older housing stock, and historic district constraints in some neighborhoods. Labor costs are elevated, and poor air sealing shows up in heating bills. Clear specs for glass, trim, and disposal keep bids comparable. CostReno helps Boston homeowners estimate a realistic window range before hiring.",
    localFactors: [
      "Cold winters reward better insulation and air sealing",
      "Older openings often need custom sizes or sill repairs",
      "Historic rules can limit exterior appearance changes",
      "Elevated labor increases the cost of incomplete scopes",
    ],
  },
  "minneapolis:window-replacement": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Minneapolis window projects are driven by harsh winters, energy performance, and older openings that may need repairs. Labor and cold-weather install windows can affect scheduling. Incomplete air-sealing scopes create comfort issues after install. CostReno helps Minneapolis homeowners compare window quotes with clearer cold-climate context.",
    localFactors: [
      "Extreme cold makes U-factor and air sealing critical",
      "Older homes frequently need frame or sill repairs",
      "Seasonal timing affects install windows and pricing",
      "Clear glass package specs prevent bid mismatches",
    ],
  },

  // ── Top 10 flooring pages ──────────────────────────────────────────────────
  "new-york:flooring": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Flooring projects in New York City are constrained by building rules, elevator and debris logistics, and older subfloors. Material choice matters, but prep and disposal often drive overruns. High labor rates make vague square-footage allowances expensive. CostReno helps NYC homeowners estimate a realistic flooring budget before comparing installers.",
    localFactors: [
      "Building access and debris removal raise project cost",
      "Older subfloors often need leveling or moisture mitigation",
      "High labor rates punish incomplete prep scopes",
      "Condo rules can limit work hours and material choices",
    ],
  },
  "los-angeles:flooring": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Los Angeles flooring installs range from LVP refreshes to hardwood and tile upgrades across varied housing stock. Labor is costly, so prep and removal details should be itemized early. Moisture and slab conditions vary between coastal and inland homes. CostReno helps LA homeowners compare flooring quotes with clearer scope.",
    localFactors: [
      "High labor elevates install and prep costs",
      "Slab moisture testing can expand project scope",
      "Removal of existing floors is a common bid gap",
      "Material grade and underlayment specs should match across quotes",
    ],
  },
  "chicago:flooring": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Chicago flooring projects often update vintage homes where subfloors, transitions, and radiators complicate installs. Labor runs above national averages, and winter humidity swings affect wood products. Incomplete prep scopes are a frequent overrun source. CostReno helps Chicago homeowners plan a clearer flooring budget before hiring.",
    localFactors: [
      "Vintage subfloors and transitions often need prep work",
      "Above-average labor increases the cost of vague allowances",
      "Seasonal humidity affects hardwood acclimation and timing",
      "Radiator and stair details can raise install complexity",
    ],
  },
  "houston:flooring": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Houston flooring installs must account for humidity, slab moisture, and a wide mix of home ages. Labor is near national averages, but moisture mitigation can change the final number. Clear material, prep, and removal specs keep bids comparable. CostReno helps Houston homeowners estimate a fair flooring range before negotiating.",
    localFactors: [
      "Humidity and slab moisture often require mitigation",
      "Broad housing mix means different subfloor starting points",
      "Near-average labor still rewards itemized prep scopes",
      "Flood history can affect ground-level material choices",
    ],
  },
  "phoenix:flooring": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Phoenix flooring projects face dry climate expansion and contraction, slab conditions, and above-average labor. Tile and LVP are common, while hardwood needs careful acclimation. Incomplete removal or leveling scopes create overruns. CostReno helps Phoenix homeowners compare flooring bids with clearer desert-market context.",
    localFactors: [
      "Above-average labor elevates install totals",
      "Slab prep and leveling are common cost drivers",
      "Dry climate affects wood product acclimation",
      "Clear square footage and waste factors prevent bid gaps",
    ],
  },
  "dallas:flooring": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Dallas flooring renovations sit in a competitive metro market where quote spreads are wide. Labor is near national averages, but prep and material grade differences create apples-to-oranges bids. Clear underlayment and removal details matter. CostReno helps Dallas homeowners sanity-check flooring pricing before signing.",
    localFactors: [
      "Competitive bidding can hide missing prep work",
      "Near-average labor still requires itemized material packages",
      "Subfloor condition varies across postwar and new homes",
      "Transitions and trim should be listed in writing",
    ],
  },
  "san-francisco:flooring": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "San Francisco flooring installs are expensive because of labor, logistics, and older subfloors in compact homes. Historic details and building rules can limit material choices. Incomplete leveling scopes create change orders. CostReno helps SF homeowners pressure-test flooring budgets before committing.",
    localFactors: [
      "Very high labor and access costs dominate budgets",
      "Older subfloors often need leveling or sistering",
      "Compact footprints increase transition complexity",
      "Building rules can limit work hours and disposal methods",
    ],
  },
  "seattle:flooring": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Seattle flooring projects combine high labor rates with moisture-aware material choices and older craftsman subfloors. Incomplete moisture mitigation or underlayment scopes are common overrun sources. Clear square footage and prep details keep bids comparable. CostReno helps Seattle homeowners set a clearer flooring budget before hiring.",
    localFactors: [
      "High labor rates elevate install and prep costs",
      "Wet climate makes moisture barriers important",
      "Older homes frequently need subfloor repairs",
      "Material acclimation and timing affect wood installs",
    ],
  },
  "austin:flooring": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Austin flooring installs sit in a fast-growth market with tight schedules and near-average labor. Newer suburbs and older central homes create different subfloor starting points. Material grade and prep drive most cost variance. CostReno helps Austin homeowners estimate a realistic flooring range and compare quotes before work begins.",
    localFactors: [
      "Growth-driven demand can lengthen contractor lead times",
      "Central older homes may need more subfloor prep",
      "Material selections dominate budget swings",
      "Clear removal and disposal scopes prevent bid gaps",
    ],
  },
  "miami:flooring": {
    lastReviewed: CITY_CONTENT_LAST_REVIEWED,
    intro:
      "Miami flooring projects must handle humidity, slab moisture, and condo or HOA constraints. Tile and waterproof LVP are common choices. Association rules and moisture mitigation can stretch schedules and budgets. CostReno helps Miami homeowners plan a clearer flooring budget before comparing installers.",
    localFactors: [
      "Humidity and slab moisture often require mitigation",
      "Condo rules can limit material choices and work hours",
      "Waterproof products are popular in wet-climate homes",
      "Permit and association approvals can extend timelines",
    ],
  },
};

export function getCityEnrichment(
  citySlug: string,
  categoryId: string,
): CityEnrichment | undefined {
  return CITY_ENRICHMENTS[`${citySlug}:${categoryId}`];
}
