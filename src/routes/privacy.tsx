import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy policy | CostReno" },
      {
        name: "description",
        content:
          "Read the CostReno privacy policy to understand what information we collect and how it is used.",
      },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://www.costreno.com/privacy" }],
  }),
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="container-x py-20">
        <div className="max-w-3xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <FileText className="h-7 w-7 text-accent" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink mb-4 text-center">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-12">
            Last updated: July 20, 2026
          </p>

          <div className="prose prose-lg max-w-none text-left">
            <p>
              This policy explains what information CostReno collects, how it is used, and the
              choices you have.
            </p>

            <h2>1. Information we collect</h2>
            <h3>Information you provide directly</h3>
            <ul>
              <li>Address or ZIP code entered to generate a cost estimate</li>
              <li>
                Answers to wizard questions (property type, size, material preferences, condition,
                and similar project details)
              </li>
              <li>Photos you upload for AI-assisted detection</li>
              <li>
                Contractor quotes, insurance policy documents, or claim-related documents you upload
                for analysis
              </li>
              <li>Email address, if you join a waitlist, subscribe to updates, or contact us</li>
            </ul>

            <h3>Information collected automatically</h3>
            <p>
              Basic usage data (pages visited, general device and browser type, approximate location
              from IP address) for analytics purposes
            </p>

            <h2>2. How we use your information</h2>
            <ul>
              <li>To generate cost estimates and process AI-assisted photo detection</li>
              <li>
                To analyze uploaded quotes and documents and return a comparison or summary to you
              </li>
              <li>
                To notify you when a requested city, category, or tool becomes available, if you opt
                in
              </li>
              <li>
                To improve the accuracy of our estimates over time using aggregated, de-identified
                patterns from user-submitted data
              </li>
              <li>To operate, maintain, and improve the service generally</li>
            </ul>

            <h2>3. How uploaded documents and photos are handled</h2>
            <ul>
              <li>
                Photos and documents you upload are sent to third-party AI processing providers
                solely to generate the analysis you requested
              </li>
              <li>
                We also use uploaded photos, quotes, and other submitted information to help train
                and improve our estimation models and AI systems over time
              </li>
              <li>
                We will never sell your photos, quotes, insurance documents, or other personal
                information to marketing companies, data brokers, or any third party for their own
                commercial use
              </li>
              <li>
                Uploaded photos, quotes, and documents are retained for up to 6 months from the date
                of upload, after which they are deleted from our systems. Aggregated or
                de-identified patterns learned from this data, such as a general pricing trend, may
                be retained beyond this period, but not in a form that identifies you or your
                property
              </li>
              <li>
                You may request earlier deletion of any uploaded content at any time by contacting
                us at privacy@costreno.com
              </li>
            </ul>

            <h2>4. Sharing of information</h2>
            <p>We do not sell your personal information. We may share information with:</p>
            <ul>
              <li>
                Service providers who help operate the platform, such as hosting, AI processing, and
                analytics providers, under confidentiality obligations
              </li>
              <li>Law enforcement or regulators if required by law</li>
              <li>
                A successor entity in the event of a merger, acquisition, or sale of assets, subject
                to this policy or a materially similar one
              </li>
            </ul>

            <h2>5. Data retention</h2>
            <ul>
              <li>
                Wizard answers and estimate details are retained for 12 months, or until you request
                deletion, whichever comes first
              </li>
              <li>
                Uploaded photos, quotes, and insurance documents are retained for up to 6 months, as
                described in Section 3
              </li>
              <li>Email addresses are retained until you unsubscribe or request deletion</li>
              <li>Basic analytics data is retained for up to 24 months in aggregated form</li>
            </ul>

            <h2>6. Your choices and rights</h2>
            <ul>
              <li>
                You may use the core cost estimator without providing an email address or account
              </li>
              <li>
                If you are a California resident, you have rights under the CCPA and CPRA, including
                the right to know what personal information we collect, the right to request
                deletion of your personal information, the right to correct inaccurate information,
                and the right to opt out of the sale or sharing of personal information. CostReno
                does not sell personal information as defined under these laws
              </li>
              <li>
                Residents of other US states with comparable privacy laws have similar rights, which
                we honor consistent with applicable law
              </li>
              <li>
                You may unsubscribe from email updates at any time using the link in any email
              </li>
              <li>
                You may request access to or deletion of your data by contacting
                privacy@costreno.com
              </li>
            </ul>

            <h2>7. Security</h2>
            <p>
              We use industry-standard technical measures to protect your information, including
              encryption of data in transit and access controls limiting who can view uploaded
              content. No method of transmission or storage is completely secure, and we cannot
              guarantee absolute security.
            </p>

            <h2>8. Children's privacy</h2>
            <p>
              CostReno is not directed to individuals under 18, and we do not knowingly collect
              information from children.
            </p>

            <h2>9. International operations</h2>
            <p>
              CostReno's estimates and content are intended for properties located in the United
              States. Our team and service providers may be located outside the United States, which
              means your information may be processed and stored in other countries. By using the
              Service, you consent to this transfer and processing.
            </p>

            <h2>10. Changes to this policy</h2>
            <p>
              We may update this policy from time to time. Material changes will be reflected by
              updating the "Last updated" date above, and significant changes will be communicated
              via email to registered users where applicable.
            </p>

            <h2>11. Contact</h2>
            <p>Questions about this policy can be directed to privacy@costreno.com.</p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
