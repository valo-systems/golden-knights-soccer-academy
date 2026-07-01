import { Link } from "react-router-dom";
import { Trophy, ArrowRight } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

const SQUADS = [
  { age: "U9", img: "/img/photos/academy-02.jpg", note: "Foundation phase" },
  { age: "U11", img: "/img/photos/academy-05.jpg", note: "Development phase" },
  { age: "U13", img: "/img/photos/academy-06.webp", note: "Competitive phase" },
  { age: "U13+", img: "/img/photos/academy-03.webp", note: "Performance phase" },
];

export function Teams() {
  usePageMeta({
    title: "Our Teams",
    description:
      "Meet the Golden Knights squads: U9, U11, U13, and U13+ teams developing young footballers in Midrand.",
    path: "/teams",
  });

  return (
    <>
      <PageHero
        eyebrow="Our teams"
        title={
          <>
            Our <span className="text-primary">squads</span>
          </>
        }
        subtitle="Four age groups, one badge. Meet the teams developing the next generation."
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
          <Button asChild size="lg" className="mt-4">
            <Link to="/fixtures">
              See fixtures & results <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
