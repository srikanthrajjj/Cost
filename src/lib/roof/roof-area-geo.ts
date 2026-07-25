import type { MapLatLng } from "@/lib/estimate/osm-roof";

const SQ_METERS_TO_SQ_FEET = 10.7639;
const EARTH_RADIUS_M = 6378137;

export function footprintSqMetersFromRing(ring: MapLatLng[]): number {
  if (ring.length < 3) return 0;
  const lat0 = (ring.reduce((sum, p) => sum + p.lat, 0) / ring.length) * (Math.PI / 180);
  const pts = ring.map((p) => ({
    x: p.lng * (Math.PI / 180) * Math.cos(lat0) * EARTH_RADIUS_M,
    y: p.lat * (Math.PI / 180) * EARTH_RADIUS_M,
  }));

  let area = 0;
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length;
    area += pts[i].x * pts[j].y - pts[j].x * pts[i].y;
  }
  return Math.abs(area) / 2;
}

export function footprintSqFtFromRing(ring: MapLatLng[]): number {
  return Math.round(footprintSqMetersFromRing(ring) * SQ_METERS_TO_SQ_FEET);
}

export function footprintSqFtFromRings(rings: MapLatLng[][]): number {
  const totalSqM = rings.reduce((sum, ring) => sum + footprintSqMetersFromRing(ring), 0);
  return Math.round(totalSqM * SQ_METERS_TO_SQ_FEET);
}
