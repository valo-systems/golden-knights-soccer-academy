import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ShoppingBag, ChevronDown } from "lucide-react";
import { PRIMARY_NAV, MORE_NAV, NAV } from "@/data/site";
import { Button } from "@/components/ui/button";
import { useCart } from "@/shop/cart";
import { cn } from "@/lib/utils";

/** Routes that open with a dark hero, where the header may be transparent at top. */
const DARK_HERO = new Set([
  "/",
  "/about",
  "/programmes",
  "/sponsors",
  "/contact",
  "/teams",
  "/fixtures",
  "/gallery",
  "/news",
  "/register",
  "/shop",
]);

function CartButton() {
  const { count, setOpen } = useCart();
  return (
    <button
      onClick={() => setOpen(true)}
      className="relative inline-flex size-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
      aria-label="Open cart"
    >
      <ShoppingBag className="size-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-white">
          {count}
        </span>
      )}
    </button>
  );
}

function MoreMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-white/75 transition-colors hover:text-white"
      >
        More <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-2xl border border-white/10 bg-ink/95 p-1.5 shadow-2xl backdrop-blur-xl"
          >
            {MORE_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "block rounded-xl px-3 py-2.5 text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white",
                    isActive && "bg-white/10 text-white"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const transparent = DARK_HERO.has(pathname) && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        transparent ? "bg-transparent" : "border-b border-white/10 bg-ink/90 backdrop-blur-xl"
      )}
    >
      <div className="container-gk flex h-18 items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-3" aria-label="GKSA home">
          <img
            src="/img/logo/gksa-white.png"
            alt="Golden Knights Soccer Academy"
            className="h-11 w-auto"
          />
          <span className="hidden font-display text-lg font-bold uppercase tracking-wide text-white sm:block">
            Golden Knights
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {PRIMARY_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium text-white/75 transition-colors hover:text-white",
                  isActive && "text-white"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-white/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
          <MoreMenu />
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <CartButton />
          <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <Link to="/register">Book a Trial</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/sponsors">Sponsor</Link>
          </Button>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <CartButton />
          <button
            className="inline-flex items-center justify-center rounded-full p-2 text-white"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/10 bg-ink/95 backdrop-blur-xl lg:hidden"
          >
            <div className="container-gk flex flex-col gap-1 py-4">
              {NAV.filter((i) => i.to !== "/").map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "rounded-lg px-4 py-3 text-base font-medium text-white/80",
                      isActive && "bg-white/10 text-white"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="mt-3 flex gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="md"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  <Link to="/register">Book a Trial</Link>
                </Button>
                <Button asChild size="md" className="flex-1">
                  <Link to="/sponsors">Sponsor</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
