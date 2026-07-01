import { useEffect, useMemo, useState, type FormEvent } from "react";
import { MessageCircle, Save } from "lucide-react";
import { getTeamSummaries, useAdmin } from "@/admin/store";
import { AGE_GROUPS, type AgeGroup, type Member } from "@/admin/types";
import { AdminHeader, Card, waLink } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { cn, formatZAR } from "@/lib/utils";

type SettingsTab = "fees" | "invite" | "teams";

const SETTINGS_TABS: { key: SettingsTab; label: string }[] = [
  { key: "fees", label: "Fees" },
  { key: "invite", label: "Invite" },
  { key: "teams", label: "Teams" },
];

const emptyInvite = {
  playerName: "",
  guardianName: "",
  phone: "",
  team: "U9" as AgeGroup,
};

export function AdminSettings() {
  const { members, fees, updateFeeSettings } = useAdmin();
  const [tab, setTab] = useState<SettingsTab>("fees");
  const [feeForm, setFeeForm] = useState({
    monthlyFee: "",
    joiningFee: "",
    applyToExisting: false,
  });
  const [invite, setInvite] = useState(emptyInvite);

  useEffect(() => {
    setFeeForm({
      monthlyFee: centsToRandInput(fees.monthlyFeeCents),
      joiningFee: centsToRandInput(fees.joiningFeeCents),
      applyToExisting: false,
    });
  }, [fees.monthlyFeeCents, fees.joiningFeeCents]);

  const inviteLink = useMemo(() => {
    if (!invite.phone.trim()) return "";
    const registerUrl = `${window.location.origin}/register`;
    const child = invite.playerName.trim() || "your child";
    const guardian = invite.guardianName.trim() || "there";
    const message = `Hi ${guardian}, Golden Knights Soccer Academy would like to invite ${child} to join the ${invite.team} group. Please complete the registration form here: ${registerUrl}`;
    return `${waLink(invite.phone)}?text=${encodeURIComponent(message)}`;
  }, [invite]);

  function saveFeeSettings(e: FormEvent) {
    e.preventDefault();
    updateFeeSettings(
      {
        monthlyFeeCents: randToCents(feeForm.monthlyFee),
        joiningFeeCents: randToCents(feeForm.joiningFee),
      },
      feeForm.applyToExisting
    );
  }

  return (
    <>
      <AdminHeader
        title="Settings"
        subtitle="Manage academy defaults and simple member invitations."
      />

      <Card className="mb-5 border-[#e7e2dc] bg-white p-2 shadow-[0_10px_28px_rgba(17,18,23,0.04)]">
        <div className="grid grid-cols-3 gap-2">
          {SETTINGS_TABS.map((item) => {
            const isActive = tab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={cn(
                  "rounded-xl px-4 py-3 text-sm font-black transition",
                  isActive
                    ? "bg-[#111217] text-white shadow-[0_10px_24px_rgba(17,18,23,0.12)]"
                    : "text-[#6b6f76] hover:bg-[#f8f5f2] hover:text-[#111217]"
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </Card>

      {tab === "fees" && (
        <Card className="border-[#e7e2dc] bg-white p-5 shadow-[0_16px_42px_rgba(17,18,23,0.05)]">
          <p className="font-bold text-[#111217]">Fees used for new members</p>
          <p className="mt-1 text-sm leading-relaxed text-[#6b6f76]">
            Used when adding a member or converting a prospect.
          </p>

          <form onSubmit={saveFeeSettings} className="mt-5 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Monthly fee (R)" required>
                <Input
                  inputMode="decimal"
                  value={feeForm.monthlyFee}
                  onChange={(e) =>
                    setFeeForm((previous) => ({ ...previous, monthlyFee: e.target.value }))
                  }
                />
              </Field>
              <Field label="Joining fee (R)" required>
                <Input
                  inputMode="decimal"
                  value={feeForm.joiningFee}
                  onChange={(e) =>
                    setFeeForm((previous) => ({ ...previous, joiningFee: e.target.value }))
                  }
                />
              </Field>
            </div>

            <label className="flex items-start gap-2 text-sm font-medium text-[#34363d]">
              <input
                type="checkbox"
                checked={feeForm.applyToExisting}
                onChange={(e) =>
                  setFeeForm((previous) => ({
                    ...previous,
                    applyToExisting: e.target.checked,
                  }))
                }
                className="mt-1 size-4 accent-[#111217]"
              />
              <span>Apply to existing active members</span>
            </label>
            <p className="-mt-2 text-xs leading-relaxed text-[#6b6f76]">
              Use this only when the monthly fee changes for everyone.
            </p>

            <Button type="submit" variant="dark" className="w-full sm:w-auto">
              <Save /> Save fee settings
            </Button>
          </form>
        </Card>
      )}

      {tab === "invite" && (
        <Card className="border-[#e7e2dc] bg-white p-5 shadow-[0_16px_42px_rgba(17,18,23,0.05)]">
          <p className="font-bold text-[#111217]">Invite a member</p>
          <p className="mt-1 text-sm leading-relaxed text-[#6b6f76]">
            Create a quick WhatsApp invite with the registration link.
          </p>

          <div className="mt-5 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Player name" optional>
                <Input
                  value={invite.playerName}
                  onChange={(e) =>
                    setInvite((previous) => ({ ...previous, playerName: e.target.value }))
                  }
                  placeholder="Player name"
                />
              </Field>
              <Field label="Team" required>
                <Select
                  value={invite.team}
                  onChange={(e) =>
                    setInvite((previous) => ({ ...previous, team: e.target.value as AgeGroup }))
                  }
                >
                  {AGE_GROUPS.map((team) => (
                    <option key={team}>{team}</option>
                  ))}
                </Select>
              </Field>
            </div>
            <Field label="Guardian name" optional>
              <Input
                value={invite.guardianName}
                onChange={(e) =>
                  setInvite((previous) => ({ ...previous, guardianName: e.target.value }))
                }
                placeholder="Guardian name"
              />
            </Field>
            <Field label="WhatsApp number" required>
              <Input
                value={invite.phone}
                onChange={(e) =>
                  setInvite((previous) => ({ ...previous, phone: e.target.value }))
                }
                placeholder="0xx xxx xxxx"
              />
            </Field>

            {inviteLink ? (
              <Button asChild className="w-full sm:w-auto">
                <a href={inviteLink} target="_blank" rel="noreferrer">
                  <MessageCircle /> Open WhatsApp invite
                </a>
              </Button>
            ) : (
              <Button type="button" disabled className="w-full sm:w-auto">
                <MessageCircle /> Open WhatsApp invite
              </Button>
            )}
          </div>
        </Card>
      )}

      {tab === "teams" && <TeamGroups members={members} />}
    </>
  );
}

function TeamGroups({ members }: { members: Member[] }) {
  const summaries = getTeamSummaries(members);

  return (
    <Card className="border-[#e7e2dc] bg-white p-5 shadow-[0_16px_42px_rgba(17,18,23,0.05)]">
      <p className="font-bold text-[#111217]">Team groups</p>
      <p className="mt-1 text-sm leading-relaxed text-[#6b6f76]">
        Players grouped by age group for coaches.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summaries.map(({ team, members: roster, count, monthlyTotalCents }) => {
          return (
            <div key={team} className="rounded-2xl border border-[#eee8e2] bg-[#fbfaf8] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-heading text-lg font-black text-[#111217]">{team}</p>
                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-black text-[#6b6f76] shadow-sm">
                  {count}
                </span>
              </div>
              <p className="mt-1 text-xs font-semibold text-[#6b6f76]">
                {formatZAR(monthlyTotalCents)} monthly
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {roster.length === 0 ? (
                  <span className="text-xs text-[#8b8f96]">No active players</span>
                ) : (
                  roster.map((member) => (
                    <span
                      key={member.id}
                      className="rounded-full border border-[#eee8e2] bg-white px-2.5 py-1 text-xs font-semibold text-[#34363d]"
                    >
                      {member.firstName}
                    </span>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function centsToRandInput(cents: number) {
  return String(cents / 100);
}

function randToCents(value: string) {
  const amount = Number(value.replace(",", "."));
  if (!Number.isFinite(amount)) return 0;
  return Math.round(amount * 100);
}
