import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Target, Compass, Newspaper, Mic, Quote } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { VALUES, CONTACTS, SITE } from "@/data/site";

const ARTICLE_URL =
  "https://www.citizen.co.za/midrand-reporter/sports-news/2017/03/29/golden-knights-soccer-academy-in-midrand-aims-high/";
const PODCAST_URL = "https://iono.fm/e/900317";
const PODCAST_EMBED = "https://embed.iono.fm/epi/900317";

/* ------------------------------------------------------------------ HERO */
function AboutHero() {
  return (
    <PageHero
      eyebrow="About the academy"
      title={
        <>
          Who we <span className="text-primary">are</span>
        </>
      }
      subtitle="A youth football academy built in Midrand, developing players, people, and a community."
      image="/img/photos/academy-06.webp"
      imagePosition="top"
    />
  );
}

/* ------------------------------------------------------------- OUR STORY */
function OurStory() {
  return (
    <section className="bg-background py-24 sm:py-28">
      <div className="container-gk grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
          <SectionHeading
            eyebrow="Our story"
            title={<>From a small group to a Midrand institution.</>}
          />
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted-foreground text-pretty">
            <p>
              Golden Knights Soccer Academy was established in {SITE.founded} by Head Coach Katlego
              Ntsheke to give young footballers access to quality coaching, structured development,
              and competitive opportunities.
            </p>
            <p>
              What began as a small group registered with SAFA through the North Rand Football
              Association has grown into a respected platform supporting over 100 players, and
              positively impacting their families and communities through sport.
            </p>
            <p>
              From the start, the academy has reached beyond the field: supporting children from
              surrounding communities through its outreach programme, and helping young people grow
              in discipline, confidence, and character.
            </p>
          </div>
        </div>

        <div className="relative order-1 lg:order-2">
          <Reveal>
            <div className="overflow-hidden rounded-3xl">
              <img
                src="/img/photos/academy-01.jpg"
                alt="GKSA players"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover object-top"
              />
            </div>
          </Reveal>
          <Reveal delay={2}>
            <div className="absolute -bottom-6 -left-2 rounded-2xl bg-ink p-5 text-white shadow-xl sm:-left-6">
              <p className="font-heading text-3xl font-black">Est. {SITE.founded}</p>
              <p className="text-sm text-white/70">Midrand, Gauteng</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------- VISION & MISSION */
function VisionMission() {
  const cards = [
    {
      icon: Compass,
      label: "Our vision",
      text: "To become one of South Africa's leading youth football development academies and a recognised pathway for talented players to progress to higher levels of football.",
    },
    {
      icon: Target,
      label: "Our mission",
      text: "To develop skilled, disciplined, and confident young athletes through quality coaching, mentorship, and holistic player development.",
    },
  ];
  return (
    <section className="bg-secondary py-24 sm:py-28">
      <div className="container-gk grid gap-6 md:grid-cols-2">
        {cards.map((c, i) => (
          <Reveal key={c.label} delay={i}>
            <div className="h-full rounded-3xl border border-border bg-card p-8 sm:p-10">
              <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <c.icon className="size-6" />
              </div>
              <h3 className="mt-6 font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                {c.label}
              </h3>
              <p className="mt-3 text-xl leading-relaxed text-foreground text-pretty">{c.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- VALUES */
function CoreValues() {
  return (
    <section className="bg-background py-24 sm:py-28">
      <div className="container-gk">
        <SectionHeading
          align="center"
          eyebrow="What we stand for"
          title={<>Our core values.</>}
          intro="Seven principles that shape every session, match, and player."
        />
        <div className="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-3">
          {VALUES.map((v, i) => (
            <Reveal key={v} delay={i} as="span">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 font-display text-lg font-semibold uppercase tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary">
                <span className="size-1.5 rounded-full bg-primary" />
                {v}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- COACHES */
function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
}

function Coaches() {
  return (
    <section className="bg-secondary py-24 sm:py-28">
      <div className="container-gk">
        <SectionHeading
          eyebrow="The team"
          title={<>Coaches &amp; staff.</>}
          intro="The people behind the academy, putting faces to the badge."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CONTACTS.map((c, i) => (
            <Reveal key={c.name} delay={i}>
              <div className="h-full rounded-3xl border border-border bg-card p-7">
                <div className="flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#ee3030,#b41f1f)] py-10">
                  <span className="font-heading text-4xl font-black text-white">
                    {initials(c.name)}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold text-foreground">{c.name}</h3>
                <p className="text-sm font-medium text-primary">
                  {c.role}
                  {c.role === "Head Coach" ? " & Founder" : ""}
                </p>
                <div className="mt-4 space-y-1 text-sm text-muted-foreground">
                  <p>{c.phone}</p>
                  {c.email && <p className="break-all">{c.email}</p>}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={1}>
          <p className="mt-6 text-sm text-muted-foreground">
            Photos and full bios can be added here as we gather them.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- IN THE MEDIA */
function InMedia() {
  return (
    <section className="bg-background py-24 sm:py-28">
      <div className="container-gk">
        <SectionHeading
          eyebrow="In the media"
          title={<>Recognised beyond the touchline.</>}
          intro="Real, third-party coverage of the academy and its founder."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Citizen article */}
          <Reveal>
            <a
              href={ARTICLE_URL}
              target="_blank"
              rel="noreferrer"
              className="group flex h-full flex-col rounded-3xl border border-border bg-card p-8 transition-shadow hover:shadow-xl"
            >
              <div className="flex items-center gap-3 text-primary">
                <Newspaper className="size-6" />
                <span className="font-display text-sm font-semibold uppercase tracking-[0.2em]">
                  The Citizen · Midrand Reporter
                </span>
              </div>
              <Quote className="mt-6 size-7 text-border" />
              <blockquote className="mt-3 text-xl font-medium leading-relaxed text-foreground text-pretty">
                "Golden Knights Soccer Academy has taken the Midrand community by storm and aims to
                empower and help the youth to become international football stars."
              </blockquote>
              <span className="mt-auto pt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Read the article
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </a>
          </Reveal>

          {/* Podcast */}
          <Reveal delay={1}>
            <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-8">
              <div className="flex items-center gap-3 text-primary">
                <Mic className="size-6" />
                <span className="font-display text-sm font-semibold uppercase tracking-[0.2em]">
                  Soccer Laduma · Podcast
                </span>
              </div>
              <h3 className="mt-6 text-xl font-bold text-foreground text-pretty">
                Football Academy Spotlight: Katleho Ntsekhe's Golden Knights
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                The founder breaks down the challenges of running a grassroots youth development
                programme.
              </p>
              <div className="mt-5 overflow-hidden rounded-xl border border-border">
                <iframe
                  title="Soccer Laduma podcast, Golden Knights"
                  src={PODCAST_EMBED}
                  className="h-[140px] w-full"
                  loading="lazy"
                />
              </div>
              <a
                href={PODCAST_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                Open on iono.fm <ArrowUpRight className="size-4" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- CLOSING CTA */
function ClosingCTA() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-white sm:py-28">
      <div className="absolute inset-0">
        <img
          src="/img/photos/academy-05.jpg"
          alt=""
          aria-hidden
          loading="lazy"
          className="h-full w-full object-cover object-center opacity-20"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(12,13,16,0.95),rgba(12,13,16,0.6))]" />
      </div>
      <div className="container-gk relative text-center">
        <h2 className="mx-auto max-w-2xl text-4xl text-white text-balance sm:text-5xl">
          Want to be part of the story?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-white/70">
          Join the academy as a player, or partner with us as a sponsor.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/register">
              Join the Academy <ArrowRight />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/25 text-white hover:bg-white/10"
          >
            <Link to="/sponsors">Become a Sponsor</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function About() {
  usePageMeta({
    title: "About the Academy",
    description:
      "Learn about Golden Knights Soccer Academy — our story, values, coaching staff, and commitment to developing young footballers in Midrand since 2016.",
    path: "/about",
  });
  return (
    <>
      <AboutHero />
      <OurStory />
      <VisionMission />
      <CoreValues />
      <Coaches />
      <InMedia />
      <ClosingCTA />
    </>
  );
}
