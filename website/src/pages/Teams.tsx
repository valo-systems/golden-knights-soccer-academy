import { Trophy, CalendarDays } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const SQUADS = [
  { age: "U9", img: "/img/photos/academy-02.jpg", note: "Foundation phase" },
  { age: "U11", img: "/img/photos/academy-05.jpg", note: "Development phase" },
  { age: "U13", img: "/img/photos/academy-06.webp", note: "Competitive phase" },
  { age: "U13+", img: "/img/photos/academy-03.webp", note: "Performance phase" },
];

type Fixture = { date: string; team: string; opp: string; venue: string };
type Result = { date: string; team: string; result: string; opp: string };

// Populated each season from the academy / SAFA North Rand FA.
const FIXTURES: Fixture[] = [];
const RESULTS: Result[] = [];

export function Teams() {
  usePageMeta({
    title: "Teams & Fixtures",
    description:
      "Meet the Golden Knights squads. Fixtures, results, and league standings for our U9, U11, U13, and U13+ teams in the North Rand FA.",
    path: "/teams",
  });
  return (
    <>
      <PageHero
        eyebrow="Teams & fixtures"
        title={
          <>
            Our <span className="text-primary">squads</span>
          </>
        }
        subtitle="Meet the teams and follow every match through the season."
        image="/img/photos/academy-05.jpg"
        imagePosition="top"
      />

      {/* squads */}
      <section className="bg-background py-24 sm:py-28">
        <div className="container-gk">
          <SectionHeading eyebrow="Squads" title={<>Four teams, one badge.</>} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SQUADS.map((s, i) => (
              <Reveal key={s.age} delay={i}>
                <div className="group relative overflow-hidden rounded-3xl bg-ink">
                  <img
                    src={s.img}
                    alt={`${s.age} squad`}
                    loading="lazy"
                    className="aspect-[3/4] w-full object-cover object-top opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-60"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(12,13,16,0.9),transparent_55%)]" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="font-heading text-3xl font-black text-white">{s.age}</p>
                    <p className="text-sm text-white/70">{s.note}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* leagues */}
      <section className="bg-secondary py-20">
        <div className="container-gk flex flex-col items-center gap-4 text-center">
          <Trophy className="size-8 text-primary" />
          <h2 className="max-w-2xl text-2xl text-foreground sm:text-3xl">
            GKSA competes in SAFA-affiliated league matches and tournaments through the North Rand
            Football Association.
          </h2>
          <p className="text-sm text-muted-foreground">
            Current leagues and competitions are confirmed each season.
          </p>
        </div>
      </section>

      {/* fixtures + results */}
      <section className="bg-background py-24 sm:py-28">
        <div className="container-gk grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading eyebrow="Upcoming" title={<>Fixtures.</>} />
            {FIXTURES.length === 0 ? (
              <div className="mt-8 flex flex-col items-center gap-2 rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center">
                <CalendarDays className="size-7 text-primary" />
                <p className="font-semibold text-foreground">Fixtures coming soon</p>
                <p className="max-w-xs text-sm text-muted-foreground">
                  Upcoming games will be listed here once the season schedule is confirmed.
                </p>
              </div>
            ) : (
              <div className="mt-8 overflow-hidden rounded-3xl border border-border">
                {FIXTURES.map((f, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center justify-between gap-3 px-5 py-4",
                      i % 2 ? "bg-secondary" : "bg-card"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <CalendarDays className="size-4 text-primary" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {f.team} vs {f.opp}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {f.date} · {f.venue}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {f.team}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <SectionHeading eyebrow="Recent" title={<>Results.</>} />
            {RESULTS.length === 0 ? (
              <div className="mt-8 flex flex-col items-center gap-2 rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center">
                <Trophy className="size-7 text-primary" />
                <p className="font-semibold text-foreground">Results coming soon</p>
                <p className="max-w-xs text-sm text-muted-foreground">
                  Recent results will appear here as the teams play through the season.
                </p>
              </div>
            ) : (
              <div className="mt-8 overflow-hidden rounded-3xl border border-border">
                {RESULTS.map((r, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center justify-between gap-3 px-5 py-4",
                      i % 2 ? "bg-secondary" : "bg-card"
                    )}
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {r.team} vs {r.opp}
                      </p>
                      <p className="text-xs text-muted-foreground">{r.date}</p>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-bold",
                        r.result.startsWith("W")
                          ? "bg-primary text-white"
                          : "bg-secondary text-foreground border border-border"
                      )}
                    >
                      {r.result}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
