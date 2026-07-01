import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  Camera,
  CameraOff,
  CreditCard,
  Download,
  Eye,
  MessageCircle,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { downloadCsv } from "@/admin/csv";
import {
  getPaymentFollowUps,
  isPaymentFollowUp,
  memberJoiningFeeDueCents,
  memberMonthlyFeeCents,
  memberPaymentDueCents,
  paymentFollowUpTotalCents,
  renewalState,
  useAdmin,
  type RenewalState,
} from "@/admin/store";
import { AGE_GROUPS, type AgeGroup, type Member } from "@/admin/types";
import {
  AdminHeader,
  AdminActionGroup,
  AdminIconButton,
  AdminIconLink,
  Card,
  Modal,
  RenewalBadge,
  WhatsAppLink,
  formatDate,
  useConfirm,
  waLink,
} from "@/components/admin/ui";
import { Select as MenuSelect, DatePicker } from "@/components/admin/controls";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { cn, formatZAR } from "@/lib/utils";

type MemberFilter = "all" | "needs_payment" | "active" | "inactive" | "by_team";

const FILTERS: { key: MemberFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "needs_payment", label: "Needs payment" },
  { key: "active", label: "Active" },
  { key: "inactive", label: "Inactive" },
  { key: "by_team", label: "By team" },
];

const emptyMember = {
  firstName: "",
  lastName: "",
  dob: "",
  team: "U9" as AgeGroup,
  guardianName: "",
  guardianPhone: "",
  guardianEmail: "",
};

export function AdminMembers() {
  const { members, fees, addMember, updateMember, removeMember, recordPayment, updatePhotoConsent } = useAdmin();
  const confirm = useConfirm();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<MemberFilter>("all");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyMember);
  const paymentFollowUps = useMemo(
    () => getPaymentFollowUps(members),
    [members]
  );
  const outstandingCents = useMemo(
    () => paymentFollowUpTotalCents(members),
    [members]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matchesSearch = (member: Member) =>
      [
        playerName(member),
        member.team,
        member.guardianName,
        member.guardianPhone,
        member.guardianEmail,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);

    const matchesFilter = (member: Member) => {
      const state = renewalState(member);
      if (filter === "needs_payment") return isPaymentFollowUp(member);
      if (filter === "active") return state !== "inactive" && state !== "overdue";
      if (filter === "inactive") return state === "inactive";
      return true;
    };

    return [...members]
      .filter((member) => (!q || matchesSearch(member)) && matchesFilter(member))
      .sort((a, b) => {
        if (filter === "by_team") {
          const teamDelta = AGE_GROUPS.indexOf(a.team) - AGE_GROUPS.indexOf(b.team);
          if (teamDelta !== 0) return teamDelta;
        }
        if (isPaymentFollowUp(a) !== isPaymentFollowUp(b)) {
          return isPaymentFollowUp(a) ? -1 : 1;
        }
        return playerName(a).localeCompare(playerName(b));
      });
  }, [filter, members, query]);

  const selected = members.find((member) => member.id === selectedId) ?? null;

  function openEdit(member: Member) {
    setEditingId(member.id);
    setForm({
      firstName: member.firstName,
      lastName: member.lastName,
      dob: member.dob ?? "",
      team: member.team,
      guardianName: member.guardianName,
      guardianPhone: member.guardianPhone,
      guardianEmail: member.guardianEmail ?? "",
    });
    setAdding(true);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (editingId) {
      updateMember(editingId, {
        ...form,
        dob: form.dob || undefined,
        guardianEmail: form.guardianEmail || undefined,
      });
      setEditingId(null);
    } else {
      addMember({
        ...form,
        dob: form.dob || undefined,
        guardianEmail: form.guardianEmail || undefined,
      });
    }
    setForm(emptyMember);
    setAdding(false);
  }

  function exportMembers() {
    downloadCsv(
      "gksa-members.csv",
      members.map((member) => ({
        first_name: member.firstName,
        last_name: member.lastName,
        team: member.team,
        guardian_name: member.guardianName,
        guardian_phone: member.guardianPhone,
        guardian_email: member.guardianEmail ?? "",
        status: renewalState(member),
        monthly_fee: formatZAR(memberMonthlyFeeCents(member)),
        joining_fee: formatZAR(member.joiningFeeCents),
        joining_fee_paid: member.joiningFeePaidAt ? "yes" : "no",
        next_payment: member.nextRenewal,
        join_date: member.joinDate,
      }))
    );
  }

  return (
    <>
      <AdminHeader
        title="Members"
        subtitle="Manage players, guardians and monthly fees."
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={exportMembers}
              className="border-[#e7e2dc] bg-white"
            >
              <Download /> Export CSV
            </Button>
            <Button type="button" onClick={() => setAdding(true)}>
              <Plus /> Add member
            </Button>
          </>
        }
      />

      <PaymentSummary
        count={paymentFollowUps.length}
        outstandingCents={outstandingCents}
        onShowPayments={() => setFilter("needs_payment")}
      />

      <Card className="overflow-hidden border-[#e7e2dc] bg-white shadow-[0_16px_42px_rgba(17,18,23,0.05)]">
        <div className="space-y-4 border-b border-[#eee8e2] p-4 sm:p-5">
          <SearchBox value={query} onChange={setQuery} />
          <FilterChips active={filter} onChange={setFilter} />
        </div>

        <DesktopMemberTable
          members={filtered}
          onOpen={setSelectedId}
          onEdit={openEdit}
          onRemove={async (id) => {
            const m = members.find((x) => x.id === id);
            const ok = await confirm({
              title: "Remove member?",
              message: `${m ? `${m.firstName} ${m.lastName}` : "This member"} will be permanently removed, including all payment history.`,
              danger: true,
            });
            if (ok) removeMember(id);
          }}
          onRecordPayment={recordPayment}
          onAdd={() => setAdding(true)}
        />

        <MobileMemberCards
          members={filtered}
          onOpen={setSelectedId}
          onEdit={openEdit}
          onRemove={async (id) => {
            const m = members.find((x) => x.id === id);
            const ok = await confirm({
              title: "Remove member?",
              message: `${m ? `${m.firstName} ${m.lastName}` : "This member"} will be permanently removed, including all payment history.`,
              danger: true,
            });
            if (ok) removeMember(id);
          }}
          onRecordPayment={recordPayment}
          onAdd={() => setAdding(true)}
        />
      </Card>

      <Modal title={editingId ? "Edit member" : "Add member"} open={adding} onClose={() => { setAdding(false); setEditingId(null); setForm(emptyMember); }}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" required>
              <Input
                value={form.firstName}
                onChange={(e) =>
                  setForm((previous) => ({ ...previous, firstName: e.target.value }))
                }
              />
            </Field>
            <Field label="Last name" required>
              <Input
                value={form.lastName}
                onChange={(e) =>
                  setForm((previous) => ({ ...previous, lastName: e.target.value }))
                }
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Date of birth" optional>
              <DatePicker
                value={form.dob}
                onChange={(iso) => setForm((previous) => ({ ...previous, dob: iso }))}
                max={new Date().toISOString().slice(0, 10)}
              />
            </Field>
            <Field label="Team" required>
              <MenuSelect
                value={form.team}
                onChange={(v) => setForm((previous) => ({ ...previous, team: v as AgeGroup }))}
                options={AGE_GROUPS.map((team) => ({ value: team, label: team }))}
              />
            </Field>
          </div>
          <Field label="Guardian name" required>
            <Input
              value={form.guardianName}
              onChange={(e) =>
                setForm((previous) => ({ ...previous, guardianName: e.target.value }))
              }
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Guardian phone" required>
              <Input
                value={form.guardianPhone}
                onChange={(e) =>
                  setForm((previous) => ({ ...previous, guardianPhone: e.target.value }))
                }
              />
            </Field>
            <Field label="Guardian email" optional>
              <Input
                type="email"
                value={form.guardianEmail}
                onChange={(e) =>
                  setForm((previous) => ({ ...previous, guardianEmail: e.target.value }))
                }
              />
            </Field>
          </div>
          <div className="rounded-2xl border border-[#e7e2dc] bg-[#fbfaf8] p-4">
            <p className="text-sm font-bold text-foreground">Fees for this member</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Info label="Monthly fee" value={`${formatZAR(fees.monthlyFeeCents)} / month`} />
              <Info label="Joining fee" value={`${formatZAR(fees.joiningFeeCents)} once-off`} />
            </div>
          </div>
          <Button type="submit" size="lg" className="w-full">
            {editingId ? "Save changes" : "Save member"}
          </Button>
        </form>
      </Modal>

      <Modal
        title={selected ? playerName(selected) : "Member"}
        open={!!selected}
        onClose={() => setSelectedId(null)}
      >
        {selected && (
          <MemberDetail
            member={selected}
            onPaid={() => {
              recordPayment(selected.id);
              setSelectedId(null);
            }}
            onTogglePhotoConsent={(consent) => updatePhotoConsent(selected.id, consent)}
          />
        )}
      </Modal>
    </>
  );
}

function PaymentSummary({
  count,
  outstandingCents,
  onShowPayments,
}: {
  count: number;
  outstandingCents: number;
  onShowPayments: () => void;
}) {
  const playerLabel = count === 1 ? "player" : "players";

  return (
    <Card className="mb-6 border-[#e7e2dc] bg-white px-4 py-3 shadow-[0_10px_28px_rgba(17,18,23,0.04)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-[#34363d]">
          <span className={count > 0 ? "text-[#b91c1c]" : "text-[#34363d]"}>
            {count} {playerLabel} need payment follow-up
          </span>{" "}
          <span className="text-[#8b8f96]">·</span>{" "}
          <span className={count > 0 ? "text-[#b91c1c]" : "text-[#6b6f76]"}>
            {formatZAR(outstandingCents)} outstanding
          </span>
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onShowPayments}
          className="w-full border-[#e7e2dc] sm:w-auto"
        >
          Show in list
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
        placeholder="Search player, guardian, team or phone number"
        className="border-[#e7e2dc] bg-[#fbfaf8] pl-11"
      />
    </div>
  );
}

function FilterChips({
  active,
  onChange,
}: {
  active: MemberFilter;
  onChange: (filter: MemberFilter) => void;
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

function DesktopMemberTable({
  members,
  onOpen,
  onEdit,
  onRemove,
  onRecordPayment,
  onAdd,
}: {
  members: Member[];
  onOpen: (id: string) => void;
  onEdit: (m: Member) => void;
  onRemove: (id: string) => void;
  onRecordPayment: (id: string) => void;
  onAdd: () => void;
}) {
  return (
    <div className="hidden overflow-x-auto lg:block">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-[#fbfaf8] text-xs font-black uppercase tracking-wide text-[#6b6f76]">
          <tr>
            <th className="px-4 py-3">Player</th>
            <th className="px-4 py-3">Team</th>
            <th className="px-4 py-3">Guardian</th>
            <th className="px-4 py-3">Payment</th>
            <th className="px-4 py-3">Monthly fee</th>
            <th className="px-4 py-3">Photo</th>
            <th className="sticky right-0 bg-[#fbfaf8] px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#eee8e2]">
          {members.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              onOpen={() => onOpen(member.id)}
              onEdit={() => onEdit(member)}
              onRemove={() => onRemove(member.id)}
              onRecordPayment={() => onRecordPayment(member.id)}
            />
          ))}
        </tbody>
      </table>

      {members.length === 0 && <EmptyState onAdd={onAdd} />}
    </div>
  );
}

function MemberRow({
  member,
  onOpen,
  onEdit,
  onRemove,
  onRecordPayment,
}: {
  member: Member;
  onOpen: () => void;
  onEdit: () => void;
  onRemove: () => void;
  onRecordPayment: () => void;
}) {
  const state = renewalState(member);

  return (
    <tr className="transition-colors hover:bg-[#fbfaf8]">
      <td className="px-4 py-4">
        <p className="font-bold text-[#111217]">{playerName(member)}</p>
        <p className="mt-1 text-xs text-[#6b6f76]">Joined {formatDate(member.joinDate)}</p>
      </td>
      <td className="px-4 py-4">
        <TeamBadge team={member.team} />
      </td>
      <td className="px-4 py-4">
        <p className="font-medium text-[#111217]">{member.guardianName}</p>
        <p className="mt-1 text-xs text-[#6b6f76]">{member.guardianPhone}</p>
      </td>
      <td className="px-4 py-4">
        <PaymentCell state={state} nextPayment={member.nextRenewal} />
      </td>
      <td className="px-4 py-4 font-bold text-[#111217]">
        {formatZAR(memberMonthlyFeeCents(member))}
      </td>
      <td className="px-4 py-4">
        <PhotoConsentBadge consent={member.photoConsent} />
      </td>
      <td className="sticky right-0 bg-white px-4 py-4 shadow-[-12px_0_18px_rgba(255,255,255,0.85)]">
        <DesktopRowAction
          member={member}
          state={state}
          onOpen={onOpen}
          onEdit={onEdit}
          onRemove={onRemove}
          onRecordPayment={onRecordPayment}
        />
      </td>
    </tr>
  );
}

function PaymentCell({ state, nextPayment }: { state: RenewalState; nextPayment: string }) {
  return (
    <div className="flex flex-col items-start gap-1.5">
      <RenewalBadge state={state} />
      <span className="text-xs text-[#6b6f76]">Next {formatDate(nextPayment)}</span>
    </div>
  );
}

function DesktopRowAction({
  member,
  state,
  onOpen,
  onEdit,
  onRemove,
  onRecordPayment,
}: {
  member: Member;
  state: RenewalState;
  onOpen: () => void;
  onEdit: () => void;
  onRemove: () => void;
  onRecordPayment: () => void;
}) {
  return (
    <AdminActionGroup>
      {isPaymentFollowUp(member) && state !== "inactive" && (
        <AdminIconButton label="Record payment" icon={CreditCard} tone="primary" onClick={onRecordPayment} />
      )}
      <AdminIconButton label="View member" icon={Eye} onClick={onOpen} />
      <AdminIconButton label="Edit member" icon={Pencil} onClick={onEdit} />
      <AdminIconLink
        href={waLink(member.guardianPhone)}
        target="_blank"
        rel="noreferrer"
        tone="whatsapp"
        icon={MessageCircle}
        label={`WhatsApp ${member.guardianName}`}
      />
      <AdminIconButton label="Remove member" icon={Trash2} tone="danger" onClick={onRemove} />
    </AdminActionGroup>
  );
}

function MobileMemberCards({
  members,
  onOpen,
  onEdit,
  onRemove,
  onRecordPayment,
  onAdd,
}: {
  members: Member[];
  onOpen: (id: string) => void;
  onEdit: (m: Member) => void;
  onRemove: (id: string) => void;
  onRecordPayment: (id: string) => void;
  onAdd: () => void;
}) {
  return (
    <div className="space-y-3 p-4 lg:hidden">
      {members.map((member) => (
        <MemberCard
          key={member.id}
          member={member}
          onOpen={() => onOpen(member.id)}
          onEdit={() => onEdit(member)}
          onRemove={() => onRemove(member.id)}
          onRecordPayment={() => onRecordPayment(member.id)}
        />
      ))}

      {members.length === 0 && <EmptyState onAdd={onAdd} />}
    </div>
  );
}

function MemberCard({
  member,
  onOpen,
  onEdit,
  onRemove,
  onRecordPayment,
}: {
  member: Member;
  onOpen: () => void;
  onEdit: () => void;
  onRemove: () => void;
  onRecordPayment: () => void;
}) {
  const state = renewalState(member);

  return (
    <article className="rounded-2xl border border-[#e7e2dc] bg-white p-4 shadow-[0_10px_26px_rgba(17,18,23,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-black leading-tight text-[#111217]">{playerName(member)}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <TeamBadge team={member.team} />
            <RenewalBadge state={state} />
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm text-[#34363d]">
        <p>
          <span className="font-semibold text-[#111217]">Guardian:</span> {member.guardianName}
        </p>
        <p>
          <span className="font-semibold text-[#111217]">WhatsApp:</span>{" "}
          <WhatsAppLink phone={member.guardianPhone} className="text-sm" />
        </p>
        <p>
          <span className="font-semibold text-[#111217]">Next payment:</span>{" "}
          {formatDate(member.nextRenewal)}
        </p>
        <p>
          <span className="font-semibold text-[#111217]">Monthly fee:</span>{" "}
          {formatZAR(memberMonthlyFeeCents(member))}
        </p>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#111217]">Photo consent:</span>
          <PhotoConsentBadge consent={member.photoConsent} />
        </div>
      </div>

      <div className="mt-4 border-t border-[#eee8e2] pt-3">
        <AdminActionGroup>
          {isPaymentFollowUp(member) && (
            <AdminIconButton label="Record payment" icon={CreditCard} tone="primary" onClick={onRecordPayment} />
          )}
          <AdminIconButton label="View member" icon={Eye} onClick={onOpen} />
          <AdminIconButton label="Edit member" icon={Pencil} onClick={onEdit} />
          <AdminIconLink
            href={waLink(member.guardianPhone)}
            target="_blank"
            rel="noreferrer"
            tone="whatsapp"
            icon={MessageCircle}
            label={`WhatsApp ${member.guardianName}`}
          />
          <AdminIconButton label="Remove member" icon={Trash2} tone="danger" onClick={onRemove} />
        </AdminActionGroup>
      </div>
    </article>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-sm font-bold text-[#111217]">No members yet.</p>
      <p className="mt-1 text-xs text-[#6b6f76]">Add your first player to get started.</p>
      <Button type="button" onClick={onAdd} className="mt-5">
        <Plus /> Add member
      </Button>
    </div>
  );
}

function TeamBadge({ team }: { team: AgeGroup }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#f4f2ef] px-2.5 py-1 text-xs font-black text-[#34363d]">
      {team}
    </span>
  );
}

function MemberDetail({
  member,
  onPaid,
  onTogglePhotoConsent,
}: {
  member: Member;
  onPaid: () => void;
  onTogglePhotoConsent: (consent: boolean) => void;
}) {
  const state = renewalState(member);
  const joiningDue = memberJoiningFeeDueCents(member);
  const totalDue = memberPaymentDueCents(member);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 rounded-2xl bg-secondary p-5 text-sm sm:grid-cols-2">
        <Info label="Team" value={member.team} />
        <Info label="Guardian" value={member.guardianName} />
        <Info label="Phone" value={<WhatsAppLink phone={member.guardianPhone} />} />
        <Info label="Email" value={member.guardianEmail || "-"} />
        <Info label="Joined" value={formatDate(member.joinDate)} />
        <Info label="Next payment" value={formatDate(member.nextRenewal)} />
      </div>

      {/* Photo consent */}
      <div className="rounded-2xl border border-[#e7e2dc] bg-white p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-[#111217]">Photo &amp; video consent</p>
            <p className="mt-0.5 text-xs text-[#6b6f76]">
              Permission to publish images of this player on the website and social media.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onTogglePhotoConsent(!member.photoConsent)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
              member.photoConsent
                ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                : "border-[#e7e2dc] bg-[#fbfaf8] text-[#6b6f76] hover:border-primary/40 hover:text-primary"
            )}
          >
            {member.photoConsent ? (
              <><Camera className="size-4" /> Consented</>
            ) : (
              <><CameraOff className="size-4" /> Not given</>
            )}
          </button>
        </div>
      </div>

      <Card className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-foreground">Monthly membership</p>
            <p className="mt-1 font-heading text-3xl font-black text-[#111217]">
              {formatZAR(memberMonthlyFeeCents(member))}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Joining fee:{" "}
              {joiningDue > 0
                ? `${formatZAR(joiningDue)} still due`
                : `${formatZAR(member.joiningFeeCents)} paid`}
            </p>
            <p className="mt-2 text-sm font-bold text-foreground">
              Amount due now: {formatZAR(totalDue)}
            </p>
            <div className="mt-2">
              <RenewalBadge state={state} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={onPaid} disabled={state === "inactive"}>
              Mark paid
            </Button>
            <Button type="button" variant="outline" disabled title="Future payment gateway">
              <CreditCard /> Pay online soon
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1 font-semibold text-foreground">{value}</div>
    </div>
  );
}

function playerName(member: Member) {
  return `${member.firstName} ${member.lastName}`.trim();
}

function PhotoConsentBadge({ consent }: { consent?: boolean }) {
  if (consent) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
        <Camera className="size-3" /> Yes
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#f8f5f2] px-2.5 py-1 text-xs font-semibold text-[#8b8f96]">
      <CameraOff className="size-3" /> No
    </span>
  );
}
