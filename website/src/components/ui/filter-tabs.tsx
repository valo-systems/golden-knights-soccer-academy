import { useId } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface Tab<T extends string> {
  value: T;
  label: string;
}

interface FilterTabsProps<T extends string> {
  tabs: Tab<T>[];
  active: T;
  onChange: (value: T) => void;
  className?: string;
  light?: boolean;
}

export function FilterTabs<T extends string>({
  tabs,
  active,
  onChange,
  className,
  light = false,
}: FilterTabsProps<T>) {
  const layoutId = useId();

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tabs.map((tab) => {
        const isActive = tab.value === active;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={cn(
              "relative rounded-full px-5 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              isActive
                ? "text-white"
                : light
                  ? "border border-white/20 text-white/70 hover:text-white"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            {isActive && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
