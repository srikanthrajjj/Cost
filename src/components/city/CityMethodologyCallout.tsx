import { FileText, ArrowRight } from "lucide-react";

interface CityMethodologyCalloutProps {
  methodologyNote: string;
}

export function CityMethodologyCallout({ methodologyNote }: CityMethodologyCalloutProps) {
  return (
    <section className="py-12">
      <div className="container-x">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl border border-border/60 p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <FileText className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-ink mb-2">How these estimates work</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {methodologyNote}
                </p>
                <a
                  href="/methodology"
                  className="inline-flex items-center text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
                >
                  View our methodology
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
