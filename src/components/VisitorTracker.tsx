import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import { recordPageVisit } from "@/lib/analytics/record-page-visit";
import { isExcludedVisitGeo } from "@/lib/analytics/visit-geo";

const SESSION_KEY = "costreno_visitor_id";
const GEO_KEY = "costreno_visitor_geo";

type GeoInfo = {
  city?: string;
  region?: string;
  country?: string;
  countryCode?: string;
};

function getOrCreateSessionId(): string {
  try {
    const existing = localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `v_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return `v_${Date.now()}`;
  }
}

async function resolveGeo(): Promise<GeoInfo> {
  try {
    const cached = sessionStorage.getItem(GEO_KEY);
    if (cached) return JSON.parse(cached) as GeoInfo;
  } catch {
    // ignore
  }

  try {
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) return {};
    const data = await res.json();
    const geo: GeoInfo = {
      city: typeof data.city === "string" ? data.city : undefined,
      region: typeof data.region === "string" ? data.region : undefined,
      country: typeof data.country_name === "string" ? data.country_name : undefined,
      countryCode: typeof data.country_code === "string" ? data.country_code : undefined,
    };
    try {
      sessionStorage.setItem(GEO_KEY, JSON.stringify(geo));
    } catch {
      // ignore
    }
    return geo;
  } catch {
    return {};
  }
}

/** Anonymous pageview tracker for admin analytics. Renders nothing. */
export function VisitorTracker() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    let cancelled = false;

    void (async () => {
      const sessionId = getOrCreateSessionId();
      const geo = await resolveGeo();
      if (cancelled) return;
      if (isExcludedVisitGeo(geo.country, geo.countryCode)) return;

      try {
        await recordPageVisit({
          data: {
            path: pathname,
            sessionId,
            city: geo.city,
            region: geo.region,
            country: geo.country,
            countryCode: geo.countryCode,
            referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
          },
        });
      } catch {
        // Analytics should never break the app
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return null;
}
