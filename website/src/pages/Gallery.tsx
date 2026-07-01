import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Instagram, ArrowUpRight, ShieldCheck, ImageOff } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { PageHero } from "@/components/ui/page-hero";
import { Coverflow } from "@/components/ui/coverflow";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/admin/store";
import { GALLERY_CATEGORIES } from "@/admin/types";
import { SITE } from "@/data/site";

const FILTERS = ["All", ...GALLERY_CATEGORIES] as const;
type Filter = (typeof FILTERS)[number];

export function Gallery() {
  usePageMeta({
    title: "Gallery",
    description:
      "Photos from training sessions, match days, and academy life at Golden Knights Soccer Academy in Midrand.",
    path: "/gallery",
  });

  const { galleryPhotos } = useAdmin();
  const [filter, setFilter] = useState<Filter>("All");
  const [active, setActive] = useState<string | null>(null);

  const shown = useMemo(
    () => (filter === "All" ? galleryPhotos : galleryPhotos.filter((p) => p.category === filter)),
    [galleryPhotos, filter]
  );

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

      {/* privacy notice */}
      <section className="bg-secondary py-6">
        <div className="container-gk">
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-card px-5 py-4 text-sm text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
            <p>
              <span className="font-semibold text-foreground">Your child's privacy matters.</span>{" "}
              All photos are published with written parental consent and comply with the Protection
              of Personal Information Act (POPIA). Images do not include full names or personal
              details. To withdraw consent or request removal of a photo, contact us at{" "}
              <a href="/contact" className="font-semibold text-primary hover:underline">
                the academy
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* coverflow showcase */}
      <section className="overflow-hidden bg-background py-16 sm:py-20">
        <div className="container-gk">
          <div className="mb-10 flex justify-center">
            <FilterTabs
              tabs={FILTERS.map((c) => ({ value: c, label: c }))}
              active={filter}
              onChange={setFilter}
            />
          </div>

          {shown.length === 0 ? (
            <div className="flex flex-col items-center gap-6 rounded-3xl border border-border bg-card px-8 py-20 text-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-accent">
                <ImageOff className="size-7 text-primary" />
              </span>
              <div>
                <h3 className="text-xl font-black text-foreground">
                  {filter === "All" ? "No photos yet." : `No "${filter}" photos yet.`}
                </h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  {filter === "All"
                    ? "The academy gallery will be updated regularly. Follow us on Instagram in the meantime."
                    : "Try a different category or come back after the next match day."}
                </p>
              </div>
              {filter !== "All" ? (
                <Button variant="outline" onClick={() => setFilter("All")}>
                  View all photos
                </Button>
              ) : (
                <Button asChild size="lg">
                  <a href={SITE.instagram} target="_blank" rel="noreferrer">
                    Follow on Instagram <ArrowUpRight className="size-4" />
                  </a>
                </Button>
              )}
            </div>
          ) : (
            <>
              <Coverflow
                key={filter}
                items={shown.map((p) => ({ src: p.src, caption: p.caption }))}
                onOpen={(i) => setActive(shown[i]?.src ?? null)}
              />
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Drag, use the arrows, or tap a photo to enlarge.
              </p>
            </>
          )}
        </div>
      </section>

      {/* instagram cta */}
      <section className="bg-background py-16 sm:py-20">
        <div className="container-gk">
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-card p-10 text-center">
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
