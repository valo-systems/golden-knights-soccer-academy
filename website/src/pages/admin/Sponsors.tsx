import { useRef, useState } from "react";
import { HandshakeIcon, Trash2, Upload, Link2, CheckCircle2, Clock, Pencil, X } from "lucide-react";
import { useAdmin, type NewSponsor } from "@/admin/store";
import type { Sponsor } from "@/admin/types";
import { AdminHeader, Card, AdminIconButton } from "@/components/admin/ui";
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
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<NewSponsor>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [logoMode, setLogoMode] = useState<"upload" | "url">("upload");

  const set = <K extends keyof NewSponsor>(key: K, value: NewSponsor[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  function startEdit(s: Sponsor) {
    setEditingId(s.id);
    setForm(sponsorToForm(s));
    setLogoMode(s.logo?.startsWith("data:") ? "upload" : "url");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
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
      setEditingId(null);
    } else {
      addSponsor({ ...form, name: form.name.trim() });
    }
    setForm(empty);
    if (fileRef.current) fileRef.current.value = "";
  }

  const approved = sponsors.filter((s) => s.status === "approved");
  const pending = sponsors.filter((s) => s.status === "pending");

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Sponsors"
        subtitle="Manage partners — approved sponsors appear on the public Sponsors page."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* add / edit form */}
        <Card className="h-fit p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-xl font-black text-[#111217]">
              {editingId ? "Edit sponsor" : "Add sponsor"}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="inline-flex items-center gap-1 rounded-full border border-[#e7e2dc] bg-[#fbfaf8] px-3 py-1.5 text-xs font-semibold text-[#6b6f76] transition hover:bg-[#f0ede8]"
              >
                <X className="size-3.5" /> Cancel
              </button>
            )}
          </div>

          <form onSubmit={submit} className="mt-5 space-y-4">
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

            {/* logo */}
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
                    {s === "approved" ? <CheckCircle2 className="size-4" /> : <Clock className="size-4" />}
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </Field>

            <Button type="submit" size="lg" className="w-full" disabled={!form.name.trim()}>
              {editingId ? "Save changes" : "Add sponsor"}
            </Button>
          </form>
        </Card>

        {/* lists */}
        <div className="space-y-4">
          <SponsorList
            title="Approved"
            icon={<CheckCircle2 className="size-5 text-green-600" />}
            sponsors={approved}
            editingId={editingId}
            onEdit={startEdit}
            onApprove={(id) => updateSponsor(id, { status: "approved" })}
            onRemove={removeSponsor}
            emptyMsg="No approved sponsors yet."
          />
          <SponsorList
            title="Pending"
            icon={<Clock className="size-5 text-amber-500" />}
            sponsors={pending}
            editingId={editingId}
            onEdit={startEdit}
            onApprove={(id) => updateSponsor(id, { status: "approved" })}
            onRemove={removeSponsor}
            emptyMsg="No pending sponsors."
          />
        </div>
      </div>
    </div>
  );
}

function SponsorList({
  title,
  icon,
  sponsors,
  editingId,
  onEdit,
  onApprove,
  onRemove,
  emptyMsg,
}: {
  title: string;
  icon: React.ReactNode;
  sponsors: Sponsor[];
  editingId: string | null;
  onEdit: (s: Sponsor) => void;
  onApprove: (id: string) => void;
  onRemove: (id: string) => void;
  emptyMsg: string;
}) {
  return (
    <Card className="p-6">
      <h2 className="flex items-center gap-2 font-heading text-xl font-black text-[#111217]">
        {icon} {title}{" "}
        <span className="text-[#9a9690]">({sponsors.length})</span>
      </h2>
      {sponsors.length === 0 ? (
        <p className="mt-4 text-sm text-[#6b6f76]">{emptyMsg}</p>
      ) : (
        <div className="mt-4 space-y-3">
          {sponsors.map((s) => (
            <div
              key={s.id}
              className={cn(
                "flex items-center gap-3 rounded-2xl border p-3 transition-colors",
                editingId === s.id
                  ? "border-primary/30 bg-primary/5"
                  : "border-[#eee8e2] bg-[#fbfaf8]"
              )}
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
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    {s.tier}
                  </span>
                  {s.tagline && (
                    <span className="truncate text-xs text-[#9a9690]">{s.tagline}</span>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <AdminIconButton
                  label="Edit"
                  icon={Pencil}
                  tone="neutral"
                  onClick={() => onEdit(s)}
                />
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
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
