import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Shield, Bell, CheckCircle2 } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { NewsletterSignup } from "@/components/NewsletterSignup";

export const Route = createFileRoute("/insurance-claims")({
  component: InsuranceClaimsComingSoon,
  head: () => ({
    meta: [
      { title: "Insurance claims tool coming soon — CostReno" },
      {
        name: "description",
        content:
          "CostReno's insurance claims tool is launching soon. Sign up to get early access and be the first to analyze your insurance claims with AI.",
      },
      { property: "og:title", content: "Insurance claims tool coming soon — CostReno" },
      {
        property: "og:description",
        content:
          "AI-powered insurance claims analysis is coming to CostReno. Sign up for early access.",
      },
      { property: "og:url", content: "https://www.costreno.com/insurance-claims" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: "https://www.costreno.com/insurance-claims" }],
  }),
});

function InsuranceClaimsComingSoon() {
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <SiteNav />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 md:py-32 text-center">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
          <Shield className="h-8 w-8 text-accent" />
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-ink mb-3">
          Insurance claims tool
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed max-w-md mx-auto mb-8">
          AI-powered insurance claims analysis is coming soon. Upload your claim documents, get
          instant insights, and maximize your coverage.
        </p>

        <div className="rounded-2xl border border-border bg-white p-6 md:p-8 shadow-sm mb-8 max-w-md mx-auto">
          <h2 className="font-display text-lg font-bold text-ink mb-4">What's coming</h2>
          <div className="space-y-3 text-left">
            {[
              "Upload insurance claim documents for AI analysis",
              "Identify missing documentation and coverage gaps",
              "Compare your claim against typical settlement amounts",
              "Get personalized tips to maximize your payout",
              "Track claim status and deadlines",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span className="text-sm text-ink">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6 max-w-md mx-auto mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Bell className="h-4 w-4 text-accent" />
            <span className="text-sm font-bold text-ink">Get notified when we launch</span>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Be the first to try our insurance claims tool. No spam, just a launch notification.
          </p>
          <NewsletterSignup source="insurance-claims-waitlist" compact />
        </div>

        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </a>
      </div>

      <SiteFooter />
    </div>
  );
}
