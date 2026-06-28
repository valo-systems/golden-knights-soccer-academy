import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Eyebrow } from "./section-heading";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow: string;
  /** Use a <span className="text-primary"> to accent part of the title. */
  title: ReactNode;
  subtitle?: ReactNode;
  /** Optional background photo (path under /public). */
  image?: string;
  imagePosition?: "center" | "top";
  /** Buttons or links rendered under the subtitle. */
  actions?: ReactNode;
}

/**
 * Shared dark hero used by every interior page.
 * The home page uses its own full-screen parallax hero instead.
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  imagePosition = "center",
  actions,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-ink pt-36 pb-20 text-white sm:pt-44 sm:pb-24">
      <div className="absolute inset-0">
        {image && (
          <img
            src={image}
            alt=""
            aria-hidden
            className={cn(
              "h-full w-full object-cover opacity-25",
              imagePosition === "top" ? "object-top" : "object-center"
            )}
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(12,13,16,0.7),rgba(12,13,16,0.96))]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(238,48,48,0.3),transparent_55%)]" />
      </div>

      <div className="container-gk relative">
        <Reveal>
          <Eyebrow light>{eyebrow}</Eyebrow>
        </Reveal>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mt-5 max-w-4xl font-heading text-5xl font-black uppercase leading-[0.95] text-white text-balance sm:text-7xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <Reveal delay={2}>
            <p className="mt-6 max-w-xl text-lg text-white/70 text-pretty">{subtitle}</p>
          </Reveal>
        )}
        {actions && (
          <Reveal delay={3}>
            <div className="mt-8 flex flex-wrap gap-3">{actions}</div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
