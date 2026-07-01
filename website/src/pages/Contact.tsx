import { useState } from "react";
import { usePageMeta } from "@/hooks/usePageMeta";
import {
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Instagram,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { Field, Input, Textarea, Select } from "@/components/ui/field";
import { CONTACTS, SITE } from "@/data/site";
import { useAdmin } from "@/admin/store";

const WHATSAPP = "https://wa.me/27781610670";
const MAP_SRC = "https://www.google.com/maps?q=Midrand,Gauteng,South+Africa&output=embed";

function ContactForm() {
  const { addProspect } = useAdmin();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    reason: "",
    message: "",
  });
  return (
    <div className="rounded-3xl border border-border bg-card p-7 sm:p-8">
      {sent ? (
        <div className="flex h-full min-h-80 flex-col items-center justify-center text-center">
          <CheckCircle2 className="size-14 text-primary" />
          <h3 className="mt-5 text-2xl font-bold text-foreground">Message sent!</h3>
          <p className="mt-2 max-w-xs text-muted-foreground">
            Thanks for reaching out. We will get back to you soon.
          </p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addProspect({
              parentName: form.name,
              phone: form.phone,
              email: form.email || undefined,
              source: "Contact",
              message: [`Reason: ${form.reason || "General enquiry"}`, form.message]
                .filter(Boolean)
                .join("\n"),
            });
            setSent(true);
          }}
          className="space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" required>
              <Input
                required
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Your name"
              />
            </Field>
            <Field label="Phone" required>
              <Input
                required
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="0xx xxx xxxx"
              />
            </Field>
          </div>
          <Field label="Email" required>
            <Input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="you@email.com"
            />
          </Field>
          <Field label="Reason">
            <Select
              value={form.reason}
              onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
            >
              <option value="" disabled>
                What is this about?
              </option>
              <option>Join the academy</option>
              <option>Sponsorship</option>
              <option>General enquiry</option>
            </Select>
          </Field>
          <Field label="Message" required>
            <Textarea
              required
              value={form.message}
              onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              placeholder="How can we help?"
            />
          </Field>
          <Button type="submit" size="lg" className="w-full">
            Send message <ArrowRight />
          </Button>
        </form>
      )}
    </div>
  );
}

export function Contact() {
  usePageMeta({
    title: "Contact Us",
    description:
      "Get in touch with Golden Knights Soccer Academy. Contact our coaching staff in Midrand, Gauteng. Phone, email, and WhatsApp available.",
    path: "/contact",
  });
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Get in <span className="text-primary">touch</span>
          </>
        }
        subtitle="Questions about joining, sponsoring, or anything else? We would love to hear from you."
      />

      <section className="bg-background py-20 sm:py-24">
        <div className="container-gk grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          {/* details */}
          <div>
            <h2 className="text-3xl text-foreground">Talk to the academy</h2>
            <p className="mt-3 text-muted-foreground">
              Reach us directly, or send a message and we will reply.
            </p>

            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex items-center gap-3 rounded-2xl bg-[#25D366] px-6 py-4 font-semibold text-white transition-transform hover:scale-[1.02]"
            >
              <MessageCircle className="size-5" /> Chat on WhatsApp
            </a>

            <div className="mt-8 space-y-4">
              {CONTACTS.map((c) => (
                <Reveal key={c.name}>
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <p className="font-bold text-foreground">{c.name}</p>
                    <p className="text-sm font-medium text-primary">{c.role}</p>
                    <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <Phone className="size-4 text-primary" /> {c.phone}
                      </p>
                      {c.email && (
                        <p className="flex items-center gap-2">
                          <Mail className="size-4 text-primary" /> {c.email}
                        </p>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" /> {SITE.location}
              </span>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 font-medium text-primary hover:underline"
              >
                <Instagram className="size-4" /> @goldenknightsfc
              </a>
            </div>
          </div>

          {/* form */}
          <ContactForm />
        </div>
      </section>

      {/* map */}
      <section className="bg-background pb-20">
        <div className="container-gk">
          <div className="overflow-hidden rounded-3xl border border-border">
            <iframe
              title="GKSA location, Midrand"
              src={MAP_SRC}
              className="h-[360px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="mt-3 text-center text-sm text-muted-foreground">
            Exact training base address is shared on enquiry.
          </p>
        </div>
      </section>
    </>
  );
}
