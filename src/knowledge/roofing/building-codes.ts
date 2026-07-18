import type { BuildingCode } from "@/types/knowledge";

export const roofingBuildingCodes: BuildingCode[] = [
  {
    code: "Maximum layers",
    requirement:
      "Most codes limit roofing to 2 layers. A third layer requires full tear-down down to deck. Some jurisdictions limit to 1 layer only.",
    inspection: true,
  },
  {
    code: "Ice and water shield",
    requirement:
      "Required at eaves (first 24–36 inches from edge), valleys, around penetrations, and in climates prone to ice dams. Required by IRC R905.2.2.",
    inspection: true,
  },
  {
    code: "Roof pitch minimums",
    requirement:
      "Asphalt shingles: minimum 2:12 (with special underlayment) or 4:12 (standard). Low-slope roofs (< 2:12) require built-up or modified bitumen roofing.",
    inspection: true,
  },
  {
    code: "Ventilation requirements",
    requirement:
      "Minimum net free ventilation area of 1:150 of attic floor area (or 1:300 with vapor barrier). Must include both intake (soffit) and exhaust (ridge/gable) vents.",
    inspection: true,
  },
  {
    code: "Flashing requirements",
    requirement:
      "Metal flashing required at all wall intersections, valleys, penetrations, and edges. Minimum 0.0015-inch copper, 0.016-inch aluminum, or G90 galvanized steel.",
    inspection: true,
  },
  {
    code: "Wind resistance ratings",
    requirement:
      "Most jurisdictions require minimum ASTM D7158 Class 2 (110 mph) or Class 3 (130 mph) wind-rated shingles, especially in coastal/high-wind zones.",
    inspection: true,
  },
  {
    code: "Fire ratings",
    requirement:
      "Class A fire rating required in wildfire-prone areas (WUI zones). Metal, tile, slate, and treated wood shakes qualify. Standard asphalt may not.",
    inspection: true,
  },
  {
    code: "Structural load capacity",
    requirement:
      "Roof must support dead load (materials) + live load (snow, workers). Minimum dead load 10 psf, live load 20 psf per IRC. Tile/slate may require structural reinforcement.",
    inspection: true,
  },
  {
    code: "Drip edge",
    requirement:
      "Required at eaves and rakes per IRC R905. Required to direct water into gutters and protect fascia. Must extend into gutter or 1 inch beyond fascia.",
    inspection: true,
  },
  {
    code: "Starter strip",
    requirement:
      "Required at eaves and rakes to seal the first row of shingles and prevent wind uplift and water infiltration. Required by most manufacturer warranties.",
    inspection: true,
  },
];
