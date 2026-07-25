/**
 * Roof measurement from OpenStreetMap data (no API key).
 *
 * Flow:
 * 1. Nominatim geocodes the street address to lat/lng (or uses coords from autocomplete).
 * 2. Overpass fetches nearby building=* footprints.
 * 3. We pick the best matching polygon near the point and compute its plan-view area.
 *
 * OSM building polygons are ground footprints (plan view), not pitched roof surface.
 * We multiply by a pitch factor from ROOF_PITCH_FACTORS (default medium ~1.25) to
 * approximate roof surface area. This is an estimate from map data, not a survey.
 *
 * We never invent measurements. Geocode failure or no usable building polygon
 * returns a clear failure so the wizard can keep manual / heuristic sizing.
 *
 * Nominatim usage policy: identify CostReno via User-Agent, reasonable timeout,
 * single lookups only (no bulk scraping). Autocomplete is server-proxied to avoid
 * browser CORS issues; clients should debounce (~350–400ms) and keep traffic light.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { resolveRoofPitchFactor } from "@/lib/estimator-engine";
import { footprintSqFtFromRings } from "@/lib/roof/roof-area-geo";

const SQ_METERS_TO_SQ_FEET = 10.7639;
const EARTH_RADIUS_M = 6378137;
const REQUEST_TIMEOUT_MS = 12000;
const BUILDING_SEARCH_RADIUS_M = 75;
const MIN_ROOF_SQ_FT = 200;
const MAX_ROOF_SQ_FT = 20000;
const AUTOCOMPLETE_LIMIT = 6;

const NOMINATIM_USER_AGENT = "CostReno/1.0 (https://costreno.com; roof-estimate@costreno.com)";

function getNominatimUrl(): string {
  const override = typeof process !== "undefined" ? process.env?.NOMINATIM_URL?.trim() : undefined;
  return override || "https://nominatim.openstreetmap.org";
}

function getOverpassUrls(): string[] {
  const override = typeof process !== "undefined" ? process.env?.OVERPASS_URL?.trim() : undefined;
  const defaults = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
  ];
  return override ? [override, ...defaults.filter((url) => url !== override)] : defaults;
}

export type MapLatLng = { lat: number; lng: number };

export type RoofMeasurementResult =
  | {
      success: true;
      roofSqFt: number;
      /** Plan-view building footprint before pitch uplift. */
      footprintSqFt: number;
      formattedAddress: string;
      pitchFactor: number;
      lat: number;
      lng: number;
      /** OSM building outline rings (plan view), for map preview. */
      footprintRings: MapLatLng[][];
    }
  | {
      success: false;
      reason: "not_found" | "rate_limited" | "error";
      message: string;
    };

export type AddressSuggestion = {
  displayName: string;
  /** Compact label for the suggestion dropdown. */
  label: string;
  lat: number;
  lng: number;
};

export type AddressSearchResult =
  | { success: true; suggestions: AddressSuggestion[] }
  | { success: false; reason: "rate_limited" | "error"; message: string };

export type BuildingClickResult =
  | {
      success: true;
      footprintRings: MapLatLng[][];
      footprintSqFt: number;
    }
  | { success: false; reason: "not_found" | "rate_limited" | "error"; message: string };

interface NominatimResult {
  lat?: string;
  lon?: string;
  display_name?: string;
  address?: {
    house_number?: string;
    road?: string;
    pedestrian?: string;
    residential?: string;
    suburb?: string;
    neighbourhood?: string;
    city?: string;
    town?: string;
    village?: string;
    hamlet?: string;
    state?: string;
    postcode?: string;
  };
}

interface OverpassElement {
  type?: string;
  id?: number;
  lat?: number;
  lon?: number;
  geometry?: Array<{ lat: number; lon: number }>;
  members?: Array<{
    type?: string;
    role?: string;
    geometry?: Array<{ lat: number; lon: number }>;
  }>;
  tags?: Record<string, string>;
}

interface LatLon {
  lat: number;
  lon: number;
}

const locationFieldsSchema = z.object({
  zipCode: z.string().max(12).optional(),
  city: z.string().max(80).optional(),
  state: z.string().max(40).optional(),
});

async function fetchWithTimeout(url: string, init: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/** Append city / state / ZIP when the typed string does not already include them. */
export function buildGeocodeQuery(
  address: string,
  location?: { city?: string; state?: string; zipCode?: string },
): string {
  const trimmed = address.trim();
  if (!trimmed) return "";

  const lower = trimmed.toLowerCase();
  const parts: string[] = [trimmed];

  const city = location?.city?.trim();
  const state = location?.state?.trim();
  const zip = location?.zipCode?.trim();

  if (city && !lower.includes(city.toLowerCase())) parts.push(city);
  if (state && !lower.includes(state.toLowerCase())) parts.push(state);
  if (zip && !lower.includes(zip)) parts.push(zip);

  return parts.join(", ");
}

function looksLikeHouseNumberOnly(address: string): boolean {
  return /^\d{1,6}[a-zA-Z]?$/.test(address.trim());
}

function suggestionLabel(result: NominatimResult): string {
  const a = result.address;
  if (!a) return result.display_name?.trim() || "Address";

  const street = [a.house_number, a.road || a.pedestrian || a.residential]
    .filter(Boolean)
    .join(" ");
  const place = a.city || a.town || a.village || a.hamlet || a.suburb || a.neighbourhood;
  const bits = [street || undefined, place, a.state, a.postcode].filter(Boolean);
  if (bits.length > 0) return bits.join(", ");
  return result.display_name?.trim() || "Address";
}

async function nominatimSearch(query: string, limit: number): Promise<NominatimResult[]> {
  const params = new URLSearchParams({
    q: query,
    format: "json",
    limit: String(limit),
    countrycodes: "us",
    addressdetails: "1",
  });
  const url = `${getNominatimUrl()}/search?${params.toString()}`;

  const response = await fetchWithTimeout(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": NOMINATIM_USER_AGENT,
    },
  });

  if (response.status === 429) {
    const err = new Error("RATE_LIMITED");
    err.name = "RateLimitedError";
    throw err;
  }
  if (!response.ok) return [];

  const results = (await response.json().catch(() => null)) as NominatimResult[] | null;
  return Array.isArray(results) ? results : [];
}

async function geocodeAddress(
  address: string,
): Promise<{ lat: number; lng: number; formattedAddress: string } | null> {
  const results = await nominatimSearch(address, 1);
  const first = results[0];
  const lat = first?.lat != null ? Number(first.lat) : NaN;
  const lng = first?.lon != null ? Number(first.lon) : NaN;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  return {
    lat,
    lng,
    formattedAddress: first?.display_name?.trim() || address,
  };
}

async function fetchNearbyBuildings(lat: number, lng: number): Promise<OverpassElement[]> {
  const query = `
[out:json][timeout:25];
(
  way["building"](around:${BUILDING_SEARCH_RADIUS_M},${lat},${lng});
  relation["building"](around:${BUILDING_SEARCH_RADIUS_M},${lat},${lng});
);
out geom;
`.trim();

  let lastRateLimited = false;

  for (const overpassUrl of getOverpassUrls()) {
    try {
      const response = await fetchWithTimeout(overpassUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          Accept: "application/json",
          "User-Agent": NOMINATIM_USER_AGENT,
        },
        body: `data=${encodeURIComponent(query)}`,
      });

      if (response.status === 429 || response.status === 504) {
        lastRateLimited = true;
        continue;
      }
      if (!response.ok) continue;

      const text = await response.text();
      const data = JSON.parse(text) as { elements?: OverpassElement[] };
      if (Array.isArray(data?.elements) && data.elements.length > 0) {
        return data.elements;
      }
    } catch (error) {
      console.warn("[osm-roof] Overpass request failed:", overpassUrl, error);
    }
  }

  if (lastRateLimited) {
    const err = new Error("RATE_LIMITED");
    err.name = "RateLimitedError";
    throw err;
  }

  return [];
}

function closeRing(ring: LatLon[]): LatLon[] {
  if (ring.length < 3) return ring;
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first.lat === last.lat && first.lon === last.lon) return ring;
  return [...ring, first];
}

function ringsFromElement(element: OverpassElement): LatLon[][] {
  if (element.type === "way" && Array.isArray(element.geometry) && element.geometry.length >= 3) {
    return [closeRing(element.geometry.map((p) => ({ lat: p.lat, lon: p.lon })))];
  }

  if (element.type === "relation" && Array.isArray(element.members)) {
    const outers = element.members.filter(
      (m) => m.role === "outer" && Array.isArray(m.geometry) && m.geometry.length >= 3,
    );
    return outers.map((m) =>
      closeRing((m.geometry ?? []).map((p) => ({ lat: p.lat, lon: p.lon }))),
    );
  }

  return [];
}

/** Plan-view area in square meters via equirectangular projection + shoelace. */
function polygonAreaSqMeters(ring: LatLon[]): number {
  if (ring.length < 4) return 0;
  const lat0 = (ring.reduce((sum, p) => sum + p.lat, 0) / ring.length) * (Math.PI / 180);
  const pts = ring.map((p) => ({
    x: p.lon * (Math.PI / 180) * Math.cos(lat0) * EARTH_RADIUS_M,
    y: p.lat * (Math.PI / 180) * EARTH_RADIUS_M,
  }));

  let area = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    area += pts[i].x * pts[i + 1].y - pts[i + 1].x * pts[i].y;
  }
  return Math.abs(area) / 2;
}

function ringCentroid(ring: LatLon[]): LatLon {
  const n =
    ring.length > 1 &&
    ring[0].lat === ring[ring.length - 1].lat &&
    ring[0].lon === ring[ring.length - 1].lon
      ? ring.length - 1
      : ring.length;
  let lat = 0;
  let lon = 0;
  for (let i = 0; i < n; i++) {
    lat += ring[i].lat;
    lon += ring[i].lon;
  }
  return { lat: lat / n, lon: lon / n };
}

function haversineMeters(a: LatLon, b: LatLon): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Ray-casting point-in-polygon on lon/lat (adequate for small building footprints). */
function pointInRing(point: LatLon, ring: LatLon[]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i].lon;
    const yi = ring[i].lat;
    const xj = ring[j].lon;
    const yj = ring[j].lat;
    const intersects =
      yi > point.lat !== yj > point.lat &&
      point.lon < ((xj - xi) * (point.lat - yi)) / (yj - yi + Number.EPSILON) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

interface CandidateBuilding {
  footprintSqMeters: number;
  distanceM: number;
  containsPoint: boolean;
  rings: LatLon[][];
}

function latLonRingsToMap(rings: LatLon[][]): MapLatLng[][] {
  return rings.map((ring) => ring.map((p) => ({ lat: p.lat, lng: p.lon })));
}

function selectBestBuilding(elements: OverpassElement[], point: LatLon): CandidateBuilding | null {
  const candidates: CandidateBuilding[] = [];

  for (const element of elements) {
    const rings = ringsFromElement(element);
    if (rings.length === 0) continue;

    let footprintSqMeters = 0;
    let containsPoint = false;
    let bestDistance = Infinity;

    for (const ring of rings) {
      const area = polygonAreaSqMeters(ring);
      if (area <= 0) continue;
      footprintSqMeters += area;
      if (pointInRing(point, ring)) containsPoint = true;
      const centroid = ringCentroid(ring);
      bestDistance = Math.min(bestDistance, haversineMeters(point, centroid));
    }

    if (footprintSqMeters <= 0) continue;
    candidates.push({
      footprintSqMeters,
      distanceM: Number.isFinite(bestDistance) ? bestDistance : BUILDING_SEARCH_RADIUS_M,
      containsPoint,
      rings,
    });
  }

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => {
    if (a.containsPoint !== b.containsPoint) return a.containsPoint ? -1 : 1;
    return a.distanceM - b.distanceM;
  });

  return candidates[0];
}

function notFoundMessage(address: string): string {
  if (looksLikeHouseNumberOnly(address)) {
    return "Enter a full street address (for example, 123 Main St), not just a house number. Measure uses OpenStreetMap and needs the street name.";
  }
  return "We could not find that street address on OpenStreetMap. Check the spelling, pick a suggestion, or enter the roof size manually.";
}

/** Debounced address autocomplete (Nominatim via server to avoid CORS). */
export const searchAddressesForMap = createServerFn({ method: "POST" })
  .validator(
    z
      .object({
        query: z.string().min(3).max(200),
      })
      .merge(locationFieldsSchema),
  )
  .handler(async ({ data }): Promise<AddressSearchResult> => {
    const query = buildGeocodeQuery(data.query, {
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
    });

    try {
      const results = await nominatimSearch(query, AUTOCOMPLETE_LIMIT);
      const suggestions: AddressSuggestion[] = [];
      const seen = new Set<string>();

      for (const result of results) {
        const lat = result.lat != null ? Number(result.lat) : NaN;
        const lng = result.lon != null ? Number(result.lon) : NaN;
        const displayName = result.display_name?.trim();
        if (!Number.isFinite(lat) || !Number.isFinite(lng) || !displayName) continue;
        if (seen.has(displayName)) continue;
        seen.add(displayName);
        suggestions.push({
          displayName,
          label: suggestionLabel(result),
          lat,
          lng,
        });
      }

      return { success: true, suggestions };
    } catch (error) {
      if (error instanceof Error && error.name === "RateLimitedError") {
        return {
          success: false,
          reason: "rate_limited",
          message: "Address suggestions are busy right now. Wait a moment and try again.",
        };
      }
      console.error("[osm-roof] address search failed:", error);
      return {
        success: false,
        reason: "error",
        message:
          "Address suggestions failed. You can still type a street address and click Measure.",
      };
    }
  });

export const measureRoofFromMap = createServerFn({ method: "POST" })
  .validator(
    z
      .object({
        address: z.string().min(4).max(200),
        /** Used to uplift plan-view footprint to roof surface. Defaults to medium. */
        roofPitch: z.enum(["low", "medium", "steep"]).optional(),
        /** When set (from autocomplete pick), skip a second Nominatim geocode. */
        lat: z.number().min(-90).max(90).optional(),
        lng: z.number().min(-180).max(180).optional(),
      })
      .merge(locationFieldsSchema),
  )
  .handler(async ({ data }): Promise<RoofMeasurementResult> => {
    const streetInput = data.address.trim();
    const fullAddress = buildGeocodeQuery(streetInput, {
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
    });

    const pitchFactor = resolveRoofPitchFactor(data.roofPitch);
    const hasCoords =
      typeof data.lat === "number" &&
      typeof data.lng === "number" &&
      Number.isFinite(data.lat) &&
      Number.isFinite(data.lng);

    try {
      const geo = hasCoords
        ? {
            lat: data.lat as number,
            lng: data.lng as number,
            formattedAddress: streetInput,
          }
        : await geocodeAddress(fullAddress);

      if (!geo) {
        return {
          success: false,
          reason: "not_found",
          message: notFoundMessage(streetInput),
        };
      }

      const elements = await fetchNearbyBuildings(geo.lat, geo.lng);
      const building = selectBestBuilding(elements, { lat: geo.lat, lon: geo.lng });
      if (!building) {
        return {
          success: false,
          reason: "not_found",
          message:
            "No building outline found near that address in OpenStreetMap. Please enter the size manually.",
        };
      }

      const footprintSqFt = Math.round(building.footprintSqMeters * SQ_METERS_TO_SQ_FEET);
      const roofSqFt = Math.round(footprintSqFt * pitchFactor);

      if (roofSqFt < MIN_ROOF_SQ_FT || roofSqFt > MAX_ROOF_SQ_FT) {
        return {
          success: false,
          reason: "not_found",
          message:
            "We could not measure this roof reliably from map data. Please enter the size manually.",
        };
      }

      return {
        success: true,
        roofSqFt,
        footprintSqFt,
        formattedAddress: geo.formattedAddress,
        pitchFactor,
        lat: geo.lat,
        lng: geo.lng,
        footprintRings: latLonRingsToMap(building.rings),
      };
    } catch (error) {
      if (error instanceof Error && error.name === "RateLimitedError") {
        return {
          success: false,
          reason: "rate_limited",
          message:
            "Map lookup is busy right now. Wait a moment and try again, or enter the size manually.",
        };
      }
      console.error("[osm-roof] measurement failed:", error);
      return {
        success: false,
        reason: "error",
        message: "Map lookup failed. Please enter the size manually.",
      };
    }
  });

/** Detect OSM building footprint at a map click point (satellite tap-to-select). */
export const detectBuildingAtPoint = createServerFn({ method: "POST" })
  .validator(
    z.object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    }),
  )
  .handler(async ({ data }): Promise<BuildingClickResult> => {
    try {
      const elements = await fetchNearbyBuildings(data.lat, data.lng);
      const building = selectBestBuilding(elements, { lat: data.lat, lon: data.lng });
      if (!building) {
        return {
          success: false,
          reason: "not_found",
          message: "No building outline found here. Try another spot or draw manually.",
        };
      }

      const footprintRings = latLonRingsToMap(building.rings);
      const footprintSqFt = footprintSqFtFromRings(footprintRings);
      if (footprintSqFt < MIN_ROOF_SQ_FT || footprintSqFt > MAX_ROOF_SQ_FT) {
        return {
          success: false,
          reason: "not_found",
          message: "Building outline here looks unreliable. Draw the roof shape manually.",
        };
      }

      return { success: true, footprintRings, footprintSqFt };
    } catch (error) {
      if (error instanceof Error && error.name === "RateLimitedError") {
        return {
          success: false,
          reason: "rate_limited",
          message: "Map lookup is busy. Wait a moment and try again.",
        };
      }
      console.error("[osm-roof] building click detect failed:", error);
      return {
        success: false,
        reason: "error",
        message: "Could not detect a building at that spot.",
      };
    }
  });
