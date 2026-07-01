import { useRef } from "react";
import { Link } from "react-router-dom";
import { usePageMeta } from "@/hooks/usePageMeta";
import { motion, useScroll, useTransform } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Trophy,
  HeartHandshake,
  ShieldCheck,
  Quote,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading, Eyebrow } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { useAdmin } from "@/admin/store";
import { STATS, SITE } from "@/data/site";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ HERO */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[640px] overflow-hidden bg-ink">
      <motion.div style={{ y }} className="absolute inset-0">
        <img
          src="/img/photos/academy-01.jpg"
          alt="Golden Knights Soccer Academy players in action"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(12,13,16,0.96)_4%,rgba(12,13,16,0.45)_45%,rgba(12,13,16,0.75))]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(238,48,48,0.28),transparent_55%)]" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="container-gk relative flex h-full flex-col justify-end pb-20 pt-32"
      >
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
            <span className="size-1.5 rounded-full bg-primary" />
            {SITE.location} · Est. {SITE.founded}
          </span>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mt-6 max-w-4xl font-heading text-5xl font-black uppercase leading-[0.92] tracking-tight text-white text-balance sm:text-7xl lg:text-8xl"
        >
          Youth football coaching in <span className="text-primary">Midrand</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-6 max-w-xl text-lg text-white/75 text-pretty"
        >
          Book a trial for U9 to U13+, or sponsor a player.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <Button asChild size="lg">
            <Link to="/register">
              Book a Trial <ArrowRight />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/25 text-white hover:bg-white/10"
          >
            <Link to="/sponsors">Sponsor</Link>
          </Button>
        </motion.div>
      </motion.div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="flex h-10 w-6 justify-center rounded-full border border-white/30 pt-2"
        >
          <span className="h-2 w-1 rounded-full bg-white/60" />
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ STATS */
function Stats() {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="container-gk">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i}>
              <div className="flex h-full flex-col items-center justify-center bg-background px-6 py-12 text-center">
                <span className="font-heading text-5xl font-black tracking-tight text-foreground sm:text-6xl">
                  {s.value}
                </span>
                <span className="mt-2 text-sm font-medium text-muted-foreground">{s.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ WHO WE ARE */
function WhoWeAre() {
  return (
    <section className="bg-background pb-24">
      <div className="container-gk grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl">
              <img
                src="/img/photos/academy-04.jpg"
                alt="GKSA training session"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover object-top"
              />
            </div>
          </Reveal>
          <Reveal delay={2}>
            <div className="absolute -bottom-6 -right-2 w-44 rounded-2xl bg-primary p-5 text-primary-foreground shadow-xl sm:-right-6">
              <p className="font-heading text-4xl font-black">100+</p>
              <p className="text-sm/snug text-primary-foreground/90">
                players developed through the academy
              </p>
            </div>
          </Reveal>
        </div>

        <div>
          <SectionHeading
            eyebrow="Who we are"
            title={<>More than a football academy.</>}
            intro="Golden Knights Soccer Academy is a youth football development academy in Midrand, Gauteng. We combine professional coaching with discipline, leadership, and life skills to develop well-rounded young athletes."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Trophy, label: "Quality coaching" },
              { icon: ShieldCheck, label: "SAFA registered" },
              { icon: HeartHandshake, label: "Community outreach" },
            ].map((f, i) => (
              <Reveal key={f.label} delay={i}>
                <div className="rounded-2xl border border-border bg-card p-5">
                  <f.icon className="size-6 text-primary" />
                  <p className="mt-3 text-sm font-semibold">{f.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={3}>
            <Button asChild variant="dark" size="lg" className="mt-8">
              <Link to="/about">
                Read our story <ArrowRight />
              </Link>
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- PROGRAMMES */
const PROGRAMMES = [
  {
    age: "U9",
    focus: "Fundamentals, coordination & a love of the game.",
    img: "/img/photos/academy-02.jpg",
  },
  {
    age: "U11",
    focus: "Core skills, positions & small-sided games.",
    img: "/img/photos/academy-05.jpg",
  },
  {
    age: "U13",
    focus: "Tactical understanding & competitive play.",
    img: "/img/photos/academy-06.webp",
  },
  {
    age: "U13+",
    focus: "League & tournament performance pathway.",
    img: "/img/photos/academy-03.webp",
  },
];

function Programmes() {
  return (
    <section className="bg-secondary py-24 sm:py-28">
      <div className="container-gk">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Programmes"
            title={<>Structured football for every age.</>}
            intro="From first touches to competitive league football, every age group trains with purpose."
          />
          <Reveal>
            <Button asChild variant="outline" size="md">
              <Link to="/programmes">
                All programmes <ArrowRight />
              </Link>
            </Button>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROGRAMMES.map((p, i) => (
            <Reveal key={p.age} delay={i}>
              <Link
                to="/programmes"
                className="group relative block overflow-hidden rounded-3xl bg-ink"
              >
                <img
                  src={p.img}
                  alt={`${p.age} programme`}
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-60"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(12,13,16,0.9),transparent_60%)]" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="font-heading text-3xl font-black text-white">{p.age}</p>
                  <p className="mt-1 text-sm text-white/70">{p.focus}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Learn more <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- SPONSOR BAND */
function SponsorBand() {
  const { sponsors } = useAdmin();
  const approved = sponsors.filter((s) => s.status === "approved");

  return (
    <section className="relative overflow-hidden bg-primary py-24 text-primary-foreground sm:py-28">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-20" />
      <div className="container-gk relative grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Eyebrow light>Partnership</Eyebrow>
          <h2 className="mt-4 max-w-lg text-4xl text-white text-balance sm:text-5xl">
            Put your brand on our kit, our matches, and our community.
          </h2>
          <p className="mt-5 max-w-md text-white/85">
            Partnering with GKSA is an investment in youth development, community empowerment, and
            the future of South African football, with real, visible brand exposure in return.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="white">
              <Link to="/sponsors">
                See sponsorship options <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {approved.map((s, i) => (
            <Reveal key={s.id} delay={i}>
              <div className="flex aspect-video items-center justify-center rounded-2xl border border-white/25 bg-white p-3">
                {s.logo ? (
                  <img src={s.logo} alt={s.name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="font-display text-sm font-bold text-primary">{s.name}</span>
                )}
              </div>
            </Reveal>
          ))}
          {/* open slots to fill the grid */}
          {Array.from({ length: Math.max(0, 6 - approved.length) }).map((_, i) => (
            <Reveal key={`slot-${i}`} delay={approved.length + i}>
              <div
                className={cn(
                  "flex aspect-video items-center justify-center rounded-2xl border border-white/25 bg-white/10 px-3 text-center font-display text-sm font-semibold uppercase tracking-wide text-white/85 backdrop-blur",
                  i === Math.max(0, 6 - approved.length) - 1 && "border-dashed border-white/60 text-white"
                )}
              >
                Your brand
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ LATEST NEWS */
function LatestNews() {
  const { newsPosts } = useAdmin();
  const posts = newsPosts.slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section className="bg-background pt-24 sm:pt-28">
      <div className="container-gk">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Latest news"
            title={<>From the academy.</>}
            intro="Match reports, achievements, and announcements from the touchline."
          />
          <Reveal>
            <Button asChild variant="outline" size="md">
              <Link to="/news">
                All news <ArrowRight />
              </Link>
            </Button>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={i}>
              <Link
                to={`/news/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-shadow hover:shadow-xl"
              >
                <div className="overflow-hidden">
                  <img
                    src={post.img}
                    alt={post.title}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
                    <span className="rounded-full bg-accent px-2.5 py-1 text-accent-foreground">
                      {post.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Calendar className="size-3.5" /> {post.date}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl leading-snug text-foreground">{post.title}</h3>
                  <span className="mt-auto pt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Read more
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryTeaser() {
  const { galleryPhotos } = useAdmin();
  const photos = galleryPhotos.slice(0, 4);
  return (
    <div className="mt-8 grid grid-cols-2 gap-3">
      {photos.map((p, i) => (
        <Reveal key={p.id} delay={i}>
          <Link to="/gallery" className="group block overflow-hidden rounded-2xl">
            <img
              src={p.src}
              alt={p.caption ?? "Academy gallery"}
              loading="lazy"
              className={cn(
                "w-full object-cover transition-transform duration-500 group-hover:scale-105",
                i % 3 === 0 ? "aspect-square" : "aspect-[4/3]"
              )}
            />
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

/* ------------------------------------------------------- NEWS + GALLERY */
function NewsGalleryTeaser() {
  return (
    <section className="bg-background py-24 sm:py-28">
      <div className="container-gk grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        {/* social proof */}
        <div>
          <SectionHeading eyebrow="In the community" title={<>Aiming high, together.</>} />
          <Reveal delay={2}>
            <figure className="mt-8 rounded-3xl border border-border bg-card p-8">
              <Quote className="size-8 text-primary" />
              <blockquote className="mt-4 text-xl font-medium leading-relaxed text-foreground text-pretty">
                "Golden Knights Soccer Academy has taken the Midrand community by storm and aims to
                empower and help the youth to become international football stars."
              </blockquote>
              <figcaption className="mt-5 text-sm text-muted-foreground">
                , The Citizen · Midrand Reporter
              </figcaption>
            </figure>
          </Reveal>
          <Reveal delay={3}>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              Follow @goldenknightsfc <ArrowUpRight className="size-4" />
            </a>
          </Reveal>
        </div>

        {/* gallery teaser */}
        <div>
          <div className="flex items-end justify-between">
            <SectionHeading eyebrow="Gallery" title={<>Academy life.</>} />
            <Reveal>
              <Button asChild variant="ghost" size="sm">
                <Link to="/gallery">
                  View all <ArrowRight />
                </Link>
              </Button>
            </Reveal>
          </div>
          <GalleryTeaser />
        </div>
      </div>
    </section>
  );
}

export function Home() {
  usePageMeta({
    title: "Youth Football Coaching in Midrand",
    description:
      "Golden Knights Soccer Academy, quality youth football coaching in Midrand, Gauteng. Book a trial for U9–U13+ or become a sponsor today.",
    path: "/",
  });
  return (
    <>
      <Hero />
      <Stats />
      <WhoWeAre />
      <Programmes />
      <SponsorBand />
      <LatestNews />
      <NewsGalleryTeaser />
    </>
  );
}
