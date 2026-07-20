import { useCallback, useRef } from "react";
import { Camera, ClipboardList, Clock, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { kitchenPathOptions, type PathOption } from "@/lib/kitchen-estimator/config";

interface PathSelectorProps {
  onSelectPath: (path: "ai" | "manual") => void;
}

const iconMap: Record<string, React.ReactNode> = {
  camera: <Camera className="h-8 w-8" aria-hidden="true" />,
  clipboard: <ClipboardList className="h-8 w-8" aria-hidden="true" />,
};

function PathCard({
  option,
  onSelect,
  index,
  total,
}: {
  option: PathOption;
  onSelect: () => void;
  index: number;
  total: number;
}) {
  return (
    <Card
      role="button"
      tabIndex={0}
      aria-label={`Select ${option.title}: ${option.description}. Estimated time: ${option.estimatedTime}`}
      aria-describedby={`path-features-${option.id}`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className="cursor-pointer border-2 border-primary/20 transition-all duration-200 hover:border-primary hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <CardHeader className="pb-3">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {iconMap[option.icon]}
        </div>
        <CardTitle className="font-display text-xl text-primary">
          {option.title}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {option.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" aria-hidden="true" />
          <span>{option.estimatedTime}</span>
        </div>
        <ul
          id={`path-features-${option.id}`}
          className="space-y-2"
          aria-label={`Features of ${option.title}`}
        >
          {option.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function PathSelector({ onSelectPath }: PathSelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const cards = containerRef.current?.querySelectorAll<HTMLElement>('[role="button"]');
      if (!cards || cards.length === 0) return;

      const currentIndex = Array.from(cards).findIndex(
        (card) => card === document.activeElement
      );

      let nextIndex: number | null = null;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        nextIndex = currentIndex < cards.length - 1 ? currentIndex + 1 : 0;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : cards.length - 1;
      }

      if (nextIndex !== null) {
        cards[nextIndex].focus();
      }
    },
    []
  );

  return (
    <section
      className="mx-auto w-full max-w-3xl px-4 py-8"
      aria-labelledby="path-selector-heading"
    >
      <div className="mb-8 text-center">
        <h2
          id="path-selector-heading"
          className="font-display text-2xl font-bold text-primary sm:text-3xl"
        >
          How would you like to estimate your kitchen remodel?
        </h2>
        <p className="mt-2 text-muted-foreground">
          Choose the path that works best for you.
        </p>
      </div>
      <div
        ref={containerRef}
        className="grid gap-6 sm:grid-cols-2"
        role="group"
        aria-label="Estimation path options"
        onKeyDown={handleKeyDown}
      >
        {kitchenPathOptions.map((option, index) => (
          <PathCard
            key={option.id}
            option={option}
            onSelect={() => onSelectPath(option.id)}
            index={index}
            total={kitchenPathOptions.length}
          />
        ))}
      </div>
    </section>
  );
}
