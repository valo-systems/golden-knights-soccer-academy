import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Instagram, ArrowUpRight } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { SITE } from "@/data/site";
import { cn } from "@/lib/utils";

type Cat = "All" | "Match days" | "Training" | "Team";

const PHOTOS: { src: string; cat: Exclude<Cat, "All"> }[] = [
  { src: "/img/photos/academy-01.jpg", cat: "Match days" },
  { src: "/img/photos/academy-02.jpg", cat: "Training" },
  { src: "/img/photos/academy-03.webp", cat: "Team" },
  { src: "/img/photos/academy-04.jpg", cat: "Training" },
  { src: "/img/photos/academy-05.jpg", cat: "Match days" },
  { src: "/img/photos/academy-06.webp", cat: "Team" },
  { src: "/img/photos/academy-02.jpg", cat: "Match days" },
  { src: "/img/photos/academy-04.jpg", cat: "Team" },
  { src: "/img/photos/academy-01.jpg", cat: "Training" },
];

const CATS: Cat[] = ["All", "Match days", "Training", "Team"];

export function Gallery() {
  usePageMeta({
    title: "Gallery",
    description:
      "Photos from training sessions, match days, and academy life at Golden Knights Soccer Academy in Midrand.",
    path: "/gallery",
  });
  const [cat, setCat] = useState<Cat>("All");
  const [active, setActive] = useState<string | null>(null);
  const shown = cat === "All" ? PHOTOS : PHOTOS.filter((p) => p.cat === cat);

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title={
          <>
            Academy <span className="text-primary">life</span>
          </>
        }
        subtitle="Training, match days, and the moments that make GKSA."
      />

      <section className="bg-background py-16 sm:py-20">
        <div className="container-gk">
          {/* filters */}
          <div className="flex flex-wrap gap-2">
            {CATS.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
                  cat === c
                    ? "bg-primary text-white"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          {/* grid */}
          <div className="mt-8 columns-2 gap-4 md:columns-3 [&>*]:mb-4">
            {shown.map((p, i) => (
              <Reveal key={i} delay={i % 3}>
                <button
                  onClick={() => setActive(p.src)}
                  className="group block w-full overflow-hidden rounded-2xl"
                >
                  <img
                    src={p.src}
                    alt={p.cat}
                    loading="lazy"
                    className={cn(
                      "w-full object-cover transition-transform duration-500 group-hover:scale-105",
                      i % 3 === 0 ? "aspect-[3/4]" : i % 3 === 1 ? "aspect-square" : "aspect-[4/5]"
                    )}
                  />
                </button>
              </Reveal>
            ))}
          </div>

          {/* instagram cta */}
          <div className="mt-14 flex flex-col items-center gap-4 rounded-3xl border border-border bg-card p-10 text-center">
            <Instagram className="size-8 text-primary" />
            <h2 className="text-2xl text-foreground">See more on Instagram</h2>
            <p className="max-w-md text-sm text-muted-foreground">
              Follow the academy for the latest photos and videos from training and match days.
            </p>
            <Button asChild size="lg" className="mt-2">
              <a href={SITE.instagram} target="_blank" rel="noreferrer">
                Follow @goldenknightsfc <ArrowUpRight />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* lightbox */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-4 backdrop-blur"
          >
            <button
              className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              onClick={() => setActive(null)}
              aria-label="Close"
            >
              <X />
            </button>
            <motion.img
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              src={active}
              alt="GKSA"
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-[92vw] rounded-2xl object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
