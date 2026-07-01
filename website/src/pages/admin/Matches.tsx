import { useState } from "react";
import { CalendarDays, Plus, Trophy, Trash2, Pencil } from "lucide-react";
import { useAdmin } from "@/admin/store";
import { AGE_GROUPS, type AgeGroup, matchOutcome, type Match } from "@/admin/types";
import { AdminHeader, AdminIconButton, Card, Modal, formatDate, useConfirm, useToast } from "@/components/admin/ui";
import { Select, DatePicker } from "@/components/admin/controls";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { cn } from "@/lib/utils";

const OUTCOME_CLS: Record<string, string> = {
  W: "bg-green-100 text-green-700",
  D: "bg-amber-100 text-amber-700",
  L: "bg-red-100 text-red-700",
};

export function AdminMatches() {
  const { matches, addMatch, updateMatch, removeMatch } = useAdmin();
  const confirm = useConfirm();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [mode, setMode] = useState<"upcoming" | "played">("upcoming");
  const [team, setTeam] = useState<AgeGroup>("U13");
  const [opponent, setOpponent] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [gf, setGf] = useState("");
  const [ga, setGa] = useState("");

  const fixtures = matches
    .filter((m) => m.status === "upcoming")
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const results = matches
    .filter((m) => m.status === "played")
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));

  const canSubmit = opponent.trim() && date && (mode === "upcoming" || (gf !== "" && ga !== ""));

  function reset() {
    setEditingId(null);
    setMode("upcoming");
    setTeam("U13");
    setOpponent("");
    setDate("");
    setVenue("");
    setGf("");
    setGa("");
  }

  function openAdd() {
    reset();
    setOpen(true);
  }

  function startEdit(m: Match) {
    setEditingId(m.id);
    setMode(m.status);
    setTeam(m.team);
    setOpponent(m.opponent);
    setDate(m.date);
    setVenue(m.venue ?? "");
    setGf(m.gf != null ? String(m.gf) : "");
    setGa(m.ga != null ? String(m.ga) : "");
    setOpen(true);
  }

  function close() {
    setOpen(false);
    reset();
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    const payload = {
      team,
      opponent: opponent.trim(),
      date,
      venue: venue.trim() || undefined,
      status: mode,
      gf: mode === "played" ? Number(gf) : undefined,
      ga: mode === "played" ? Number(ga) : undefined,
    };
    if (editingId) { updateMatch(editingId, payload); toast("Match updated."); }
    else { addMatch(payload); toast("Match added."); }
    close();
  }

  const isEmpty = matches.length === 0;

  return (
    <>
      <AdminHeader
        title="Fixtures & results"
        subtitle="Add upcoming fixtures and past results. These appear on the public Teams page."
        actions={
          <Button type="button" onClick={openAdd}>
            <Plus /> Add match
          </Button>
        }
      />

      {isEmpty ? (
        <Card className="border-[#e7e2dc] bg-white shadow-[0_16px_42px_rgba(17,18,23,0.05)]">
          <EmptyState onAdd={openAdd} />
        </Card>
      ) : (
        <div className="space-y-6">
          <MatchTable
            title="Upcoming fixtures"
            icon={CalendarDays}
            matches={fixtures}
            empty="No fixtures yet."
            onEdit={startEdit}
            onRemove={async (id) => {
              const m = matches.find((x) => x.id === id);
              const ok = await confirm({
                title: "Remove match?",
                message: `${m ? `${m.team} vs ${m.opponent} on ${m.date}` : "This match"} will be permanently removed.`,
                danger: true,
              });
              if (ok) { removeMatch(id); toast("Match removed.", "danger"); }
            }}
          />
          <MatchTable
            title="Recent results"
            icon={Trophy}
            matches={results}
            empty="No results yet."
            onEdit={startEdit}
            onRemove={async (id) => {
              const m = matches.find((x) => x.id === id);
              const ok = await confirm({
                title: "Remove match?",
                message: `${m ? `${m.team} vs ${m.opponent} on ${m.date}` : "This match"} will be permanently removed.`,
                danger: true,
              });
              if (ok) { removeMatch(id); toast("Match removed.", "danger"); }
            }}
          />
        </div>
      )}

      <Modal
        title={editingId ? "Edit match" : "Add a match"}
        open={open}
        onClose={close}
      >
        <form onSubmit={submit} className="space-y-4">
          <div className="inline-flex rounded-full border border-[#e7e2dc] bg-[#f8f5f2] p-1 text-sm font-semibold">
            {(["upcoming", "played"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={cn(
                  "rounded-full px-4 py-1.5 capitalize transition",
                  mode === m ? "bg-white text-[#111217] shadow-sm" : "text-[#6b6f76]"
                )}
              >
                {m === "upcoming" ? "Fixture" : "Result"}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Team" required>
              <Select
                value={team}
                onChange={(v) => setTeam(v as AgeGroup)}
                options={AGE_GROUPS.map((t) => ({ value: t, label: t }))}
              />
            </Field>
            <Field label="Date" required>
              <DatePicker value={date} onChange={setDate} />
            </Field>
          </div>
          <Field label="Opponent" required>
            <Input
              value={opponent}
              onChange={(e) => setOpponent(e.target.value)}
              placeholder="e.g. Mamelodi Sundowns Dev"
            />
          </Field>
          <Field label="Venue" optional>
            <Input
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g. Midrand"
            />
          </Field>

          {mode === "played" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="GKSA score" required>
                <Input
                  type="number"
                  min={0}
                  value={gf}
                  onChange={(e) => setGf(e.target.value)}
                  placeholder="0"
                />
              </Field>
              <Field label="Opponent score" required>
                <Input
                  type="number"
                  min={0}
                  value={ga}
                  onChange={(e) => setGa(e.target.value)}
                  placeholder="0"
                />
              </Field>
            </div>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={!canSubmit}>
            {editingId ? "Save changes" : `Add ${mode === "upcoming" ? "fixture" : "result"}`}
          </Button>
        </form>
      </Modal>
    </>
  );
}

function MatchTable({
  title,
  icon: Icon,
  matches,
  empty,
  onEdit,
  onRemove,
}: {
  title: string;
  icon: typeof CalendarDays;
  matches: Match[];
  empty: string;
  onEdit: (m: Match) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <Card className="overflow-hidden border-[#e7e2dc] bg-white shadow-[0_16px_42px_rgba(17,18,23,0.05)]">
      <div className="flex items-center gap-2 border-b border-[#eee8e2] px-5 py-4">
        <Icon className="size-5 text-primary" />
        <h2 className="font-heading text-lg font-black text-[#111217]">
          {title}{" "}
          <span className="font-normal text-[#9a9690]">({matches.length})</span>
        </h2>
      </div>

      {matches.length === 0 ? (
        <p className="px-5 py-6 text-sm text-[#6b6f76]">{empty}</p>
      ) : (
        <>
          {/* desktop */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#fbfaf8] text-xs font-black uppercase tracking-wide text-[#6b6f76]">
                <tr>
                  <th className="px-5 py-3">Team</th>
                  <th className="px-5 py-3">Opponent</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Venue</th>
                  <th className="px-5 py-3">Result</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eee8e2]">
                {matches.map((m) => {
                  const outcome = matchOutcome(m);
                  return (
                    <tr key={m.id} className="transition-colors hover:bg-[#fbfaf8]">
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                          {m.team}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-bold text-[#111217]">vs {m.opponent}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-[#6b6f76]">
                        {formatDate(m.date)}
                      </td>
                      <td className="px-5 py-4 text-[#6b6f76]">{m.venue || "—"}</td>
                      <td className="px-5 py-4">
                        {outcome ? (
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-1 text-xs font-bold",
                              OUTCOME_CLS[outcome]
                            )}
                          >
                            {outcome} {m.gf}-{m.ga}
                          </span>
                        ) : (
                          <span className="text-[#9a9690]">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <AdminIconButton
                            label="Edit"
                            icon={Pencil}
                            onClick={() => onEdit(m)}
                          />
                          <AdminIconButton
                            label="Remove"
                            icon={Trash2}
                            tone="danger"
                            onClick={() => onRemove(m.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* mobile cards */}
          <div className="space-y-3 p-4 lg:hidden">
            {matches.map((m) => {
              const outcome = matchOutcome(m);
              return (
                <article
                  key={m.id}
                  className="rounded-2xl border border-[#e7e2dc] bg-white p-4 shadow-[0_4px_12px_rgba(17,18,23,0.04)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-[#111217]">vs {m.opponent}</p>
                      <div className="mt-1.5 flex flex-wrap gap-2">
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                          {m.team}
                        </span>
                        {outcome && (
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-0.5 text-xs font-bold",
                              OUTCOME_CLS[outcome]
                            )}
                          >
                            {outcome} {m.gf}-{m.ga}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-[#6b6f76]">
                        {formatDate(m.date)}
                        {m.venue ? ` · ${m.venue}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <AdminIconButton label="Edit" icon={Pencil} onClick={() => onEdit(m)} />
                      <AdminIconButton
                        label="Remove"
                        icon={Trash2}
                        tone="danger"
                        onClick={() => onRemove(m.id)}
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </Card>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <CalendarDays className="size-10 text-[#d9d2ca]" />
      <p className="mt-3 text-sm font-bold text-[#111217]">No matches yet.</p>
      <p className="mt-1 text-xs text-[#6b6f76]">Add your first fixture or result.</p>
      <Button type="button" onClick={onAdd} className="mt-5">
        <Plus /> Add match
      </Button>
    </div>
  );
}
