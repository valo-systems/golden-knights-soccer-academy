import { useState } from "react";
import { CalendarDays, Trophy, Trash2, Pencil } from "lucide-react";
import { useAdmin } from "@/admin/store";
import { AGE_GROUPS, type AgeGroup, matchOutcome, type Match } from "@/admin/types";
import { AdminHeader, Card, AdminIconButton, formatDate } from "@/components/admin/ui";
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
    setOpponent("");
    setDate("");
    setVenue("");
    setGf("");
    setGa("");
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
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    if (editingId) updateMatch(editingId, payload);
    else addMatch(payload);
    reset();
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Fixtures & results"
        subtitle="Add upcoming fixtures and past results. These appear on the public Teams page."
      />

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* add */}
        <Card className="h-fit p-6">
          <h2 className="font-heading text-xl font-black text-[#111217]">
            {editingId ? "Edit match" : "Add a match"}
          </h2>

          <div className="mt-4 inline-flex rounded-full border border-[#e7e2dc] bg-[#f8f5f2] p-1 text-sm font-semibold">
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

          <form onSubmit={submit} className="mt-5 space-y-4">
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
              <Input value={opponent} onChange={(e) => setOpponent(e.target.value)} placeholder="e.g. Mamelodi Sundowns Dev" />
            </Field>
            <Field label="Venue" optional>
              <Input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="e.g. Midrand" />
            </Field>

            {mode === "played" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="GKSA score" required>
                  <Input type="number" min={0} value={gf} onChange={(e) => setGf(e.target.value)} placeholder="0" />
                </Field>
                <Field label="Opponent score" required>
                  <Input type="number" min={0} value={ga} onChange={(e) => setGa(e.target.value)} placeholder="0" />
                </Field>
              </div>
            )}

            <div className="flex gap-2">
              {editingId && (
                <Button type="button" size="lg" variant="outline" onClick={reset}>
                  Cancel
                </Button>
              )}
              <Button type="submit" size="lg" className="flex-1" disabled={!canSubmit}>
                {editingId ? "Save changes" : `Add ${mode === "upcoming" ? "fixture" : "result"}`}
              </Button>
            </div>
          </form>
        </Card>

        {/* lists */}
        <div className="space-y-6">
          <MatchList
            title="Upcoming fixtures"
            icon={CalendarDays}
            matches={fixtures}
            empty="No fixtures yet."
            editingId={editingId}
            onEdit={startEdit}
            onRemove={removeMatch}
          />
          <MatchList
            title="Recent results"
            icon={Trophy}
            matches={results}
            empty="No results yet."
            editingId={editingId}
            onEdit={startEdit}
            onRemove={removeMatch}
          />
        </div>
      </div>
    </div>
  );
}

function MatchList({
  title,
  icon: Icon,
  matches,
  empty,
  editingId,
  onEdit,
  onRemove,
}: {
  title: string;
  icon: typeof CalendarDays;
  matches: Match[];
  empty: string;
  editingId: string | null;
  onEdit: (m: Match) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <Card className="p-6">
      <h2 className="flex items-center gap-2 font-heading text-xl font-black text-[#111217]">
        <Icon className="size-5 text-primary" /> {title}
      </h2>
      {matches.length === 0 ? (
        <p className="mt-5 text-sm text-[#6b6f76]">{empty}</p>
      ) : (
        <div className="mt-4 space-y-2.5">
          {matches.map((m) => {
            const outcome = matchOutcome(m);
            return (
              <div
                key={m.id}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border bg-[#fbfaf8] p-3",
                  editingId === m.id ? "border-primary ring-1 ring-primary/30" : "border-[#eee8e2]"
                )}
              >
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                  {m.team}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-[#111217]">vs {m.opponent}</p>
                  <p className="text-xs text-[#6b6f76]">
                    {formatDate(m.date)}
                    {m.venue ? ` · ${m.venue}` : ""}
                  </p>
                </div>
                {outcome && (
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold", OUTCOME_CLS[outcome])}>
                    {outcome} {m.gf}-{m.ga}
                  </span>
                )}
                <AdminIconButton label="Edit" icon={Pencil} onClick={() => onEdit(m)} />
                <AdminIconButton label="Remove" icon={Trash2} tone="danger" onClick={() => onRemove(m.id)} />
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
