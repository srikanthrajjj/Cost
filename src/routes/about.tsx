import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="container-x py-20">
        <div className="max-w-3xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <FileText className="h-7 w-7 text-accent" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink mb-4 text-center">
            About CostReno
          </h1>

          <div className="prose prose-lg max-w-none text-left">
            <h2>Helping homeowners make smarter renovation decisions with confidence.</h2>
            <p>
              Renovating a home is one of the largest financial decisions most people will ever
              make. Yet homeowners are often forced to compare confusing contractor quotes, estimate
              project costs with limited information, and make important decisions without knowing
              whether pricing is reasonable.
            </p>
            <p>
              We built <strong>CostReno</strong> to change that. Using AI and regional pricing data,
              CostReno helps homeowners estimate renovation costs, understand contractor quotes, and
              prepare for insurance-related repairs—all in minutes.
            </p>

            <h2>Our goal is simple:</h2>
            <blockquote>
              <p>
                <strong>
                  Give homeowners the confidence to make informed renovation decisions.
                </strong>
              </p>
            </blockquote>

            <h2>Why We Built CostReno</h2>
            <p>
              Most homeowners only renovate a few times in their lives. Contractors do it every day.
            </p>
            <p>That knowledge gap makes it difficult to answer simple questions like:</p>
            <ul>
              <li>Is this quote reasonable?</li>
              <li>What's included—and what's missing?</li>
              <li>How much should this project actually cost?</li>
              <li>Should I get another quote?</li>
              <li>Am I overpaying?</li>
            </ul>
            <p>CostReno helps answer those questions before you commit to a project.</p>

            <h2>What We Do</h2>
            <p>
              CostReno combines AI with construction pricing data to provide tools that help
              homeowners:
            </p>
            <ul>
              <li>Estimate renovation costs</li>
              <li>Compare contractor quotes</li>
              <li>Identify potentially missing scope items</li>
              <li>Understand renovation pricing</li>
              <li>Plan projects with greater confidence</li>
              <li>Prepare for insurance-related repairs</li>
            </ul>
            <p>
              Our tools are designed to support—not replace—the advice of licensed contractors and
              other qualified professionals.
            </p>

            <h2>Our Approach</h2>
            <p>
              We believe homeowners deserve transparent information before making expensive
              decisions.
            </p>
            <p>That's why CostReno focuses on:</p>
            <ul>
              <li>AI-powered analysis</li>
              <li>Transparent pricing guidance</li>
              <li>Easy-to-understand reports</li>
              <li>Educational insights</li>
              <li>Privacy-first document handling</li>
            </ul>
            <p>
              Our estimates and recommendations are intended to help you ask better questions and
              make more informed decisions—not to replace professional advice.
            </p>

            <h2>Our Mission</h2>
            <p>
              <strong>
                To make home renovation pricing more transparent, understandable, and accessible for
                every homeowner.
              </strong>
            </p>
            <p>
              We believe better information leads to better decisions, fewer surprises, and greater
              confidence throughout the renovation process.
            </p>

            <h2>Built for Homeowners</h2>
            <p>
              Whether you're Remodeling a kitchen, Replacing a roof, Renovating a bathroom,
              Reviewing a contractor quote, or Planning an insurance repair, CostReno is designed to
              help you understand your options before spending thousands of dollars.
            </p>

            <h2>Our Commitment</h2>
            <p>We are committed to building tools that are:</p>
            <ul>
              <li>Accurate and continually improving</li>
              <li>Easy to use</li>
              <li>Transparent about limitations</li>
              <li>Respectful of your privacy</li>
              <li>Focused on helping—not selling</li>
            </ul>
            <p>
              As our AI and pricing models evolve, our goal remains the same: provide homeowners
              with reliable information they can use to make better renovation decisions.
            </p>

            <h2>Get Started</h2>
            <p>
              Whether you're planning your first renovation or comparing multiple contractor quotes,
              CostReno is here to help you make informed decisions with confidence.
            </p>
            <p>
              <strong>Estimate your project. Analyze your quote. Renovate smarter.</strong>
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
