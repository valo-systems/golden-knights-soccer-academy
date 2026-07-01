import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, ChevronDown, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------- helpers */

function useClickOutside<T extends HTMLElement>(onClose: () => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);
  return ref;
}

const popMotion = {
  initial: { opacity: 0, y: -6, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6, scale: 0.98 },
  transition: { type: "spring" as const, stiffness: 420, damping: 30 },
};

const triggerBase =
  "flex w-full items-center justify-between gap-2 rounded-xl border border-[#e7e2dc] bg-white/80 px-4 py-2.5 text-sm font-semibold text-[#111217] shadow-sm transition hover:border-[#d8d2ca] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25";

/* ---------------------------------------------------------------- Select */

export interface SelectOption {
  value: string;
  label: string;
  hint?: string;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = "Select",
  className,
  buttonClassName,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));
  const current = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(triggerBase, buttonClassName)}
      >
        <span className={cn(!current && "text-[#9a9690]")}>{current ? current.label : placeholder}</span>
        <ChevronDown className={cn("size-4 text-[#9a9690] transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            {...popMotion}
            role="listbox"
            className="admin-pop absolute z-30 mt-2 max-h-72 w-full overflow-auto rounded-2xl p-1.5"
          >
            {options.map((o) => {
              const active = o.value === value;
              return (
                <li key={o.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                      active ? "bg-primary/10 text-primary" : "text-[#34363d] hover:bg-[#f4f2ef]"
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{o.label}</span>
                      {o.hint && <span className="block truncate text-xs text-[#9a9690]">{o.hint}</span>}
                    </span>
                    {active && <Check className="size-4 shrink-0" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------- DatePicker */

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toIso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function buildMonth(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const startDay = (first.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  return cells;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select a date",
  max,
  className,
}: {
  value: string;
  onChange: (iso: string) => void;
  placeholder?: string;
  /** Optional max selectable date as ISO yyyy-mm-dd. */
  max?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));
  const selected = value ? new Date(value) : null;
  const [view, setView] = useState(() => selected ?? new Date());

  const cells = buildMonth(view.getFullYear(), view.getMonth());
  const maxDate = max ? new Date(max) : null;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button type="button" onClick={() => setOpen((v) => !v)} className={triggerBase}>
        <span className={cn("flex items-center gap-2", !selected && "text-[#9a9690]")}>
          <Calendar className="size-4 text-[#9a9690]" />
          {selected
            ? selected.toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" })
            : placeholder}
        </span>
        <ChevronDown className={cn("size-4 text-[#9a9690] transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div {...popMotion} className="admin-pop absolute z-30 mt-2 w-72 rounded-2xl p-3">
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
                className="inline-flex size-8 items-center justify-center rounded-full text-[#6b6f76] hover:bg-[#f4f2ef]"
                aria-label="Previous month"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-sm font-bold text-[#111217]">
                {MONTHS[view.getMonth()]} {view.getFullYear()}
              </span>
              <button
                type="button"
                onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
                className="inline-flex size-8 items-center justify-center rounded-full text-[#6b6f76] hover:bg-[#f4f2ef]"
                aria-label="Next month"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-[#9a9690]">
              {WEEKDAYS.map((w) => (
                <span key={w} className="py-1">{w}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((d, i) => {
                if (!d) return <span key={i} />;
                const iso = toIso(d);
                const isSelected = value === iso;
                const disabled = maxDate ? d > maxDate : false;
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      onChange(iso);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex h-9 items-center justify-center rounded-lg text-sm transition-colors",
                      isSelected
                        ? "bg-primary font-bold text-white"
                        : "text-[#34363d] hover:bg-[#f4f2ef]",
                      disabled && "cursor-not-allowed opacity-30 hover:bg-transparent"
                    )}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
