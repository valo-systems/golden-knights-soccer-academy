import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepProgressProps {
  steps: string[];
  current: number;
  /** Light styling for use on dark backgrounds. */
  light?: boolean;
}

/** Numbered step indicator shared by the Register and Sponsor wizards. */
export function StepProgress({ steps, current, light = false }: StepProgressProps) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i <= current;
        return (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors",
                active
                  ? "bg-primary text-white"
                  : light
                    ? "bg-white/10 text-white/50"
                    : "bg-secondary text-muted-foreground"
              )}
            >
              {done ? <CheckCircle2 className="size-5" /> : i + 1}
            </div>
            <span
              className={cn(
                "hidden text-sm font-semibold sm:block",
                i === current
                  ? light
                    ? "text-white"
                    : "text-foreground"
                  : light
                    ? "text-white/45"
                    : "text-muted-foreground"
              )}
            >
              {label}
            </span>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "h-px flex-1",
                  done ? "bg-primary" : light ? "bg-white/15" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
