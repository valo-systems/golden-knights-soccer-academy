import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RenewalState } from "@/admin/store";
import { type ProspectStatus, PROSPECT_STATUS_LABEL } from "@/admin/types";

/** Page header with a title, optional subtitle, and right-aligned actions. */
export function AdminHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-heading text-3xl font-black text-foreground sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({
  children,
  className,
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div className={cn("admin-card rounded-3xl", hover && "admin-card-hover", className)}>
      {children}
    </div>
  );
}

type AdminIconTone = "neutral" | "primary" | "success" | "danger" | "whatsapp";

const iconTone: Record<AdminIconTone, string> = {
  neutral: "border-[#e7e2dc] bg-white text-[#34363d] hover:bg-[#f8f5f2] hover:text-[#111217]",
  primary:
    "border-primary/20 bg-primary/10 text-primary hover:border-primary/30 hover:bg-primary hover:text-white",
  success:
    "border-green-200 bg-green-50 text-green-700 hover:border-green-300 hover:bg-green-100",
  danger: "border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100",
  whatsapp:
    "border-[#1aa851]/20 bg-[#1aa851]/10 text-[#147c3f] hover:border-[#1aa851]/30 hover:bg-[#1aa851]/15",
};

function TooltipLabel({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#111217] px-2.5 py-1 text-[11px] font-bold text-white shadow-lg group-hover/action:block group-focus-visible/action:block">
      {label}
    </span>
  );
}

export function AdminIconButton({
  label,
  icon: Icon,
  tone = "neutral",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  icon: LucideIcon;
  tone?: AdminIconTone;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "group/action relative inline-flex size-9 items-center justify-center rounded-full border text-sm transition disabled:pointer-events-none disabled:opacity-40",
        iconTone[tone],
        className
      )}
      {...props}
    >
      <Icon className="size-4" />
      <TooltipLabel label={label} />
    </button>
  );
}

export function AdminIconLink({
  label,
  icon: Icon,
  tone = "neutral",
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  label: string;
  icon: LucideIcon;
  tone?: AdminIconTone;
}) {
  return (
    <a
      aria-label={label}
      title={label}
      className={cn(
        "group/action relative inline-flex size-9 items-center justify-center rounded-full border text-sm transition",
        iconTone[tone],
        className
      )}
      {...props}
    >
      <Icon className="size-4" />
      <TooltipLabel label={label} />
    </a>
  );
}

export function AdminActionGroup({ children }: { children: ReactNode }) {
  return <div className="flex items-center justify-end gap-1.5">{children}</div>;
}

export function Modal({
  title,
  children,
  open,
  onClose,
  className,
}: {
  title: string;
  children: ReactNode;
  open: boolean;
  onClose: () => void;
  className?: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <motion.button
            type="button"
            aria-label="Close modal"
            className="absolute inset-0 bg-[#0c0d10]/45 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className={cn(
              "admin-pop relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6 sm:p-7",
              className
            )}
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="font-heading text-2xl font-black text-foreground">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex size-9 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

const PROSPECT_BADGE: Record<ProspectStatus, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  trial_booked: "bg-violet-100 text-violet-700",
  trial_attended: "bg-cyan-100 text-cyan-700",
  joined: "bg-green-100 text-green-700",
  declined: "bg-zinc-200 text-zinc-600",
};

export function ProspectBadge({ status }: { status: ProspectStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        PROSPECT_BADGE[status]
      )}
    >
      {PROSPECT_STATUS_LABEL[status]}
    </span>
  );
}

const RENEWAL_BADGE: Record<RenewalState, { label: string; cls: string }> = {
  ok: { label: "Active", cls: "bg-green-100 text-green-700" },
  due: { label: "Due soon", cls: "bg-amber-100 text-amber-700" },
  overdue: { label: "Overdue", cls: "bg-red-100 text-red-700" },
  inactive: { label: "Inactive", cls: "bg-zinc-200 text-zinc-600" },
};

export function RenewalBadge({ state }: { state: RenewalState }) {
  const b = RENEWAL_BADGE[state];
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", b.cls)}>
      {b.label}
    </span>
  );
}

/** wa.me link from a local SA number (drops leading 0, adds 27). */
export function waLink(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.startsWith("0") ? `27${digits.slice(1)}` : digits;
  return `https://wa.me/${intl}`;
}

export function WhatsAppLink({ phone, className }: { phone: string; className?: string }) {
  return (
    <a
      href={waLink(phone)}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "inline-flex items-center gap-1 text-xs font-semibold text-[#1aa851] hover:underline",
        className
      )}
    >
      <MessageCircle className="size-3.5" /> {phone}
    </a>
  );
}

export function formatDate(iso?: string) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" });
}
