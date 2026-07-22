import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/disclaimer")({
  component: DisclaimerPage,
  head: () => ({
    meta: [
      { title: "Disclaimer | CostReno" },
      {
        name: "description",
        content:
          "Important limitations of CostReno estimates and quote analysis. Planning guidance is not a contractor bid or legal advice.",
      },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://costreno.com/disclaimer" }],
  }),
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
              This Disclaimer explains the limitations of CostReno in plain language. It should be
              read together with our Terms of Service and Privacy Policy.
            </p>

            <h2>Estimates Are General Guidance</h2>
            <p>
              All renovation cost estimates, price ranges, comparisons, savings calculations, and
              timelines provided by CostReno are for informational purposes only.
            </p>
            <p>
              They are generated using regional pricing data, historical trends, AI analysis, and
              the information you provide. They are not contractor quotes, appraisals, guarantees,
              or promises of actual project costs.
            </p>
            <p>Actual costs may vary significantly based on factors including:</p>
            <ul>
              <li>Property conditions</li>
              <li>Labor rates</li>
              <li>Material availability</li>
              <li>Permit requirements</li>
              <li>Project scope</li>
              <li>Contractor pricing</li>
              <li>Local market conditions</li>
            </ul>

            <h2>We Are Not Construction or Insurance Professionals</h2>
            <p>CostReno is not:</p>
            <ul>
              <li>A licensed contractor</li>
              <li>An architect or engineer</li>
              <li>An insurance company</li>
              <li>A public adjuster</li>
              <li>A law firm</li>
              <li>A financial advisor</li>
            </ul>
            <p>
              Nothing on this website should be interpreted as legal, insurance, engineering,
              architectural, financial, or professional construction advice. If you need
              professional guidance, consult an appropriately licensed professional.
            </p>

            <h2>AI Can Be Wrong</h2>
            <p>
              Some CostReno features use artificial intelligence to analyze photos, contractor
              quotes, invoices, and other uploaded documents.
            </p>
            <p>AI may:</p>
            <ul>
              <li>Misidentify materials</li>
              <li>Miss important scope items</li>
              <li>Misinterpret contractor documents</li>
              <li>Produce inaccurate estimates</li>
              <li>Generate incomplete recommendations</li>
            </ul>
            <p>
              AI-generated results should always be reviewed and independently verified before
              making renovation, insurance, or financial decisions.
            </p>

            <h2>Quote Reviews Are Not Professional Opinions</h2>
            <p>
              CostReno's quote review tools are designed to help identify potential pricing
              differences, missing scope items, and questions you may wish to discuss with your
              contractor.
            </p>
            <p>
              They should not be interpreted as confirmation that a contractor's quote is accurate,
              inaccurate, fair, unfair, complete, or incomplete. Only your contractor or another
              qualified professional can evaluate your specific project in full.
            </p>

            <h2>Your Uploaded Content</h2>
            <p>
              You are responsible for ensuring you have permission to upload any photos, contractor
              quotes, invoices, or insurance documents. We recommend removing unnecessary personal
              or sensitive information before uploading files. Please review our Privacy Policy to
              understand how uploaded content is processed and protected.
            </p>

            <h2>Before You Sign a Contract</h2>
            <p>Before approving a renovation project, we recommend that you:</p>
            <ul>
              <li>Obtain written quotes from licensed and insured contractors</li>
              <li>Review the complete project scope</li>
              <li>Ask questions about missing or unclear items</li>
              <li>Compare multiple quotes when practical</li>
              <li>Verify important pricing and technical details independently</li>
            </ul>
            <p>
              CostReno should be used as a research and decision-support tool—not as the sole basis
              for selecting a contractor or approving a project.
            </p>

            <h2>Contact</h2>
            <p>If you have questions about this Disclaimer, please contact:</p>
            <p>
              <strong>Email:</strong> <a href="mailto:support@costreno.com">support@costreno.com</a>
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
