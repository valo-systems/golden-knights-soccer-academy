import { Link } from "react-router-dom";
import { Instagram, ArrowUpRight } from "lucide-react";
import { NAV, SITE } from "@/data/site";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />

      {/* CTA band */}
      <div className="relative border-b border-white/10">
        <div className="container-gk flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
          <h3 className="max-w-xl text-3xl text-white sm:text-4xl">
            Back the next generation of <span className="text-primary">Midrand football.</span>
          </h3>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/sponsors">Become a Sponsor</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Link to="/register">Join the Academy</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* main footer */}
      <div className="container-gk relative grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <img src="/img/logo/gksa-white.png" alt="GKSA" className="h-12 w-auto" />
            <span className="font-display text-xl font-bold uppercase tracking-wide">
              Golden Knights
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
            A youth football development academy in {SITE.location}. Developing skilled,
            disciplined, and confident young athletes, on and off the field.
          </p>
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/10"
          >
            <Instagram className="size-4" /> @goldenknightsfc
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>

        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
            Explore
          </p>
          <ul className="mt-4 space-y-2.5">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
            Get in touch
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            <li>
              <Link to="/contact" className="transition-colors hover:text-white">
                Contact us
              </Link>
            </li>
            <li>
              <Link to="/register" className="transition-colors hover:text-white">
                Register / book a trial
              </Link>
            </li>
            <li>
              <Link to="/sponsors" className="transition-colors hover:text-white">
                Sponsorship options
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-gk flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/40 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p>Proudly developing youth football in Midrand since {SITE.founded}.</p>
            <Link to="/admin/login" className="transition-colors hover:text-white/60">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
