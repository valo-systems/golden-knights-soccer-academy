import { useState } from "react";
import { Link } from "react-router-dom";
import { usePageMeta } from "@/hooks/usePageMeta";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowLeft, CheckCircle2, ClipboardCheck, MessageCircle } from "lucide-react";
import { useAdmin } from "@/admin/store";
import { ageGroupFromDob } from "@/admin/types";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { StepProgress } from "@/components/ui/step-progress";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { SITE } from "@/data/site";
import { formatZAR } from "@/lib/utils";

type Data = {
  childFirst: string;
  childLast: string;
  dob: string;
  position: string;
  parentName: string;
  phone: string;
  email: string;
  heard: string;
  message: string;
  photoConsent: boolean;
  consent: boolean;
};

const EMPTY: Data = {
  childFirst: "",
  childLast: "",
  dob: "",
  position: "",
  parentName: "",
  phone: "",
  email: "",
  heard: "",
  message: "",
  photoConsent: false,
  consent: false,
};

const STEPS = ["Child", "Parent", "Trial"];

export function Register() {
  const { addProspect, fees } = useAdmin();
  usePageMeta({
    title: "Book a Trial",
    description:
      "Book a free trial for your child at Golden Knights Soccer Academy in Midrand. Open to players aged U9 to U13+. SAFA registered academy.",
    path: "/register",
  });
  const [step, setStep] = useState(0);
  const [d, setD] = useState<Data>(EMPTY);
  const [sent, setSent] = useState(false);
  const set = (k: keyof Data, v: string | boolean) => setD((p) => ({ ...p, [k]: v }));

  const canNext =
    step === 0
      ? d.childFirst && d.childLast && d.dob
      : step === 1
        ? d.parentName && d.phone
        : d.consent;

  const next = () => setStep((s) => Math.min(2, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <>
      <PageHero
        eyebrow="Book a trial"
        title={
          <>
            Book a trial in <span className="text-primary">3 steps</span>
          </>
        }
        subtitle="For players U9 to U13+. All backgrounds welcome. Takes about a minute."
        image="/img/photos/academy-02.jpg"
      />

      <section className="bg-background py-16 sm:py-20">
        <div className="container-gk grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          {/* wizard */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            {sent ? (
              <div className="flex min-h-[26rem] flex-col items-center justify-center text-center">
                <CheckCircle2 className="size-16 text-primary" />
                <h2 className="mt-5 text-2xl font-bold text-foreground">Trial booked!</h2>
                <p className="mt-2 max-w-sm text-muted-foreground">
                  Thanks {d.parentName.split(" ")[0] || "there"}. We will contact you to confirm a
                  session.
                </p>
                <Button asChild className="mt-6" variant="outline">
                  <Link to="/programmes">View programmes</Link>
                </Button>
              </div>
            ) : (
              <>
                {/* progress */}
                <StepProgress steps={STEPS} current={step} />

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (step < 2) {
                      next();
                    } else if (canNext) {
                      const details = [
                        d.position ? `Preferred position: ${d.position}` : "",
                        d.heard ? `Heard about us via: ${d.heard}` : "",
                        d.message,
                      ]
                        .filter(Boolean)
                        .join("\n");
                      addProspect({
                        childFirst: d.childFirst,
                        childLast: d.childLast,
                        dob: d.dob,
                        parentName: d.parentName,
                        phone: d.phone,
                        email: d.email || undefined,
                        source: "Trial form",
                        message: details || undefined,
                        photoConsent: d.photoConsent,
                      });
                      setSent(true);
                    }
                  }}
                  className="mt-8"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4"
                    >
                      {step === 0 && (
                        <>
                          <h3 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                            Child details
                          </h3>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="First name" required>
                              <Input
                                value={d.childFirst}
                                onChange={(e) => set("childFirst", e.target.value)}
                                placeholder="First name"
                              />
                            </Field>
                            <Field label="Last name" required>
                              <Input
                                value={d.childLast}
                                onChange={(e) => set("childLast", e.target.value)}
                                placeholder="Last name"
                              />
                            </Field>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <Field
                              label="Date of birth"
                              required
                              hint="Sets the suggested age group."
                            >
                              <Input
                                type="date"
                                value={d.dob}
                                onChange={(e) => set("dob", e.target.value)}
                              />
                            </Field>
                            <Field label="Suggested age group">
                              <Input
                                readOnly
                                value={ageGroupFromDob(d.dob) ?? ""}
                                placeholder="Set by date of birth"
                              />
                            </Field>
                          </div>
                          <Field label="Position" optional>
                            <Input
                              value={d.position}
                              onChange={(e) => set("position", e.target.value)}
                              placeholder="e.g. Midfielder"
                            />
                          </Field>
                        </>
                      )}

                      {step === 1 && (
                        <>
                          <h3 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                            Parent / guardian
                          </h3>
                          <Field label="Your name" required>
                            <Input
                              value={d.parentName}
                              onChange={(e) => set("parentName", e.target.value)}
                              placeholder="Parent or guardian name"
                            />
                          </Field>
                          <Field
                            label="WhatsApp / phone"
                            required
                            hint="We will usually reach out on WhatsApp first."
                          >
                            <Input
                              value={d.phone}
                              onChange={(e) => set("phone", e.target.value)}
                              placeholder="0xx xxx xxxx"
                            />
                          </Field>
                          <Field label="Email" optional>
                            <Input
                              type="email"
                              value={d.email}
                              onChange={(e) => set("email", e.target.value)}
                              placeholder="you@email.com"
                            />
                          </Field>
                        </>
                      )}

                      {step === 2 && (
                        <>
                          <h3 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                            Trial preference
                          </h3>
                          <Field label="How did you hear about us?" optional>
                            <Select value={d.heard} onChange={(e) => set("heard", e.target.value)}>
                              <option value="">Select an option</option>
                              <option>Instagram</option>
                              <option>Word of mouth</option>
                              <option>Community event</option>
                              <option>Search</option>
                              <option>Other</option>
                            </Select>
                          </Field>
                          <Field label="Anything you would like us to know?" optional>
                            <Textarea
                              value={d.message}
                              onChange={(e) => set("message", e.target.value)}
                              placeholder="Questions, preferred days, etc."
                            />
                          </Field>
                          <div className="rounded-2xl border border-border bg-secondary p-4">
                            <p className="font-bold text-foreground">Fees when joining</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {formatZAR(fees.monthlyFeeCents)} per month plus a once-off{" "}
                              {formatZAR(fees.joiningFeeCents)} joining fee.
                            </p>
                          </div>
                          <label className="flex items-start gap-3 rounded-2xl border border-border bg-secondary p-4 text-sm text-muted-foreground">
                            <input
                              type="checkbox"
                              checked={d.photoConsent}
                              onChange={(e) => set("photoConsent", e.target.checked)}
                              className="mt-0.5 size-4 accent-[#ee3030]"
                            />
                            <span>
                              <span className="font-semibold text-foreground">Photo consent (optional).</span>{" "}
                              I give Golden Knights Soccer Academy permission to photograph and/or
                              video my child during training sessions, matches, and academy events,
                              and to publish these images on the academy website and social media.
                              Images will not include full names or personal details. You can
                              withdraw this consent at any time by contacting the academy.
                            </span>
                          </label>
                          <label className="flex items-start gap-3 text-sm text-muted-foreground">
                            <input
                              type="checkbox"
                              checked={d.consent}
                              onChange={(e) => set("consent", e.target.checked)}
                              className="mt-1 size-4 accent-[#ee3030]"
                            />
                            <span>
                              I consent to GKSA storing these details to process this trial booking,
                              in line with POPIA.
                            </span>
                          </label>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-8 flex items-center justify-between gap-3">
                    {step > 0 ? (
                      <Button type="button" variant="outline" size="md" onClick={back}>
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
                          Book the trial <ArrowRight />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* side */}
          <div>
            <h2 className="text-3xl text-foreground">What happens next</h2>
            <div className="mt-6 space-y-4">
              {[
                {
                  n: "01",
                  t: "We confirm a trial",
                  d: "We reach out (usually on WhatsApp) to set up a session.",
                },
                {
                  n: "02",
                  t: "Your child attends",
                  d: "They train with the group and meet the coaches.",
                },
                { n: "03", t: "Complete registration", d: "Finalise and join the team." },
              ].map((s) => (
                <div key={s.n} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
                  <span className="font-heading text-3xl font-black text-primary">{s.n}</span>
                  <div>
                    <p className="font-bold text-foreground">{s.t}</p>
                    <p className="text-sm text-muted-foreground">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#25D366] px-5 py-3 font-semibold text-white transition-transform hover:scale-[1.02]"
            >
              <MessageCircle className="size-5" /> Prefer WhatsApp? Message us
            </a>

            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-secondary p-6">
              <ClipboardCheck className="mt-0.5 size-6 shrink-0 text-primary" />
              <p className="text-sm text-muted-foreground">
                Academy membership is {formatZAR(fees.monthlyFeeCents)} per month for all age
                groups, plus a once-off {formatZAR(fees.joiningFeeCents)} joining fee when your
                child joins. Online payment can be added in the future; for now, the academy
                records payment in the admin portal.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
