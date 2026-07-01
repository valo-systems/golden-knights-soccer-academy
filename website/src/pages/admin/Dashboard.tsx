import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  Download,
  MessageCircle,
  Plus,
  Sparkles,
  Trophy,
  UserCheck,
  UserPlus,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { downloadCsv } from "@/admin/csv";
import {
  computeKpis,
  getPendingOrders,
  getProspectFollowUps,
  getTeamSummaries,
  prospectName,
  useAdmin,
} from "@/admin/store";
import type { AgeGroup, Prospect, ProspectStatus } from "@/admin/types";
import { AdminHeader, Card, formatDate } from "@/components/admin/ui";
import { formatZAR } from "@/lib/utils";

const PROSPECT_STAGE_LABELS: Record<ProspectStatus, string> = {
  new: "Needs response",
  contacted: "Contacted",
  trial_booked: "Trial booked",
  trial_attended: "Ready to join",
  joined: "Joined",
  declined: "Not continuing",
};

export function AdminDashboard() {
  const data = useAdmin();
  const kpis = computeKpis(data);

  const teamCounts = getTeamSummaries(data.members).map(({ team, count }) => ({ team, count }));

  const journeyStages = kpis.funnel.map((stage) => ({
    label: PROSPECT_STAGE_LABELS[stage.status],
    count: stage.count,
  }));
  const prospectFollowUps = getProspectFollowUps(data.prospects);
  const pendingOrders = getPendingOrders(data.orders);
  const latestActivity = buildLatestActivity(data.prospects);
  const bestNextStep =
    prospectFollowUps[0] != null
      ? `Follow up with ${prospectName(prospectFollowUps[0])}.`
      : kpis.overdueRenewals > 0
        ? "Record the next payment follow-up."
        : pendingOrders.length > 0
          ? "Review pending shop orders."
          : "Everything looks calm today.";

  const metrics = [
    {
      label: "Active players",
      value: String(kpis.activeMembers),
      helper: "Across 4 age groups",
      icon: Users,
      to: "/admin/members",
    },
    {
      label: "Fees to follow up",
      value: String(kpis.overdueRenewals),
      helper: `${formatZAR(kpis.outstandingCents)} outstanding`,
      icon: AlertTriangle,
      to: "/admin/members",
      tone: "alert" as const,
    },
    {
      label: "New enquiries",
      value: String(kpis.newProspectsThisMonth),
      helper: "This month",
      icon: UserPlus,
      to: "/admin/prospects",
    },
    {
      label: "Monthly fees",
      value: formatZAR(kpis.monthlyRevenueCents),
      helper: "Expected from active players",
      icon: Wallet,
      to: "/admin/members",
    },
  ];

  function exportDashboardCsv() {
    downloadCsv("gksa-dashboard.csv", [
      ...data.prospects.map((p) => ({
        type: "prospect",
        name: prospectName(p),
        team: p.ageGroup ?? "",
        status: p.status,
        phone: p.phone,
        created: formatDate(p.createdAt),
      })),
      ...data.members.map((m) => ({
        type: "member",
        name: `${m.firstName} ${m.lastName}`,
        team: m.team,
        status: m.status,
        phone: m.guardianPhone,
        created: formatDate(m.joinDate),
      })),
    ]);
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Dashboard"
        subtitle="A simple view of players, fees and follow-ups for today."
      />

      <AttentionCard
        paymentFollowUps={kpis.overdueRenewals}
        prospectFollowUps={prospectFollowUps.length}
        pendingOrders={pendingOrders.length}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <DataCard
          title="Trial & enquiry journey"
          action={
            <Link
              to="/admin/prospects"
              className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline"
            >
              View enquiries <ArrowRight className="size-4" />
            </Link>
          }
        >
          <div className="space-y-3">
            {journeyStages.map((stage, index) => (
              <div key={stage.label} className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-sm font-black text-primary">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1 rounded-2xl border border-[#eee8e2] bg-[#fbfaf8] px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold text-[#111217]">{stage.label}</p>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#111217] shadow-sm">
                      {stage.count}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3">
            <p className="text-sm font-semibold text-[#111217]">
              Best next step: <span className="text-primary">{bestNextStep}</span>
            </p>
          </div>
        </DataCard>

        <DataCard title="Latest activity">
          <div className="divide-y divide-[#eee8e2]">
            {latestActivity.map((item) => (
              <div key={item.title} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f4f2ef] text-primary">
                  <item.icon className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#111217]">{item.title}</p>
                  <p className="mt-0.5 text-xs font-medium text-[#6b6f76]">{item.meta}</p>
                </div>
              </div>
            ))}
          </div>
        </DataCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <DataCard title="Team snapshot">
          <div className="grid gap-3 sm:grid-cols-2">
            {teamCounts.map((item) => (
              <TeamBadge key={item.team} team={item.team} count={item.count} />
            ))}
          </div>
        </DataCard>

        <DataCard title="Quick actions">
          <div className="grid gap-3 sm:grid-cols-2">
            <ActionLink to="/admin/prospects" icon={Plus} label="Add prospect" primary />
            <ActionLink to="/admin/members" icon={UserCheck} label="Add member" />
            <ActionLink to="/admin/members" icon={CreditCard} label="Record payment" />
            <ActionButton icon={Download} label="Export CSV" onClick={exportDashboardCsv} />
          </div>
        </DataCard>
      </div>
    </div>
  );
}

function AttentionCard({
  paymentFollowUps,
  prospectFollowUps,
  pendingOrders,
}: {
  paymentFollowUps: number;
  prospectFollowUps: number;
  pendingOrders: number;
}) {
  const items = [
    paymentFollowUps > 0 && {
      icon: AlertTriangle,
      to: "/admin/members",
      text: `${paymentFollowUps} ${paymentFollowUps === 1 ? "player needs" : "players need"} payment follow-up`,
    },
    prospectFollowUps > 0 && {
      icon: MessageCircle,
      to: "/admin/prospects",
      text: `${prospectFollowUps} ${prospectFollowUps === 1 ? "enquiry needs" : "enquiries need"} follow-up`,
    },
    pendingOrders > 0 && {
      icon: Clock3,
      to: "/admin/orders",
      text: `${pendingOrders} ${pendingOrders === 1 ? "shop order needs" : "shop orders need"} review`,
    },
  ].filter(Boolean) as { icon: LucideIcon; to: string; text: string }[];

  // Nothing to follow up on, so the card disappears entirely.
  if (items.length === 0) return null;

  return (
    <Card className="overflow-hidden border-[#f3c7ca] bg-[linear-gradient(135deg,#fff_0%,#fff5f5_55%,#ffe8e9_100%)] p-5 shadow-[0_20px_60px_rgba(185,28,28,0.08)] sm:p-6">
      <div className="flex gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-[0_12px_30px_rgba(247,47,53,0.25)]">
          <Sparkles className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-heading text-2xl font-black text-[#111217]">Today&apos;s focus</h2>
          <div className="mt-3 grid gap-2 text-sm font-medium text-[#34363d] sm:grid-cols-3">
            {items.map((item) => (
              <FocusPoint key={item.to} icon={item.icon} text={item.text} to={item.to} />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function FocusPoint({ icon: Icon, text, to }: { icon: LucideIcon; text: string; to: string }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 shadow-sm transition hover:bg-white hover:shadow-md"
    >
      <Icon className="size-4 shrink-0 text-primary" />
      <span className="truncate">{text}</span>
      <ArrowRight className="ml-auto size-3.5 shrink-0 text-[#b7b0a8] opacity-0 transition group-hover:translate-x-0.5 group-hover:text-primary group-hover:opacity-100" />
    </Link>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  helper,
  to,
  tone = "normal",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  helper: string;
  to: string;
  tone?: "normal" | "alert";
}) {
  const badge =
    tone === "alert" ? "bg-red-100 text-red-700" : "bg-primary/10 text-primary";

  return (
    <Link to={to} className="group block h-full">
      <Card className="h-full p-5 transition duration-200 group-hover:-translate-y-0.5">
        <div className="flex items-start justify-between gap-3">
          <span className={`inline-flex size-11 items-center justify-center rounded-2xl ${badge}`}>
            <Icon className="size-5" />
          </span>
          <ArrowRight className="size-4 text-[#b7b0a8] transition group-hover:translate-x-0.5 group-hover:text-primary" />
        </div>
        <p className="mt-5 text-sm font-bold text-[#6b6f76]">{label}</p>
        <p className="mt-1 font-heading text-4xl font-black text-[#111217]">{value}</p>
        <p className="mt-2 text-sm font-medium text-[#6b6f76]">{helper}</p>
      </Card>
    </Link>
  );
}

function DataCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="h-full p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="font-heading text-xl font-black text-[#111217]">{title}</h2>
        {action}
      </div>
      {children}
    </Card>
  );
}

function TeamBadge({ team, count }: { team: AgeGroup; count: number }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[#eee8e2] bg-[#fbfaf8] px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-black text-white">
          {team}
        </span>
        <p className="font-bold text-[#111217]">{team}</p>
      </div>
      <p className="text-sm font-bold text-[#6b6f76]">
        {count} {count === 1 ? "player" : "players"}
      </p>
    </div>
  );
}

function ActionLink({
  to,
  icon: Icon,
  label,
  primary = false,
}: {
  to: string;
  icon: LucideIcon;
  label: string;
  primary?: boolean;
}) {
  const cls = primary
    ? "border-primary bg-primary text-white shadow-[0_12px_30px_rgba(247,47,53,0.2)] hover:bg-[#d52525]"
    : "border-[#e7e2dc] bg-white text-[#111217] hover:bg-[#f8f5f2]";

  return (
    <Link
      to={to}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full border px-4 text-sm font-bold transition ${cls}`}
    >
      <Icon className="size-4" />
      {label}
    </Link>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#e7e2dc] bg-white px-4 text-sm font-bold text-[#111217] transition hover:bg-[#f8f5f2]"
    >
      <Icon className="size-4" />
      {label}
    </button>
  );
}

function buildLatestActivity(prospects: Prospect[]) {
  return [...prospects]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 5)
    .map((prospect) => ({
      icon: activityIcon(prospect.status),
      title: activityTitle(prospect),
      meta: activityMeta(prospect),
    }));
}

function activityIcon(status: ProspectStatus) {
  if (status === "new") return UserPlus;
  if (status === "contacted") return MessageCircle;
  if (status === "trial_booked") return Trophy;
  if (status === "trial_attended") return Clock3;
  if (status === "joined") return CheckCircle2;
  return Clock3;
}

function activityTitle(prospect: Prospect) {
  const name = prospectName(prospect);
  if (prospect.status === "new") {
    return prospect.source === "Trial form"
      ? `${name} submitted a trial form`
      : `${name} sent an enquiry`;
  }
  if (prospect.status === "contacted") return `${name} was contacted`;
  if (prospect.status === "trial_booked") return `${name} booked a trial`;
  if (prospect.status === "trial_attended") return `${name} attended a trial`;
  if (prospect.status === "joined") return `${name} joined the academy`;
  return `${name} is not continuing for now`;
}

function activityMeta(prospect: Prospect) {
  const date = formatDate(prospect.createdAt);
  const team = prospect.ageGroup;
  return team ? `${date} · ${team}` : date;
}
