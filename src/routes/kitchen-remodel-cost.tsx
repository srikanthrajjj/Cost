import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/kitchen-remodel-cost")({
  beforeLoad: () => {
    throw redirect({ to: "/estimate", search: { project: "kitchen" } });
  },
  head: () => ({
    meta: [
      { title: "Kitchen Remodel Cost Estimator 2026 — Get Your Estimate | CostReno" },
      {
        name: "description",
        content:
          "Calculate your kitchen remodel cost in under 90 seconds. ZIP-adjusted pricing, material comparisons, and a detailed cost breakdown. Free, no signup.",
      },
    ],
    links: [{ rel: "canonical", href: "https://costreno.com/estimate?project=kitchen" }],
  }),
  component: () => null,
});
