import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { savePageVisit } from "@/lib/db/store";
import { isExcludedVisitGeo } from "@/lib/analytics/visit-geo";

export const recordPageVisit = createServerFn({ method: "POST" })
  .validator(
    z.object({
      path: z.string().min(1).max(300),
      sessionId: z.string().min(8).max(80),
      city: z.string().max(80).optional(),
      region: z.string().max(80).optional(),
      country: z.string().max(80).optional(),
      countryCode: z.string().max(8).optional(),
      referrer: z.string().max(400).optional(),
    }),
  )
  .handler(async ({ data }) => {
    // Skip admin/internal noise
    if (data.path.startsWith("/admin")) {
      return { ok: true as const, skipped: true as const };
    }

    if (isExcludedVisitGeo(data.country, data.countryCode)) {
      return { ok: true as const, skipped: true as const };
    }

    await savePageVisit({
      path: data.path,
      sessionId: data.sessionId,
      city: data.city,
      region: data.region,
      country: data.country,
      countryCode: data.countryCode,
      referrer: data.referrer,
    });

    return { ok: true as const, skipped: false as const };
  });
