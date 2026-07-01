import { useRef, useState } from "react";
import {
  CheckCircle2,
  Clock,
  HandshakeIcon,
  Link2,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { useAdmin, type NewSponsor } from "@/admin/store";
import type { Sponsor } from "@/admin/types";
import { AdminHeader, AdminIconButton, Card, Modal, useConfirm } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { cn } from "@/lib/utils";

const TIERS = [
  "Platinum",
  "Golden",
  "Silver",
  "Community Partner",
  "Hydration Partner",
  "Custom / In-kind",
];

const empty: NewSponsor = {
  name: "",
  tier: TIERS[0],
  tagline: "",
  description: "",
  logo: "",
  website: "",
  status: "pending",
};

function sponsorToForm(s: Sponsor): NewSponsor {
  return {
    name: s.name,
    tier: s.tier,
    tagline: s.tagline ?? "",
    description: s.description ?? "",
    logo: s.logo ?? "",
    website: s.website ?? "",
    status: s.status,
  };
}

export function AdminSponsors() {
  const { sponsors, addSponsor, updateSponsor, removeSponsor } = useAdmin();
  const confirm = useConfirm();
  const fileRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<NewSponsor>(empty);
  const [logoMode, setLogoMode] = useState<"upload" | "url">("upload");

  const set = <K extends keyof NewSponsor>(key: K, value: NewSponsor[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  function openAdd() {
    setEditingId(null);
    setForm(empty);
    setLogoMode("upload");
    setOpen(true);
  }

  function startEdit(s: Sponsor) {
    setEditingId(s.id);
    setForm(sponsorToForm(s));
    setLogoMode(s.logo?.startsWith("data:") ? "upload" : "url");
    setOpen(true);
  }

  function close() {
    setOpen(false);
    setEditingId(null);
    setForm(empty);
    if (fileRef.current) fileRef.current.value = "";
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set("logo", reader.result as string);
    reader.readAsDataURL(file);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editingId) {
      updateSponsor(editingId, { ...form, name: form.name.trim() });
    } else {
      addSponsor({ ...form, name: form.name.trim() });
    }
    close();
  }

  const approved = sponsors.filter((s) => s.status === "approved");
  const pending = sponsors.filter((s) => s.status === "pending");

  return (
    <>
      <AdminHeader
        title="Sponsors"
        subtitle="Manage partners — approved sponsors appear on the public Sponsors page."
        actions={
          <Button type="button" onClick={openAdd}>
            <Plus /> Add sponsor
          </Button>
        }
      />

      {sponsors.length === 0 ? (
        <Card className="border-[#e7e2dc] bg-white shadow-[0_16px_42px_rgba(17,18,23,0.05)]">
          <EmptyState onAdd={openAdd} />
        </Card>
      ) : (
        <div className="space-y-6">
          <SponsorTable
            title="Approved"
            icon={<CheckCircle2 className="size-5 text-green-600" />}
            sponsors={approved}
            empty="No approved sponsors yet."
            onEdit={startEdit}
            onApprove={(id) => updateSponsor(id, { status: "approved" })}
            onRemove={async (id) => {
              const s = sponsors.find((x) => x.id === id);
              const ok = await confirm({
                title: "Remove sponsor?",
                message: `"${s?.name ?? "This sponsor"}" will be permanently removed.`,
                danger: true,
              });
              if (ok) removeSponsor(id);
            }}
          />
          <SponsorTable
            title="Pending"
            icon={<Clock className="size-5 text-amber-500" />}
            sponsors={pending}
            empty="No pending sponsors."
            onEdit={startEdit}
            onApprove={(id) => updateSponsor(id, { status: "approved" })}
            onRemove={async (id) => {
              const s = sponsors.find((x) => x.id === id);
              const ok = await confirm({
                title: "Remove sponsor?",
                message: `"${s?.name ?? "This sponsor"}" will be permanently removed.`,
                danger: true,
              });
              if (ok) removeSponsor(id);
            }}
          />
        </div>
      )}

      <Modal
        title={editingId ? "Edit sponsor" : "Add sponsor"}
        open={open}
        onClose={close}
      >
        <form onSubmit={submit} className="space-y-4">
          <Field label="Organisation name" required>
            <Input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Company or brand name"
            />
          </Field>

          <Field label="Tier">
            <div className="grid grid-cols-2 gap-2">
              {TIERS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set("tier", t)}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-left text-sm font-semibold transition",
                    form.tier === t
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-[#e7e2dc] bg-[#fbfaf8] text-[#34363d] hover:border-primary/40"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Tagline" optional hint="Short label shown on the site (e.g. 'Official hydration partner').">
            <Input
              value={form.tagline}
              onChange={(e) => set("tagline", e.target.value)}
              placeholder="Official hydration partner"
            />
          </Field>

          <Field label="Description" optional>
            <Textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="What this sponsor contributes to the academy..."
              className="min-h-24"
            />
          </Field>

          <Field label="Website" optional>
            <Input
              value={form.website}
              onChange={(e) => set("website", e.target.value)}
              placeholder="https://..."
            />
          </Field>

          <div>
            <div className="mb-2 inline-flex rounded-full border border-[#e7e2dc] bg-[#f8f5f2] p-1 text-sm font-semibold">
              <button
                type="button"
                onClick={() => setLogoMode("upload")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 transition",
                  logoMode === "upload" ? "bg-white text-[#111217] shadow-sm" : "text-[#6b6f76]"
                )}
              >
                <Upload className="size-4" /> Upload logo
              </button>
              <button
                type="button"
                onClick={() => setLogoMode("url")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 transition",
                  logoMode === "url" ? "bg-white text-[#111217] shadow-sm" : "text-[#6b6f76]"
                )}
              >
                <Link2 className="size-4" /> URL
              </button>
            </div>
            {logoMode === "upload" ? (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#cfc8c0] bg-[#fbfaf8] py-4 text-sm font-semibold text-[#6b6f76] transition hover:border-primary hover:text-primary"
              >
                {form.logo ? "Replace logo image" : "Choose a logo image"}
                <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
              </button>
            ) : (
              <Input
                value={form.logo}
                onChange={(e) => set("logo", e.target.value)}
                placeholder="https://..."
              />
            )}
            {form.logo && (
              <div className="mt-3 flex items-center justify-center rounded-xl border border-[#e7e2dc] bg-white p-4">
                <img src={form.logo} alt="Logo preview" className="max-h-20 max-w-full object-contain" />
              </div>
            )}
          </div>

          <Field label="Status">
            <div className="flex gap-2">
              {(["pending", "approved"] as Sponsor["status"][]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set("status", s)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition",
                    form.status === s
                      ? s === "approved"
                        ? "border-green-300 bg-green-50 text-green-700"
                        : "border-amber-300 bg-amber-50 text-amber-700"
                      : "border-[#e7e2dc] bg-[#fbfaf8] text-[#6b6f76] hover:border-primary/40"
                  )}
                >
                  {s === "approved" ? (
                    <CheckCircle2 className="size-4" />
                  ) : (
                    <Clock className="size-4" />
                  )}
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </Field>

          <Button type="submit" size="lg" className="w-full" disabled={!form.name.trim()}>
            {editingId ? "Save changes" : "Add sponsor"}
          </Button>
        </form>
      </Modal>
    </>
  );
}

function SponsorTable({
  title,
  icon,
  sponsors,
  empty,
  onEdit,
  onApprove,
  onRemove,
}: {
  title: string;
  icon: React.ReactNode;
  sponsors: Sponsor[];
  empty: string;
  onEdit: (s: Sponsor) => void;
  onApprove: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <Card className="overflow-hidden border-[#e7e2dc] bg-white shadow-[0_16px_42px_rgba(17,18,23,0.05)]">
      <div className="flex items-center gap-2 border-b border-[#eee8e2] px-5 py-4">
        {icon}
        <h2 className="font-heading text-lg font-black text-[#111217]">
          {title}{" "}
          <span className="font-normal text-[#9a9690]">({sponsors.length})</span>
        </h2>
      </div>

      {sponsors.length === 0 ? (
        <p className="px-5 py-6 text-sm text-[#6b6f76]">{empty}</p>
      ) : (
        <>
          {/* desktop */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#fbfaf8] text-xs font-black uppercase tracking-wide text-[#6b6f76]">
                <tr>
                  <th className="px-5 py-3">Sponsor</th>
                  <th className="px-5 py-3">Tier</th>
                  <th className="px-5 py-3">Tagline</th>
                  <th className="px-5 py-3">Website</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eee8e2]">
                {sponsors.map((s) => (
                  <tr key={s.id} className="transition-colors hover:bg-[#fbfaf8]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#e7e2dc] bg-white p-1">
                          {s.logo ? (
                            <img
                              src={s.logo}
                              alt={s.name}
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <HandshakeIcon className="size-5 text-[#cfc8c0]" />
                          )}
                        </div>
                        <p className="font-bold text-[#111217]">{s.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                        {s.tier}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#6b6f76]">{s.tagline || "—"}</td>
                    <td className="px-5 py-4">
                      {s.website ? (
                        <a
                          href={s.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          Visit
                        </a>
                      ) : (
                        <span className="text-[#9a9690]">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <AdminIconButton label="Edit" icon={Pencil} onClick={() => onEdit(s)} />
                        {s.status === "pending" && (
                          <AdminIconButton
                            label="Approve"
                            icon={CheckCircle2}
                            tone="success"
                            onClick={() => onApprove(s.id)}
                          />
                        )}
                        <AdminIconButton
                          label="Remove"
                          icon={Trash2}
                          tone="danger"
                          onClick={() => onRemove(s.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* mobile cards */}
          <div className="space-y-3 p-4 lg:hidden">
            {sponsors.map((s) => (
              <article
                key={s.id}
                className="flex items-center gap-3 rounded-2xl border border-[#e7e2dc] bg-white p-3 shadow-[0_4px_12px_rgba(17,18,23,0.04)]"
              >
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-[#e7e2dc] bg-white p-1">
                  {s.logo ? (
                    <img src={s.logo} alt={s.name} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <HandshakeIcon className="size-6 text-[#cfc8c0]" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-[#111217]">{s.name}</p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      {s.tier}
                    </span>
                    {s.tagline && (
                      <span className="truncate text-xs text-[#9a9690]">{s.tagline}</span>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <AdminIconButton label="Edit" icon={Pencil} onClick={() => onEdit(s)} />
                  {s.status === "pending" && (
                    <AdminIconButton
                      label="Approve"
                      icon={CheckCircle2}
                      tone="success"
                      onClick={() => onApprove(s.id)}
                    />
                  )}
                  <AdminIconButton
                    label="Remove"
                    icon={Trash2}
                    tone="danger"
                    onClick={() => onRemove(s.id)}
                  />
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <HandshakeIcon className="size-10 text-[#d9d2ca]" />
      <p className="mt-3 text-sm font-bold text-[#111217]">No sponsors yet.</p>
      <p className="mt-1 text-xs text-[#6b6f76]">Add a partner to get started.</p>
      <Button type="button" onClick={onAdd} className="mt-5">
        <Plus /> Add sponsor
      </Button>
    </div>
  );
}
