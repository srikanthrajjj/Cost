import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { DetectedFeatures } from "./types";
import { getAiApiKey, getAiChatCompletionsUrl } from "@/lib/ai-config";

const FEATURES_PROMPT = `Analyze the following kitchen photos and extract every visible detail into structured JSON. Be thorough — list all features you can identify.

You MUST respond with ONLY valid JSON (no markdown, no code blocks). Omit any field where you cannot determine the value from the photos.

{
  "kitchenLayout": "<L-Shape|U-Shape|Galley|Island|Straight|Open|Other>",
  "island": { "present": true/false, "seating": true/false, "sink": true/false, "electrical": true/false },
  "cabinetDetails": { "style": "<Shaker|Slab|RaisedPanel|Inset|GlassFront|Louvered|BeadedInset|Other>", "finish": "<Painted|Stained|Laminate|Thermofoil|NaturalWood|Glazed|Distressed|TwoTone>", "fullHeight": true/false, "crownMolding": true/false, "lightRail": true/false, "toeKick": true/false, "glassFronts": true/false, "openShelving": true/false, "hardwareStyle": "<Modern|Traditional|Transitional|T-bar|CupPull|Knobs>", "hardwareFinish": "<BrushedNickel|Chrome|MatteBlack|Bronze|Brass|Gold>" },
  "countertopDetails": { "material": "<Quartz|Granite|Marble|Laminate|SolidSurface|Concrete|ButcherBlock|StainlessSteel|Tile>", "color": "<White|Gray|Black|Beige|Brown|Blue|Green|Multi>", "pattern": "<Solid|Speckled|Veined|Concrete|Terrazzo|None>", "edgeProfile": "<Eased|Bullnose|Beveled|Ogee|Waterfall|Mitered|Cove|Chamfer>", "thickness": "<1cm|2cm|3cm|Other>", "waterfallEdge": true/false, "seams": "<Visible|Minimal|None|Unknown>" },
  "backsplash": { "material": "<Tile|Stone|Glass|Metal|SolidSurface|None>", "pattern": "<Subway|Herringbone|Mosaic|Stacked|FullSlab|Hexagon|Brick|Chevron|Other>", "fullHeight": true/false, "color": "<White|Gray|Beige|Blue|Green|Black|Multi>" },
  "sink": { "type": "<Undermount|DropIn|Farmhouse|ApronFront|Integrated|Trough>", "mount": "<Single|Double|ThreeHole|Wall>", "material": "<StainlessSteel|Composite|Fireclay|Copper|Stone>", "finish": "<Satin|Polished|Matte|Textured>", "farmhouse": true/false, "basinCount": "<Single|Double|Prep>" },
  "faucet": { "type": "<PullDown|PullOut|SideSpray|Bridge|PotFiller|Touchless|Commercial>", "mount": "<Deck|Wall|Undermount>", "handleCount": "<Single|Double|Touchless>", "finish": "<StainlessSteel|Chrome|MatteBlack|Bronze|Brass|Gold|Nickel>" },
  "appliances": { "refrigerator": { "type": "<BuiltIn|Freestanding|PanelReady|FrenchDoor|SideBySide>", "finish": "<StainlessSteel|MatteBlack|PanelReady|White|Slate|BlackStainless>" }, "range": { "type": "<Freestanding|SlideIn|DualFuel>", "fuel": "<Gas|Electric|Induction|DualFuel>", "burnerCount": <number>, "finish": "<StainlessSteel|MatteBlack|White|Slate>" }, "hood": { "type": "<UnderCabinet|WallMounted|Downdraft|Island>", "finish": "<StainlessSteel|MatteBlack|PanelReady|White>" }, "dishwasher": { "type": "<BuiltIn|PanelReady>", "finish": "<StainlessSteel|PanelReady|White|Black>" }, "microwave": "<BuiltIn|OverTheRange|Countertop|Drawer>", "wineFridge": true/false, "warmingDrawer": true/false },
  "lighting": { "pendantCount": <number>, "recessed": true/false, "underCabinet": true/false, "insideCabinet": true/false, "chandelier": true/false, "trackLighting": true/false, "naturalLight": "<Excellent|Good|Limited|Poor>", "naturalLightSource": "<Window|Skylight|SlidingDoor|None>" },
  "windows": { "count": <number>, "size": "<Large|Small|Mixed|None>", "style": "<Casement|DoubleHung|Sliding|Bay|Awning|None>", "treatment": "<None|Blinds|Curtains|Shades|PlantationShutters>" },
  "flooring": { "material": "<Tile|Hardwood|Vinyl|Laminate|Concrete|Stone|Cork|Bamboo>", "pattern": "<Plank|Tile|Herringbone|Patterned|None>", "color": "<Light|Medium|Dark|White|Gray|Brown|Beige>" },
  "walls": { "finish": "<Painted|Tile|Wallpaper|Wainscoting|Beadboard|Stone|Brick>", "color": "<White|Gray|Beige|Blue|Green|Neutral|Accent>" },
  "ceiling": { "type": "<Flat|Tray|Vaulted|Coffered|Beamed|Popcorn|None>", "height": "<Standard|High|Cathedral|Vaulted>" },
  "premiumFeatures": ["<walkInPantry>", "<coffeeBar>", "<wineFridge>", "<warmingDrawer>", "<potFiller>", "<butlersPantry>", "<mudroom>", "<deskArea>", "<hiddenTrash>", "<builtInBench>", "<breakfastNook>", "<wetBar>", "<iceMaker>", "<steamOven>", "<speedOven>", "<touchFaucet>", "<builtInSpeakers>", "<heatedFloor>" ],
  "qualityIndicator": "<Builder|Mid|Premium|Luxury>",
  "overallStyle": "<Modern|Traditional|Transitional|Farmhouse|Industrial|Contemporary|Rustic|Minimalist|Eclectic>",
  "generalCondition": "<Excellent|Good|Fair|Poor>",
  "visibleWear": ["<scratchedCountertops>", "<wornCabinets>", "<damagedFlooring>", "<outdatedAppliances>", "<stainedBacksplash>", "<waterDamage>", "<peelingPaint>"]
}

Populate "premiumFeatures" and "visibleWear" with applicable items from the lists (omit both if none found). For "qualityIndicator" use:
- Builder: Basic materials, stock cabinets, laminate counters, minimal trim
- Mid: Semi-custom cabinets, granite/quartz, tile backsplash, standard appliances
- Premium: Custom cabinets, quartz/marble, designer backsplash, high-end appliances, custom hood
- Luxury: Full custom, waterfall island, premium stone, panel-ready appliances, smart features

Respond with ONLY the JSON object, nothing else.`;

const VISION_MODEL = "openai/gpt-4o";
const TIMEOUT_MS = 30000;

export type ExtractFeaturesResult =
  { success: true; data: DetectedFeatures } | { success: false; error: string };

export const extractKitchenFeatures = createServerFn({ method: "POST" })
  .validator(z.object({ photos: z.array(z.string().min(1)).min(1).max(6) }))
  .handler(async ({ data }): Promise<ExtractFeaturesResult> => {
    const apiKey = getAiApiKey();

    if (!apiKey) {
      return { success: false, error: "API key not available" };
    }

    const content: Array<
      { type: "text"; text: string } | { type: "image_url"; image_url: { url: string } }
    > = [
      { type: "text", text: FEATURES_PROMPT },
      ...data.photos.map((photo) => ({
        type: "image_url" as const,
        image_url: {
          url: photo.startsWith("data:") ? photo : `data:image/jpeg;base64,${photo}`,
        },
      })),
    ];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(getAiChatCompletionsUrl(), {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://costreno.com",
          "X-Title": "CostReno Kitchen Feature Extraction",
        },
        body: JSON.stringify({
          model: VISION_MODEL,
          messages: [{ role: "user", content }],
          temperature: 0.2,
          max_tokens: 3000,
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        if (response.status === 401) {
          return { success: false, error: "Auth error" };
        }
        return {
          success: false,
          error: `API error: ${response.status} ${errorBody.substring(0, 200)}`,
        };
      }

      const responseData = await response.json().catch(() => null);

      if (!responseData?.choices?.length) {
        return { success: false, error: "No response from AI" };
      }

      const messageContent = responseData.choices[0]?.message?.content;

      if (typeof messageContent !== "string" || !messageContent.trim()) {
        return { success: false, error: "Empty response" };
      }

      const cleaned = messageContent
        .replace(/^```(?:json)?\s*\n?/i, "")
        .replace(/\n?```\s*$/i, "")
        .trim();

      const parsed = JSON.parse(cleaned);
      const features = Array.isArray(parsed) ? parsed[0] : parsed;

      if (!features || typeof features !== "object") {
        return { success: false, error: "Invalid response structure" };
      }

      return { success: true, data: features as DetectedFeatures };
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === "AbortError") {
        return { success: false, error: "Request timed out" };
      }

      return { success: false, error: "Feature extraction failed" };
    }
  });
