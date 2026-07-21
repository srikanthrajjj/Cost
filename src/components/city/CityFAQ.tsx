import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

interface CityFAQProps {
  items: FAQItem[];
  categoryName: string;
  city: string;
}

export function CityFAQ({ items, categoryName, city }: CityFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container-x">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-4 text-center">
            {categoryName} in {city}: frequently asked questions
          </h2>
          <p className="text-muted-foreground text-center mb-10">
            Common questions about pricing, permits, materials, and contractors.
          </p>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-border/60 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-muted/20 transition-colors"
                  aria-expanded={openIndex === index}
                >
                  <span className="font-semibold text-ink pr-4">{item.question}</span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-200",
                      openIndex === index && "rotate-180",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-200",
                    openIndex === index
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-4 text-muted-foreground text-sm leading-relaxed border-t border-border/60 pt-4">
                      {item.answer}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
