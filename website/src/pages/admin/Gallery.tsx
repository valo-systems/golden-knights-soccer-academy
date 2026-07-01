import { useRef, useState } from "react";
import { ChevronDown, ChevronUp, ImagePlus, Link2, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { useAdmin } from "@/admin/store";
import { GALLERY_CATEGORIES, type GalleryCategory, type GalleryPhoto } from "@/admin/types";
import { AdminHeader, AdminIconButton, Card, Modal, useConfirm } from "@/components/admin/ui";
import { Select } from "@/components/admin/controls";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { cn } from "@/lib/utils";

export function AdminGallery() {
  const { galleryPhotos, addGalleryPhoto, updateGalleryPhoto, removeGalleryPhoto, moveGalleryPhoto } = useAdmin();
  const confirm = useConfirm();
  const fileRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [src, setSrc] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState<GalleryCategory>("Match days");
  const [mode, setMode] = useState<"upload" | "url">("upload");

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setSrc(reader.result as string);
    reader.readAsDataURL(file);
  }

  function openAdd() {
    setEditingId(null);
    setSrc(""); setCaption(""); setCategory("Match days"); setMode("upload");
    setOpen(true);
  }

  function startEdit(p: GalleryPhoto) {
    setEditingId(p.id);
    setSrc(p.src);
    setCaption(p.caption ?? "");
    setCategory(p.category);
    setMode(p.src.startsWith("data:") ? "upload" : "url");
    setOpen(true);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!src) return;
    if (editingId) {
      updateGalleryPhoto(editingId, { caption: caption.trim() || undefined, category });
    } else {
      addGalleryPhoto({ src, caption: caption.trim() || undefined, category });
    }
    close();
  }

  function close() {
    setOpen(false);
    setEditingId(null);
    setSrc(""); setCaption("");
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <>
      <AdminHeader
        title="Gallery"
        subtitle="Add and arrange the photos shown on the public gallery page."
        actions={
          <>
            <p className="self-center text-xs text-[#9a9690]">Order here is the order shown publicly.</p>
            <Button type="button" onClick={openAdd}>
              <Plus /> Add photo
            </Button>
          </>
        }
      />

      <Card className="overflow-hidden border-[#e7e2dc] bg-white shadow-[0_16px_42px_rgba(17,18,23,0.05)]">
        {galleryPhotos.length === 0 ? (
          <EmptyState onAdd={openAdd} />
        ) : (
          <>
            {/* desktop table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#fbfaf8] text-xs font-black uppercase tracking-wide text-[#6b6f76]">
                  <tr>
                    <th className="px-5 py-3">Photo</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Caption</th>
                    <th className="px-5 py-3 text-right">Order / Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eee8e2]">
                  {galleryPhotos.map((p, i) => (
                    <tr key={p.id} className="transition-colors hover:bg-[#fbfaf8]">
                      <td className="px-5 py-4">
                        <img
                          src={p.src}
                          alt={p.caption ?? ""}
                          className="size-14 rounded-xl object-cover"
                        />
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[#6b6f76]">{p.caption || "—"}</td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <AdminIconButton label="Edit" icon={Pencil} onClick={() => startEdit(p)} />
                          <AdminIconButton
                            label="Move up"
                            icon={ChevronUp}
                            onClick={() => moveGalleryPhoto(p.id, -1)}
                            disabled={i === 0}
                          />
                          <AdminIconButton
                            label="Move down"
                            icon={ChevronDown}
                            onClick={() => moveGalleryPhoto(p.id, 1)}
                            disabled={i === galleryPhotos.length - 1}
                          />
                          <AdminIconButton
                            label="Remove"
                            icon={Trash2}
                            tone="danger"
                            onClick={async () => {
                              const ok = await confirm({ title: "Remove photo?", message: `"${p.caption || "This photo"}" will be permanently deleted.`, danger: true });
                              if (ok) removeGalleryPhoto(p.id);
                            }}
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
              {galleryPhotos.map((p, i) => (
                <article
                  key={p.id}
                  className="flex items-center gap-3 rounded-2xl border border-[#e7e2dc] bg-white p-3 shadow-[0_4px_12px_rgba(17,18,23,0.04)]"
                >
                  <img
                    src={p.src}
                    alt={p.caption ?? ""}
                    className="size-16 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#111217]">
                      {p.caption || "Untitled"}
                    </p>
                    <span className="mt-1 inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      {p.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AdminIconButton label="Edit" icon={Pencil} onClick={() => startEdit(p)} />
                    <AdminIconButton
                      label="Move up"
                      icon={ChevronUp}
                      onClick={() => moveGalleryPhoto(p.id, -1)}
                      disabled={i === 0}
                    />
                    <AdminIconButton
                      label="Move down"
                      icon={ChevronDown}
                      onClick={() => moveGalleryPhoto(p.id, 1)}
                      disabled={i === galleryPhotos.length - 1}
                    />
                    <AdminIconButton
                      label="Remove"
                      icon={Trash2}
                      tone="danger"
                      onClick={async () => {
                              const ok = await confirm({ title: "Remove photo?", message: `"${p.caption || "This photo"}" will be permanently deleted.`, danger: true });
                              if (ok) removeGalleryPhoto(p.id);
                            }}
                    />
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </Card>

      <Modal title={editingId ? "Edit photo" : "Add a photo"} open={open} onClose={close}>
        <form onSubmit={submit} className="space-y-4">
          {!editingId && (
            <>
              <div className="inline-flex rounded-full border border-[#e7e2dc] bg-[#f8f5f2] p-1 text-sm font-semibold">
                <button
                  type="button"
                  onClick={() => setMode("upload")}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 transition",
                    mode === "upload" ? "bg-white text-[#111217] shadow-sm" : "text-[#6b6f76]"
                  )}
                >
                  <Upload className="size-4" /> Upload
                </button>
                <button
                  type="button"
                  onClick={() => setMode("url")}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 transition",
                    mode === "url" ? "bg-white text-[#111217] shadow-sm" : "text-[#6b6f76]"
                  )}
                >
                  <Link2 className="size-4" /> URL
                </button>
              </div>

              {mode === "upload" ? (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#cfc8c0] bg-[#fbfaf8] py-10 text-sm font-semibold text-[#6b6f76] transition hover:border-primary hover:text-primary"
                >
                  <ImagePlus className="size-7" />
                  Choose an image from your device
                  <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
                </button>
              ) : (
                <Field label="Image URL" required>
                  <Input value={src} onChange={(e) => setSrc(e.target.value)} placeholder="https://..." />
                </Field>
              )}
            </>
          )}

          {src && (
            <div className="overflow-hidden rounded-2xl border border-[#e7e2dc]">
              <img src={src} alt="Preview" className="aspect-[4/3] w-full object-cover" />
            </div>
          )}

          <Field label="Caption" optional>
            <Input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Match day intensity"
            />
          </Field>
          <Field label="Category" required>
            <Select
              value={category}
              onChange={(v) => setCategory(v as GalleryCategory)}
              options={GALLERY_CATEGORIES.map((c) => ({ value: c, label: c }))}
            />
          </Field>

          <Button type="submit" size="lg" className="w-full" disabled={!src}>
            <ImagePlus /> {editingId ? "Save changes" : "Add to gallery"}
          </Button>
        </form>
      </Modal>
    </>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <ImagePlus className="size-10 text-[#d9d2ca]" />
      <p className="mt-3 text-sm font-bold text-[#111217]">No photos yet.</p>
      <p className="mt-1 text-xs text-[#6b6f76]">Add your first photo to get started.</p>
      <Button type="button" onClick={onAdd} className="mt-5">
        <Plus /> Add photo
      </Button>
    </div>
  );
}
