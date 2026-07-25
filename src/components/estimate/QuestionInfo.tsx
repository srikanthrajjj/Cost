import { HelpCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface QuestionInfoProps {
  topic: string;
  info: string;
  className?: string;
}

export function QuestionInfo({ topic, info, className }: QuestionInfoProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors",
            "hover:bg-primary/5 hover:text-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
            className,
          )}
          aria-label={`Learn more about ${topic}`}
        >
          <HelpCircle className="h-4 w-4" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-80 max-w-[calc(100vw-2rem)] border-border bg-white p-4 text-sm leading-relaxed text-ink/80 shadow-md"
      >
        {info}
      </PopoverContent>
    </Popover>
  );
}
