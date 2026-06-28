import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePageMeta } from "@/hooks/usePageMeta";
import {
  ArrowRight,
  ArrowLeft,
  Download,
  Eye,
  Megaphone,
  HeartHandshake,
  Star,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { StepProgress } from "@/components/ui/step-progress";
import { SectionHeading, Eyebrow } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Field, Input, Textarea } from "@/components/ui/field";
import { SPONSOR_TIERS, STATS, CONTACTS } from "@/data/site";
import { cn } from "@/lib/utils";

const PROPOSAL = "/sponsorship-proposal.pdf";

/* --------------------------------------------------------------------- HERO */
function Hero() {
  return (
    <PageHero
      eyebrow="Sponsor a player"
      title={
        <>
          Back the next <span className="text-primary">generation</span>
        </>
      }
      subtitle="Fund kit, training equipment, tournaments, or player support, and put your brand on our kit, at our matches, and across our community."
      image="/img/photos/academy-03.webp"
      actions={
        <>
          <Button asChild size="lg" variant="white">
            <a href={PROPOSAL} download>
              <Download /> Download the proposal
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/25 text-white hover:bg-white/10"
          >
            <a href="#enquire">Become a sponsor</a>
          </Button>
        </>
      }
    />
  );
}

/* ------------------------------------------------------------------- IMPACT */
function Impact() {
  const benefits = [
    {
      icon: Eye,
      t: "Brand visibility",
      d: "On kit, banners, gazebos, and across our digital platforms.",
    },
    {
      icon: Megaphone,
      t: "Community engagement",
      d: "Activations and campaigns at events and tournaments.",
    },
    {
      icon: HeartHandshake,
      t: "Social investment",
      d: "Measurable impact on youth, sport, and community.",
    },
  ];
  return (
    <section className="bg-background py-24 sm:py-28">
      <div className="container-gk grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Why partner"
            title={<>An investment with a real return.</>}
            intro="Your support goes directly to quality equipment, field rent, tournament fees, and players who need help to take part."
          />
          <div className="mt-8 space-y-4">
            {benefits.map((b, i) => (
              <Reveal key={b.t} delay={i}>
                <div className="flex gap-4 rounded-2xl border border-border bg-card p-5">
                  <div className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <b.icon className="size-5" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{b.t}</p>
                    <p className="text-sm text-muted-foreground">{b.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 self-start rounded-3xl bg-ink p-8 text-white">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i}>
              <div className="py-4 text-center">
                <p className="font-heading text-4xl font-black text-primary sm:text-5xl">
                  {s.value}
                </p>
                <p className="mt-1 text-xs text-white/60">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- TIERS */
function Tiers({ onChoose }: { onChoose: (tier: string) => void }) {
  return (
    <section className="bg-secondary py-24 sm:py-28">
      <div className="container-gk">
        <SectionHeading
          align="center"
          eyebrow="Sponsorship tiers"
          title={<>Choose your level of impact.</>}
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SPONSOR_TIERS.map((t, i) => (
            <Reveal key={t.name} delay={i}>
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-3xl border bg-card p-8",
                  t.featured
                    ? "border-primary shadow-[0_20px_50px_-20px_rgba(238,48,48,0.6)]"
                    : "border-border"
                )}
              >
                {t.featured && (
                  <span className="absolute -top-3 left-8 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                    <Star className="size-3" /> Most impact
                  </span>
                )}
                <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-foreground">
                  {t.name}
                </h3>
                <p className="mt-2 font-heading text-4xl font-black text-primary">{t.amount}</p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {t.benefits}
                </p>
                <Button
                  onClick={() => onChoose(t.name)}
                  variant={t.featured ? "primary" : "outline"}
                  size="md"
                  className="mt-6"
                >
                  Choose this level
                </Button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- CURRENT PARTNERS */
function CurrentPartners() {
  return (
    <section className="bg-background py-24 sm:py-28">
      <div className="container-gk">
        <SectionHeading
          eyebrow="Our partners"
          title={<>The brands behind our players.</>}
          intro="These businesses invest in youth development and earn real, visible recognition at every session, match, and tournament."
        />

        {/* Agape Water — featured partner card */}
        <Reveal>
          <div className="mt-12 overflow-hidden rounded-3xl border border-border bg-card">
            <div className="grid lg:grid-cols-[1fr_1.4fr]">
              {/* logo panel */}
              <div className="flex items-center justify-center bg-white px-12 py-14">
                <img
                  src="/img/sponsors/agape-water-logo.png"
                  alt="Agape Water"
                  loading="lazy"
                  className="w-full max-w-[220px]"
                />
              </div>

              {/* detail panel */}
              <div className="flex flex-col justify-center p-8 sm:p-10">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  <span className="size-1.5 rounded-full bg-primary" />
                  Official hydration partner
                </span>
                <h3 className="mt-4 font-heading text-3xl font-black text-foreground">
                  Agape Water
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  Agape Water supplies premium mineral water to our players and coaching staff at
                  every training session and match day. Keeping Golden Knights hydrated and
                  performing at their best, from first whistle to final whistle.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-6 sm:grid-cols-3">
                  {[
                    { label: "Hydration", detail: "Every match day" },
                    { label: "Training", detail: "Every session" },
                    { label: "Tournaments", detail: "Full season" },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-sm font-bold text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* open slots */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {["Platinum", "Golden", "Silver"].map((tier, i) => (
            <Reveal key={tier} delay={i}>
              <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border bg-card px-6 py-10 text-center transition-colors hover:border-primary/40">
                <div className="flex size-12 items-center justify-center rounded-2xl border border-dashed border-border">
                  <span className="text-xl">+</span>
                </div>
                <div>
                  <p className="font-display text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    {tier} sponsor
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Your brand here</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* matchday photo strip */}
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {["academy-01.jpg", "academy-05.jpg", "academy-02.jpg", "academy-06.webp"].map(
            (file, i) => (
              <Reveal key={file} delay={i}>
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src={`/img/photos/${file}`}
                    alt="Match day"
                    loading="lazy"
                    className="aspect-square w-full object-cover object-center"
                  />
                </div>
              </Reveal>
            )
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ ENQUIRY STEPPER */
const STEPS = ["Tier", "Contact", "Message"];

function Enquiry({
  selected,
  setSelected,
}: {
  selected: string;
  setSelected: (v: string) => void;
}) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const canNext = step === 0 ? !!selected : step === 1 ? !!(name && email) : true;
  const next = () => setStep((s) => Math.min(2, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <section id="enquire" className="bg-ink py-24 text-white sm:py-28">
      <div className="container-gk grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <Eyebrow light>Become a sponsor</Eyebrow>
          <h2 className="mt-4 text-4xl text-white text-balance sm:text-5xl">
            Let&apos;s build something together.
          </h2>
          <p className="mt-4 max-w-md text-white/70">
            Tell us what you have in mind. Prefer the full details first? Download the proposal.
          </p>
          <Button asChild size="lg" variant="white" className="mt-6">
            <a href={PROPOSAL} download>
              <Download /> Download the proposal (PDF)
            </a>
          </Button>
          <div className="mt-10 space-y-3 border-t border-white/10 pt-8">
            {CONTACTS.map((c) => (
              <div key={c.name} className="text-sm">
                <p className="font-semibold text-white">
                  {c.name} <span className="font-normal text-white/50">· {c.role}</span>
                </p>
                <p className="text-white/60">
                  {c.phone}
                  {c.email ? ` · ${c.email}` : ""}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          {sent ? (
            <div className="flex min-h-80 flex-col items-center justify-center text-center">
              <CheckCircle2 className="size-14 text-primary" />
              <h3 className="mt-5 text-2xl font-bold text-white">Thank you!</h3>
              <p className="mt-2 max-w-xs text-white/60">
                Your enquiry has been noted. The academy will be in touch shortly.
              </p>
            </div>
          ) : (
            <>
              <StepProgress steps={STEPS} current={step} light />

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (step < 2) next();
                  else setSent(true);
                }}
                className="mt-8 [&_label]:text-white/80 [&_input]:border-white/15 [&_input]:bg-white/5 [&_input]:text-white [&_textarea]:border-white/15 [&_textarea]:bg-white/5 [&_textarea]:text-white"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3"
                  >
                    {step === 0 && (
                      <>
                        <p className="text-sm font-semibold text-white/80">
                          Which level interests you?
                        </p>
                        <div className="grid gap-2">
                          {SPONSOR_TIERS.map((t) => (
                            <button
                              type="button"
                              key={t.name}
                              onClick={() => setSelected(t.name)}
                              className={cn(
                                "flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                                selected === t.name
                                  ? "border-primary bg-primary/15 text-white"
                                  : "border-white/15 bg-white/5 text-white/75 hover:border-white/30"
                              )}
                            >
                              <span className="font-semibold">{t.name}</span>
                              <span className="text-white/60">{t.amount}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                    {step === 1 && (
                      <>
                        <Field label="Name" required>
                          <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                          />
                        </Field>
                        <Field label="Company" optional>
                          <Input placeholder="Company name" />
                        </Field>
                        <Field label="Email" required>
                          <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@company.com"
                          />
                        </Field>
                        <Field label="Phone" optional>
                          <Input placeholder="0xx xxx xxxx" />
                        </Field>
                      </>
                    )}
                    {step === 2 && (
                      <>
                        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                          Interested in:{" "}
                          <span className="font-semibold text-white">
                            {selected || "Not selected"}
                          </span>
                        </div>
                        <Field label="Message" optional>
                          <Textarea placeholder="Tell us a little about what you have in mind" />
                        </Field>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="mt-7 flex items-center justify-between gap-3">
                  {step > 0 ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      className="border-white/20 text-white hover:bg-white/10"
                      onClick={back}
                    >
                      <ArrowLeft /> Back
                    </Button>
                  ) : (
                    <span />
                  )}
                  <Button type="submit" size="md" disabled={!canNext}>
                    {step < 2 ? (
                      <>
                        Continue <ArrowRight />
                      </>
                    ) : (
                      <>
                        Send enquiry <ArrowRight />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export function Sponsors() {
  usePageMeta({
    title: "Sponsor a Player",
    description:
      "Partner with Golden Knights Soccer Academy. Sponsorship packages from R5,000 to R100,000 with brand exposure on kit, banners, social media, and the website.",
    path: "/sponsors",
  });
  const [selected, setSelected] = useState("");
  const choose = (tier: string) => {
    setSelected(tier);
    document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <Hero />
      <Impact />
      <Tiers onChoose={choose} />
      <CurrentPartners />
      <Enquiry selected={selected} setSelected={setSelected} />
    </>
  );
}
