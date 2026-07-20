import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/disclaimer")({
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="container-x py-20">
        <div className="max-w-3xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <FileText className="h-7 w-7 text-accent" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink mb-4 text-center">
            Disclaimer
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-12">
            Last updated: July 20, 2026
          </p>

          <div className="prose prose-lg max-w-none text-left">
            <p>
              This page summarizes important limitations of CostReno in plain language. It works
              alongside, and does not replace, our Terms of Service and Privacy Policy.
            </p>

            <h2>Estimates are general guidance, not guarantees</h2>
            <p>
              Every cost figure on CostReno, single number or range, is a general estimate based on
              regional data, typical project patterns, and information you provide. It is not a
              binding quote, appraisal, or promise of what your specific project will cost. Real
              costs depend on details a website cannot fully see: exact site conditions, code
              requirements, contractor pricing, material availability, and more.
            </p>

            <h2>We are not a contractor, insurer, or law firm</h2>
            <p>
              CostReno does not perform construction work, sell insurance, adjust claims, or
              practice law. Nothing on this site should be treated as legal, insurance, or financial
              advice specific to your situation. For those, consult a licensed contractor, public
              adjuster, insurance professional, or attorney.
            </p>

            <h2>AI-assisted features can make mistakes</h2>
            <p>
              Photo detection, quote analysis, and document review features use AI models that can
              misread materials, miss details, or misinterpret documents. Always review AI-generated
              results yourself, and verify anything important, especially before making a decision
              involving an insurance claim or a signed contract.
            </p>

            <h2>Your documents, your responsibility</h2>
            <p>
              When you upload a quote, photo, or insurance document, you're responsible for
              confirming you're allowed to share it and for removing any information you'd rather
              not include. See our Privacy Policy for how uploaded content is handled.
            </p>

            <h2>Before you sign anything</h2>
            <p>
              Always get a written quote from a licensed, insured contractor, and consider a second
              opinion before committing to a project, especially for costs significantly different
              from what CostReno's estimate shows.
            </p>

            <h2>Questions about this disclaimer</h2>
            <p>Questions about this disclaimer can be directed to support@costreno.com.</p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
