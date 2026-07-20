import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/methodology")({
  component: MethodologyPage,
});

function MethodologyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="container-x py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <FileText className="h-7 w-7 text-accent" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink mb-4">Methodology</h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
            We're documenting every data source, refresh cadence, and calculation that powers
            CostReno estimates and analysis. This page will be published soon.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
