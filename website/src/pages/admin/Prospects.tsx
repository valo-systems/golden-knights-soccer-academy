import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  CalendarCheck2,
  Download,
  Eye,
  MessageCircle,
  MessageSquarePlus,
  Plus,
  RotateCcw,
  Search,
  UserCheck,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { downloadCsv } from "@/admin/csv";
import { getProspectFollowUps, prospectName, useAdmin } from "@/admin/store";
import {
  PROSPECT_STATUSES,
  ageGroupFromDob,
  type Prospect,
  type ProspectStatus,
} from "@/admin/types";
import {
  AdminActionGroup,
  AdminHeader,
  AdminIconButton,
  AdminIconLink,
  Card,
  Modal,
  WhatsAppLink,
  formatDate,
  waLink,
} from "@/components/admin/ui";
import { Select, DatePicker } from "@/components/admin/controls";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { cn } from "@/lib/utils";

type FilterKey = "all" | "needs_action" | ProspectStatus;

const emptyProspect = {
  childFirst: "",
  childLast: "",
  dob: "",
  parentName: "",
  phone: "",
  email: "",
  message: "",
};

const STATUS_COPY: Record<ProspectStatus, { label: string; tone: string }> = {
  new: { label: "Needs response", tone: "bg-red-50 text-red-700" },
  contacted: { label: "Contacted", tone: "bg-amber-50 text-amber-700" },
  trial_booked: { label: "Trial booked", tone: "bg-blue-50 text-blue-700" },
  trial_attended: { label: "Ready to join", tone: "bg-cyan-50 text-cyan-700" },
  joined: { label: "Joined", tone: "bg-green-50 text-green-700" },
  declined: { label: "Not continuing", tone: "bg-zinc-100 text-zinc-700" },
};

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "needs_action", label: "Needs action" },
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "trial_booked", label: "Trial booked" },
  { key: "trial_attended", label: "Ready" },
  { key: "joined", label: "Joined" },
  { key: "declined", label: "Closed" },
];

export function AdminProspects() {
  const { prospects, addProspect, setProspectStatus, addProspectNote, convertProspect } =
    useAdmin();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [adding, setAdding] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProspect);
  const [note, setNote] = useState("");

  const followUps = useMemo(() => getProspectFollowUps(prospects), [prospects]);
  const followUpOrder = useMemo(
    () => new Map(followUps.map((prospect, index) => [prospect.id, index])),
    [followUps]
  );

  const visibleProspects = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...prospects]
      .filter((prospect) => {
        const matchesSearch =
          !q ||
          [
            prospectName(prospect),
            prospect.parentName,
            prospect.phone,
            prospect.email,
            prospect.message,
            prospect.ageGroup,
            prospect.source,
            ...prospect.notes.map((n) => n.text),
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(q);
        if (!matchesSearch) return false;
        if (filter === "all") return true;
        if (filter === "needs_action") return followUpOrder.has(prospect.id);
        return prospect.status === filter;
      })
      .sort((a, b) => {
        const aFollow = followUpOrder.get(a.id);
        const bFollow = followUpOrder.get(b.id);
        if (aFollow != null || bFollow != null) {
          return (aFollow ?? 999) - (bFollow ?? 999);
        }
        return +new Date(b.createdAt) - +new Date(a.createdAt);
      });
  }, [filter, followUpOrder, prospects, query]);

  const selected = prospects.find((p) => p.id === selectedId) ?? null;

  function exportProspects() {
    downloadCsv(
      "gksa-prospects.csv",
      prospects.map((p) => ({
        parent_name: p.parentName,
        child_first: p.childFirst ?? "",
        child_last: p.childLast ?? "",
        age_group: p.ageGroup ?? "",
        phone: p.phone,
        email: p.email ?? "",
        source: p.source,
        status: STATUS_COPY[p.status].label,
        created_at: p.createdAt,
        message: p.message ?? "",
      }))
    );
  }

  function submitManual(e: FormEvent) {
    e.preventDefault();
    const id = addProspect({
      ...form,
      source: "Manual",
      email: form.email || undefined,
      message: form.message || undefined,
    });
    setForm(emptyProspect);
    setAdding(false);
    setSelectedId(id);
  }

  function saveNote(e: FormEvent) {
    e.preventDefault();
    if (!selected || !note.trim()) return;
    addProspectNote(selected.id, note.trim());
    setNote("");
  }

  function convert(id: string) {
    convertProspect(id);
    setSelectedId(null);
  }

  return (
    <>
      <AdminHeader
        title="Enquiries & trials"
        subtitle="A simple list of families, trial stages and next actions."
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={exportProspects}
              className="border-[#e7e2dc] bg-white"
            >
              <Download /> Export CSV
            </Button>
            <Button type="button" onClick={() => setAdding(true)}>
              <Plus /> Add prospect
            </Button>
          </>
        }
      />

      <ProspectSummary prospects={prospects} onShowFollowUps={() => setFilter("needs_action")} />

      <Card className="overflow-hidden border-[#e7e2dc] bg-white shadow-[0_16px_42px_rgba(17,18,23,0.05)]">
        <div className="space-y-4 border-b border-[#eee8e2] p-4 sm:p-5">
          <SearchBox value={query} onChange={setQuery} />
          <FilterChips active={filter} onChange={setFilter} />
        </div>

        <ProspectTable
          prospects={visibleProspects}
          onOpen={setSelectedId}
          onStatus={setProspectStatus}
          onConvert={convert}
        />

        <ProspectMobileCards
          prospects={visibleProspects}
          onOpen={setSelectedId}
          onStatus={setProspectStatus}
          onConvert={convert}
        />
      </Card>

      <Modal title="Add prospect" open={adding} onClose={() => setAdding(false)}>
        <form onSubmit={submitManual} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Child first name" optional>
              <Input
                value={form.childFirst}
                onChange={(e) => setForm((p) => ({ ...p, childFirst: e.target.value }))}
              />
            </Field>
            <Field label="Child last name" optional>
              <Input
                value={form.childLast}
                onChange={(e) => setForm((p) => ({ ...p, childLast: e.target.value }))}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Date of birth" optional>
              <DatePicker
                value={form.dob}
                onChange={(iso) => setForm((p) => ({ ...p, dob: iso }))}
                max={new Date().toISOString().slice(0, 10)}
              />
            </Field>
            <Field label="Suggested age group">
              <Input readOnly value={ageGroupFromDob(form.dob) ?? ""} placeholder="Optional" />
            </Field>
          </div>
          <Field label="Parent / guardian" required>
            <Input
              value={form.parentName}
              onChange={(e) => setForm((p) => ({ ...p, parentName: e.target.value }))}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone / WhatsApp" required>
              <Input
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              />
            </Field>
            <Field label="Email" optional>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              />
            </Field>
          </div>
          <Field label="Message / note" optional>
            <Textarea
              value={form.message}
              onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
            />
          </Field>
          <Button type="submit" size="lg" className="w-full">
            Save prospect
          </Button>
        </form>
      </Modal>

      <Modal
        title={selected ? prospectName(selected) : "Prospect"}
        open={!!selected}
        onClose={() => setSelectedId(null)}
      >
        {selected && (
          <div className="space-y-6">
            <div className="grid gap-3 rounded-2xl border border-[#e7e2dc] bg-[#fbfaf8] p-5 text-sm sm:grid-cols-2">
              <Info label="Guardian" value={selected.parentName} />
              <Info label="WhatsApp" value={<WhatsAppLink phone={selected.phone} />} />
              <Info label="Email" value={selected.email || "-"} />
              <Info label="Team" value={selected.ageGroup || "Enquiry"} />
              <Info label="Source" value={sourceLabel(selected)} />
              <Info label="Captured" value={formatDate(selected.createdAt)} />
            </div>

            {selected.message && (
              <div>
                <p className="text-sm font-bold text-[#111217]">Message</p>
                <p className="mt-2 rounded-2xl border border-[#e7e2dc] bg-white p-4 text-sm text-[#6b6f76]">
                  {selected.message}
                </p>
              </div>
            )}

            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-bold text-[#111217]">Follow-up notes</p>
                <StatusBadge status={selected.status} />
              </div>
              <div className="space-y-3">
                {selected.notes.map((n) => (
                  <div key={n.id} className="rounded-2xl border border-[#e7e2dc] bg-white p-4">
                    <p className="text-sm text-[#111217]">{n.text}</p>
                    <p className="mt-1 text-xs text-[#6b6f76]">{formatDate(n.at)}</p>
                  </div>
                ))}
                {selected.notes.length === 0 && <EmptyState />}
              </div>
              <form onSubmit={saveNote} className="mt-3 flex flex-col gap-2 sm:flex-row">
                <Input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a follow-up note"
                />
                <Button type="submit" variant="dark" className="shrink-0">
                  <MessageSquarePlus /> Add
                </Button>
              </form>
            </div>

            <div className="flex flex-wrap gap-2">
              <Select
                value={selected.status}
                onChange={(v) => setProspectStatus(selected.id, v as ProspectStatus)}
                options={PROSPECT_STATUSES.map((status) => ({
                  value: status,
                  label: STATUS_COPY[status].label,
                }))}
                className="w-52"
              />
              <Button
                type="button"
                disabled={selected.status === "joined" || selected.status === "declined"}
                onClick={() => convert(selected.id)}
              >
                <UserCheck /> Convert to member
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

function ProspectSummary({
  prospects,
  onShowFollowUps,
}: {
  prospects: Prospect[];
  onShowFollowUps: () => void;
}) {
  const followUps = getProspectFollowUps(prospects);
  const newCount = prospects.filter((p) => p.status === "new").length;
  const trialCount = prospects.filter((p) => p.status === "trial_booked").length;
  return (
    <Card className="mb-6 border-[#e7e2dc] bg-white px-4 py-3 shadow-[0_10px_28px_rgba(17,18,23,0.04)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-[#34363d]">
          <span className={followUps.length > 0 ? "text-[#b91c1c]" : "text-[#34363d]"}>
            {followUps.length} {followUps.length === 1 ? "enquiry" : "enquiries"} need action
          </span>{" "}
          <span className="text-[#8b8f96]">·</span> {newCount} new{" "}
          <span className="text-[#8b8f96]">·</span> {trialCount} trial booked
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onShowFollowUps}
          className="w-full border-[#e7e2dc] sm:w-auto"
        >
          Show follow-ups
        </Button>
      </div>
    </Card>
  );
}

function SearchBox({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#8b8f96]" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search player, guardian, phone, team or note"
        className="border-[#e7e2dc] bg-[#fbfaf8] pl-11"
      />
    </div>
  );
}

function FilterChips({
  active,
  onChange,
}: {
  active: FilterKey;
  onChange: (filter: FilterKey) => void;
}) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <div className="flex min-w-max gap-2">
        {FILTERS.map((filter) => {
          const isActive = active === filter.key;
          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => onChange(filter.key)}
              className={cn(
                "rounded-full border px-3 py-2 text-xs font-black transition",
                isActive
                  ? "border-[#111217] bg-[#111217] text-white"
                  : "border-[#e7e2dc] bg-white text-[#34363d] hover:bg-[#f8f5f2]"
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProspectTable({
  prospects,
  onOpen,
  onStatus,
  onConvert,
}: {
  prospects: Prospect[];
  onOpen: (id: string) => void;
  onStatus: (id: string, status: ProspectStatus) => void;
  onConvert: (id: string) => void;
}) {
  return (
    <div className="hidden overflow-x-auto lg:block">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-[#fbfaf8] text-xs font-black uppercase tracking-wide text-[#6b6f76]">
          <tr>
            <th className="px-4 py-3">Player</th>
            <th className="px-4 py-3">Guardian</th>
            <th className="px-4 py-3">Stage</th>
            <th className="px-4 py-3">Next step</th>
            <th className="px-4 py-3">Captured</th>
            <th className="sticky right-0 bg-[#fbfaf8] px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#eee8e2]">
          {prospects.map((prospect) => (
            <tr key={prospect.id} className="transition-colors hover:bg-[#fbfaf8]">
              <td className="px-4 py-4">
                <p className="font-bold text-[#111217]">{prospectName(prospect)}</p>
                <p className="mt-1 text-xs text-[#6b6f76]">
                  {prospect.ageGroup ?? "No age group"} · {sourceLabel(prospect)}
                </p>
              </td>
              <td className="px-4 py-4">
                <p className="font-medium text-[#111217]">{prospect.parentName}</p>
                <p className="mt-1 text-xs text-[#6b6f76]">{prospect.phone}</p>
              </td>
              <td className="px-4 py-4">
                <StatusBadge status={prospect.status} />
              </td>
              <td className="px-4 py-4 text-[#34363d]">{nextStepText(prospect)}</td>
              <td className="whitespace-nowrap px-4 py-4 text-[#6b6f76]">
                {formatDate(prospect.createdAt)}
              </td>
              <td className="sticky right-0 bg-white px-4 py-4 shadow-[-12px_0_18px_rgba(255,255,255,0.85)]">
                <ProspectActions
                  prospect={prospect}
                  onOpen={() => onOpen(prospect.id)}
                  onStatus={(status) => onStatus(prospect.id, status)}
                  onConvert={() => onConvert(prospect.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {prospects.length === 0 && <EmptyState />}
    </div>
  );
}

function ProspectMobileCards({
  prospects,
  onOpen,
  onStatus,
  onConvert,
}: {
  prospects: Prospect[];
  onOpen: (id: string) => void;
  onStatus: (id: string, status: ProspectStatus) => void;
  onConvert: (id: string) => void;
}) {
  return (
    <div className="space-y-3 p-4 lg:hidden">
      {prospects.map((prospect) => (
        <article
          key={prospect.id}
          className="rounded-2xl border border-[#e7e2dc] bg-white p-4 shadow-[0_10px_26px_rgba(17,18,23,0.04)]"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-black leading-tight text-[#111217]">
                {prospectName(prospect)}
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                <StatusBadge status={prospect.status} />
                <span className="inline-flex rounded-full bg-[#f4f2ef] px-2.5 py-1 text-[11px] font-black text-[#6b6f76]">
                  {prospect.ageGroup ?? "Enquiry"}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-1 text-sm text-[#34363d]">
            <p>
              <span className="font-semibold text-[#111217]">Guardian:</span>{" "}
              {prospect.parentName}
            </p>
            <p>
              <span className="font-semibold text-[#111217]">Next:</span>{" "}
              {nextStepText(prospect)}
            </p>
            <p className="text-xs text-[#6b6f76]">{formatDate(prospect.createdAt)}</p>
          </div>
          <div className="mt-4 border-t border-[#eee8e2] pt-3">
            <ProspectActions
              prospect={prospect}
              onOpen={() => onOpen(prospect.id)}
              onStatus={(status) => onStatus(prospect.id, status)}
              onConvert={() => onConvert(prospect.id)}
            />
          </div>
        </article>
      ))}
      {prospects.length === 0 && <EmptyState />}
    </div>
  );
}

function ProspectActions({
  prospect,
  onOpen,
  onStatus,
  onConvert,
}: {
  prospect: Prospect;
  onOpen: () => void;
  onStatus: (status: ProspectStatus) => void;
  onConvert: () => void;
}) {
  const next = nextAction(prospect, onStatus, onConvert);
  return (
    <AdminActionGroup>
      {canWhatsApp(prospect) && (
        <AdminIconLink
          href={waLink(prospect.phone)}
          target="_blank"
          rel="noreferrer"
          label={`WhatsApp ${prospect.parentName}`}
          icon={MessageCircle}
          tone="whatsapp"
        />
      )}
      {next && (
        <AdminIconButton
          label={next.label}
          icon={next.icon}
          tone={next.tone}
          onClick={next.onClick}
        />
      )}
      <AdminIconButton label="View details" icon={Eye} onClick={onOpen} />
    </AdminActionGroup>
  );
}

function nextAction(
  prospect: Prospect,
  onStatus: (status: ProspectStatus) => void,
  onConvert: () => void
): null | {
  label: string;
  icon: LucideIcon;
  tone?: "neutral" | "primary" | "success";
  onClick: () => void;
} {
  if (prospect.status === "new") {
    return {
      label: "Mark contacted",
      icon: MessageCircle,
      tone: "primary",
      onClick: () => onStatus("contacted"),
    };
  }
  if (prospect.status === "contacted") {
    return {
      label: "Book trial",
      icon: CalendarCheck2,
      tone: "primary",
      onClick: () => onStatus("trial_booked"),
    };
  }
  if (prospect.status === "trial_booked") {
    return {
      label: "Mark attended",
      icon: UserCheck,
      tone: "primary",
      onClick: () => onStatus("trial_attended"),
    };
  }
  if (prospect.status === "trial_attended") {
    return {
      label: "Convert to member",
      icon: UserPlus,
      tone: "success",
      onClick: onConvert,
    };
  }
  if (prospect.status === "declined") {
    return {
      label: "Reopen enquiry",
      icon: RotateCcw,
      onClick: () => onStatus("new"),
    };
  }
  return null;
}

function canWhatsApp(prospect: Prospect) {
  return prospect.status !== "joined" && prospect.status !== "declined";
}

function nextStepText(prospect: Prospect) {
  if (prospect.status === "new") return "Send first response";
  if (prospect.status === "contacted") return "Book a trial";
  if (prospect.status === "trial_booked") return "Mark trial attended";
  if (prospect.status === "trial_attended") return "Convert or close";
  if (prospect.status === "joined") return "Member created";
  return "Closed";
}

function EmptyState() {
  return (
    <div className="m-4 rounded-2xl border border-dashed border-[#d9d2ca] bg-[#fbfaf8] p-6 text-center">
      <p className="text-sm font-bold text-[#111217]">No enquiries found.</p>
      <p className="mt-1 text-xs text-[#6b6f76]">Try a different search or filter.</p>
    </div>
  );
}

function StatusBadge({ status }: { status: ProspectStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-[11px] font-black",
        STATUS_COPY[status].tone
      )}
    >
      {STATUS_COPY[status].label}
    </span>
  );
}

function Info({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-[#6b6f76]">{label}</p>
      <div className="mt-1 font-semibold text-[#111217]">{value}</div>
    </div>
  );
}

function sourceLabel(prospect: Prospect) {
  if (prospect.source === "Contact") return "Contact enquiry";
  if (prospect.source === "Trial form") return "Trial form";
  return "Manual entry";
}
