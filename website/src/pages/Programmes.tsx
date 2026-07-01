import { Link } from "react-router-dom";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useAdmin } from "@/admin/store";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  ShieldCheck,
  Users,
  HeartHandshake,
  ClipboardCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading, Eyebrow } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { formatZAR } from "@/lib/utils";

/* ------------------------------------------------------------------ HERO */
function ProgrammesHero() {
  return (
    <PageHero
      eyebrow="Programmes"
      title={
        <>
          Football for <span className="text-primary">every age</span>
        </>
      }
      subtitle="Structured development built on skill, discipline, and fun, from first touches to competitive league football."
      image="/img/photos/academy-02.jpg"
      actions={
        <Button asChild size="lg">
          <Link to="/register">
            Book a trial <ArrowRight />
          </Link>
        </Button>
      }
    />
  );
}

/* --------------------------------------------------------------- OVERVIEW */
function Overview() {
  return (
    <section className="bg-background py-24 sm:py-28">
      <div className="container-gk grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <SectionHeading
          eyebrow="The approach"
          title={<>We develop more than footballers.</>}
          intro="Our programmes combine professional coaching with discipline, leadership, teamwork, and personal growth, so every player improves on the field and grows off it."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              icon: Sparkles,
              t: "Skill development",
              d: "Technical training matched to each age and level.",
            },
            { icon: Users, t: "Teamwork", d: "Small-sided games and real match experience." },
            {
              icon: ShieldCheck,
              t: "Discipline",
              d: "Structure, respect, and consistency every session.",
            },
            {
              icon: HeartHandshake,
              t: "Character",
              d: "Leadership and life skills that last beyond football.",
            },
          ].map((f, i) => (
            <Reveal key={f.t} delay={i}>
              <div className="h-full rounded-2xl border border-border bg-card p-6">
                <f.icon className="size-6 text-primary" />
                <p className="mt-4 font-bold text-foreground">{f.t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ AGE GROUPS */
const GROUPS = [
  {
    age: "U9",
    focus: "Fundamentals, coordination, and a love of the game.",
    img: "/img/photos/academy-02.jpg",
  },
  {
    age: "U11",
    focus: "Core skills, positions, and small-sided games.",
    img: "/img/photos/academy-05.jpg",
  },
  {
    age: "U13",
    focus: "Tactical understanding and competitive play.",
    img: "/img/photos/academy-06.webp",
  },
  {
    age: "U13+",
    focus: "League and tournament performance pathway.",
    img: "/img/photos/academy-03.webp",
  },
];

function AgeGroups() {
  return (
    <section className="bg-secondary py-24 sm:py-28">
      <div className="container-gk">
        <SectionHeading
          eyebrow="Age groups"
          title={<>Find your child&apos;s group.</>}
          intro="Each group trains with purpose at its own level. Exact age bands and schedules are confirmed with the head coach."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {GROUPS.map((g, i) => (
            <Reveal key={g.age} delay={i}>
              <div className="group h-full overflow-hidden rounded-3xl border border-border bg-card">
                <div className="relative overflow-hidden">
                  <img
                    src={g.img}
                    alt={`${g.age} programme`}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 font-heading text-lg font-black text-white">
                    {g.age}
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-sm leading-relaxed text-muted-foreground">{g.focus}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- TYPICAL WEEK */
function TypicalWeek() {
  const items = [
    {
      icon: CalendarDays,
      t: "Regular training",
      d: "Weekday sessions, with matches and tournaments on weekends.",
    },
    {
      icon: MapPin,
      t: "Midrand base",
      d: "Training at our Midrand venue. Exact location shared on enquiry.",
    },
    {
      icon: ShieldCheck,
      t: "Structured coaching",
      d: "Age-appropriate sessions led by qualified coaches.",
    },
    {
      icon: Users,
      t: "Real matches",
      d: "SAFA-affiliated league games through the North Rand FA.",
    },
  ];
  return (
    <section className="bg-background py-24 sm:py-28">
      <div className="container-gk">
        <SectionHeading eyebrow="A typical week" title={<>What training looks like.</>} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={it.t} delay={i}>
              <div className="h-full rounded-3xl border border-border bg-card p-7">
                <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <it.icon className="size-6" />
                </div>
                <p className="mt-5 font-bold text-foreground">{it.t}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{it.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- HOW TO JOIN */
function HowToJoin() {
  const { fees } = useAdmin();

  return (
    <section className="bg-ink py-20 text-white sm:py-24">
      <div className="container-gk">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-white/10 bg-white/[0.04] p-8 sm:p-10 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <ClipboardCheck className="mt-1 size-6 shrink-0 text-primary" />
              <div>
                <h2 className="text-2xl text-white sm:text-3xl">Ready to start? Book a trial.</h2>
                <p className="mt-2 max-w-xl text-white/70">
                  Membership is {formatZAR(fees.monthlyFeeCents)} per month for all age groups,
                  with a once-off {formatZAR(fees.joiningFeeCents)} joining fee. Financial
                  assistance is available for players who need support to take part.
                </p>
              </div>
            </div>
            <Button asChild size="lg" className="shrink-0">
              <Link to="/register">
                Book a trial <ArrowRight />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- OUTREACH */
function Outreach() {
  return (
    <section className="bg-background py-24 sm:py-28">
      <div className="container-gk">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-8 text-primary-foreground sm:p-12">
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-15" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <Eyebrow light>Outreach programme</Eyebrow>
              <h2 className="mt-4 max-w-xl text-3xl text-white text-balance sm:text-4xl">
                Giving every talented player a chance.
              </h2>
              <p className="mt-4 max-w-lg text-white/85">
                Through our outreach programme, GKSA supports children from surrounding communities,
                giving young players who face financial barriers the chance to train, compete, and
                belong.
              </p>
              <Button asChild size="lg" variant="white" className="mt-7">
                <Link to="/sponsors">
                  Support our outreach <ArrowRight />
                </Link>
              </Button>
            </div>
            <div className="hidden overflow-hidden rounded-2xl lg:block">
              <img
                src="/img/photos/academy-04.jpg"
                alt="GKSA outreach"
                loading="lazy"
                className="aspect-square w-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Programmes() {
  usePageMeta({
    title: "Football Programmes for U9–U13+",
    description:
      "Structured youth football programmes for every age group. From first touches at U9 to competitive league football at U13+. Based in Midrand, Gauteng.",
    path: "/programmes",
  });
  return (
    <>
      <ProgrammesHero />
      <Overview />
      <AgeGroups />
      <TypicalWeek />
      <HowToJoin />
      <Outreach />
    </>
  );
}
