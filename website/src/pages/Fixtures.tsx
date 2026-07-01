import { useMemo, useState } from "react";
import { CalendarDays, MapPin, Trophy } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { useAdmin } from "@/admin/store";
import { AGE_GROUPS, matchOutcome } from "@/admin/types";
import { cn } from "@/lib/utils";

const FILTERS = ["All", ...AGE_GROUPS] as const;
type Filter = (typeof FILTERS)[number];

function dayLabel(iso: string) {
  return new Date(iso).toLocaleDateString("en-ZA", { weekday: "short", day: "2-digit", month: "short" });
}

const OUTCOME = {
  W: { label: "Win", cls: "bg-primary text-white" },
  D: { label: "Draw", cls: "border border-border bg-secondary text-foreground" },
  L: { label: "Loss", cls: "bg-ink text-white" },
};

export function Fixtures() {
  usePageMeta({
    title: "Fixtures & Results",
    description:
      "Upcoming fixtures and recent results for the Golden Knights Soccer Academy teams in the North Rand FA.",
    path: "/fixtures",
  });

  const { matches } = useAdmin();
  const [filter, setFilter] = useState<Filter>("All");

  const { fixtures, results, next } = useMemo(() => {
    const f = matches.filter((m) => m.status === "upcoming" && (filter === "All" || m.team === filter));
    const r = matches.filter((m) => m.status === "played" && (filter === "All" || m.team === filter));
    f.sort((a, b) => +new Date(a.date) - +new Date(b.date));
    r.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    return { fixtures: f, results: r, next: f[0] ?? null };
  }, [matches, filter]);

  return (
    <>
      <PageHero
        eyebrow="Match centre"
        title={
          <>
            Fixtures & <span className="text-primary">results</span>
          </>
        }
        subtitle="Follow every Golden Knights match through the season."
        image="/img/photos/academy-01.jpg"
      />

      <section className="bg-background py-16 sm:py-20">
        <div className="container-gk">
          {/* filters */}
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
                  filter === c
                    ? "bg-primary text-white"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          {/* next match feature */}
          {next && (
            <Reveal>
              <div className="relative mt-8 overflow-hidden rounded-3xl bg-ink text-white">
                <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" />
                <div className="relative grid items-center gap-6 p-8 sm:p-10 lg:grid-cols-[1fr_auto]">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                      <span className="size-1.5 rounded-full bg-primary" /> Next fixture
                    </span>
                    <h2 className="mt-4 font-heading text-3xl font-black sm:text-4xl">
                      {next.team} vs {next.opponent}
                    </h2>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-white/70">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="size-4 text-primary" /> {dayLabel(next.date)}
                      </span>
                      {next.venue && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="size-4 text-primary" /> {next.venue}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-6">
                    <img src="/img/logo/gksa-white.png" alt="GKSA" className="h-16 w-auto sm:h-20" />
                    <span className="font-heading text-2xl font-black text-white/40">VS</span>
                    <div className="flex size-16 items-center justify-center rounded-2xl border border-white/15 text-center text-xs font-semibold text-white/60 sm:size-20">
                      {next.opponent.split(" ")[0]}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          )}

          {/* fixtures + results */}
          <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading eyebrow="Upcoming" title={<>Fixtures.</>} />
              {fixtures.length === 0 ? (
                <EmptyState icon={CalendarDays} text="No upcoming fixtures for this filter yet." />
              ) : (
                <div className="mt-8 space-y-3">
                  {fixtures.map((f, i) => (
                    <Reveal key={f.id} delay={i % 4}>
                      <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
                        <DateBadge iso={f.date} />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-foreground">
                            {f.team} vs {f.opponent}
                          </p>
                          {f.venue && (
                            <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="size-3.5" /> {f.venue}
                            </p>
                          )}
                        </div>
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                          {f.team}
                        </span>
                      </div>
                    </Reveal>
                  ))}
                </div>
              )}
            </div>

            <div>
              <SectionHeading eyebrow="Recent" title={<>Results.</>} />
              {results.length === 0 ? (
                <EmptyState icon={Trophy} text="No results for this filter yet." />
              ) : (
                <div className="mt-8 space-y-3">
                  {results.map((r, i) => {
                    const o = matchOutcome(r);
                    const badge = o ? OUTCOME[o] : null;
                    return (
                      <Reveal key={r.id} delay={i % 4}>
                        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
                          <div className="flex flex-col items-center">
                            <span className="font-heading text-2xl font-black text-foreground">
                              {r.gf}-{r.ga}
                            </span>
                            {badge && (
                              <span className={cn("mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold", badge.cls)}>
                                {o}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-foreground">
                              {r.team} vs {r.opponent}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{dayLabel(r.date)}</p>
                          </div>
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                            {r.team}
                          </span>
                        </div>
                      </Reveal>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function DateBadge({ iso }: { iso: string }) {
  const d = new Date(iso);
  return (
    <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-ink text-white">
      <span className="text-[10px] font-semibold uppercase text-white/60">
        {d.toLocaleDateString("en-ZA", { month: "short" })}
      </span>
      <span className="font-heading text-xl font-black leading-none">{d.getDate()}</span>
    </div>
  );
}

function EmptyState({ icon: Icon, text }: { icon: typeof CalendarDays; text: string }) {
  return (
    <div className="mt-8 flex flex-col items-center gap-2 rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <Icon className="size-7 text-primary" />
      <p className="max-w-xs text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
