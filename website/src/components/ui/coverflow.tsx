import { useEffect, useState } from "react";
import { motion, type PanInfo } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CoverflowItem {
  src: string;
  caption?: string;
}

/**
 * 3D coverflow carousel (inspired by the motion.dev coverflow example).
 * Center card is large and flat; side cards rotate, scale down, and dim.
 * Navigate by arrows, dots, dragging, clicking a side card, or arrow keys.
 */
export function Coverflow({
  items,
  onOpen,
  className,
}: {
  items: CoverflowItem[];
  onOpen?: (index: number) => void;
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const count = items.length;

  useEffect(() => {
    setActive((a) => Math.min(a, Math.max(0, count - 1)));
  }, [count]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") setActive((a) => Math.max(0, a - 1));
      if (e.key === "ArrowRight") setActive((a) => Math.min(count - 1, a + 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count]);

  if (count === 0) {
    return (
      <div className={cn("flex h-[320px] items-center justify-center rounded-3xl border border-dashed border-border bg-card text-muted-foreground", className)}>
        No photos yet.
      </div>
    );
  }

  const go = (i: number) => setActive(Math.max(0, Math.min(count - 1, i)));

  function onDragEnd(_e: unknown, info: PanInfo) {
    const threshold = 60;
    if (info.offset.x < -threshold) go(active + 1);
    else if (info.offset.x > threshold) go(active - 1);
  }

  return (
    <div className={cn("relative select-none", className)}>
      <div className="relative mx-auto h-[360px] [perspective:1600px] sm:h-[600px]">
        <motion.div
          className="absolute inset-0"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={onDragEnd}
        >
          {items.map((item, i) => {
            const offset = i - active;
            const abs = Math.abs(offset);
            const visible = abs <= 2;
            return (
              <motion.button
                key={i}
                type="button"
                aria-label={item.caption ?? `Photo ${i + 1}`}
                onClick={() => (i === active ? onOpen?.(i) : go(i))}
                initial={false}
                animate={{
                  x: `${-50 + offset * 50}%`,
                  y: "-50%",
                  rotateY: offset * -30,
                  scale: i === active ? 1 : 0.62,
                  opacity: visible ? (abs === 0 ? 1 : 0.45) : 0,
                  zIndex: 50 - abs,
                }}
                transition={{ type: "spring", stiffness: 240, damping: 28 }}
                style={{ transformStyle: "preserve-3d", pointerEvents: visible ? "auto" : "none" }}
                className="absolute left-1/2 top-1/2 w-[320px] origin-center sm:w-[620px]"
              >
                <div
                  className={cn(
                    "overflow-hidden rounded-2xl bg-ink ring-1 ring-black/5",
                    i === active
                      ? "shadow-[0_40px_80px_-30px_rgba(12,13,16,0.65)]"
                      : "shadow-[0_20px_40px_-24px_rgba(12,13,16,0.5)]"
                  )}
                >
                  <img
                    src={item.src}
                    alt={item.caption ?? "Gallery photo"}
                    draggable={false}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* arrows */}
        <button
          type="button"
          onClick={() => go(active - 1)}
          disabled={active === 0}
          aria-label="Previous photo"
          className="absolute left-2 top-1/2 z-[60] inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg backdrop-blur transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30 sm:left-6"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => go(active + 1)}
          disabled={active === count - 1}
          aria-label="Next photo"
          className="absolute right-2 top-1/2 z-[60] inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg backdrop-blur transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30 sm:right-6"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      {/* caption */}
      {items[active]?.caption && (
        <p className="mt-6 text-center text-base font-semibold text-foreground">
          {items[active].caption}
        </p>
      )}

      {/* dots */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            aria-label={`Go to photo ${i + 1}`}
            className={cn(
              "h-2 rounded-full transition-all",
              i === active ? "w-6 bg-primary" : "w-2 bg-border hover:bg-muted-foreground"
            )}
          />
        ))}
      </div>
    </div>
  );
}
