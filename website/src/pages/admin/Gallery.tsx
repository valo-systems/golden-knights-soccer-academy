import { useRef, useState } from "react";
import { Upload, Link2, Trash2, ChevronUp, ChevronDown, ImagePlus } from "lucide-react";
import { useAdmin } from "@/admin/store";
import { GALLERY_CATEGORIES, type GalleryCategory } from "@/admin/types";
import { AdminHeader, Card, AdminIconButton } from "@/components/admin/ui";
import { Select } from "@/components/admin/controls";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { cn } from "@/lib/utils";

export function AdminGallery() {
  const { galleryPhotos, addGalleryPhoto, removeGalleryPhoto, moveGalleryPhoto } = useAdmin();
  const fileRef = useRef<HTMLInputElement>(null);

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

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!src) return;
    addGalleryPhoto({ src, caption: caption.trim() || undefined, category });
    setSrc("");
    setCaption("");
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Gallery"
        subtitle="Add and arrange the photos shown on the public gallery page."
      />

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* add photo */}
        <Card className="h-fit p-6">
          <h2 className="font-heading text-xl font-black text-[#111217]">Add a photo</h2>

          <div className="mt-4 inline-flex rounded-full border border-[#e7e2dc] bg-[#f8f5f2] p-1 text-sm font-semibold">
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

          <form onSubmit={add} className="mt-5 space-y-4">
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

            {src && (
              <div className="overflow-hidden rounded-2xl border border-[#e7e2dc]">
                <img src={src} alt="Preview" className="aspect-[4/3] w-full object-cover" />
              </div>
            )}

            <Field label="Caption" optional>
              <Input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="e.g. Match day intensity" />
            </Field>
            <Field label="Category" required>
              <Select
                value={category}
                onChange={(v) => setCategory(v as GalleryCategory)}
                options={GALLERY_CATEGORIES.map((c) => ({ value: c, label: c }))}
              />
            </Field>

            <Button type="submit" size="lg" className="w-full" disabled={!src}>
              <ImagePlus /> Add to gallery
            </Button>
          </form>
        </Card>

        {/* photo list */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-black text-[#111217]">
              Photos <span className="text-[#9a9690]">({galleryPhotos.length})</span>
            </h2>
            <p className="text-xs text-[#9a9690]">Order here is the order shown publicly.</p>
          </div>

          {galleryPhotos.length === 0 ? (
            <p className="mt-8 text-center text-sm text-[#6b6f76]">No photos yet. Add one to get started.</p>
          ) : (
            <div className="mt-5 space-y-3">
              {galleryPhotos.map((p, i) => (
                <div key={p.id} className="flex items-center gap-4 rounded-2xl border border-[#eee8e2] bg-[#fbfaf8] p-3">
                  <img src={p.src} alt={p.caption ?? ""} className="size-16 shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#111217]">{p.caption || "Untitled"}</p>
                    <span className="mt-1 inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      {p.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
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
                      onClick={() => removeGalleryPhoto(p.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
