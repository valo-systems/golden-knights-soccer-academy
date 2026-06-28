import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

export function Eyebrow({
  children,
  className,
  light = false,
}: {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.2em]",
        light ? "text-primary-foreground/80" : "text-primary",
        className
      )}
    >
      <span className="h-px w-8 bg-current opacity-60" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  light = false,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <Reveal>
          <Eyebrow light={light} className={align === "center" ? "justify-center" : ""}>
            {eyebrow}
          </Eyebrow>
        </Reveal>
      )}
      <Reveal delay={1}>
        <h2
          className={cn(
            "mt-4 text-4xl leading-[1.05] sm:text-5xl",
            light ? "text-white" : "text-foreground"
          )}
        >
          {title}
        </h2>
      </Reveal>
      {intro && (
        <Reveal delay={2}>
          <p
            className={cn(
              "mt-5 text-lg leading-relaxed text-pretty",
              light ? "text-white/70" : "text-muted-foreground"
            )}
          >
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
