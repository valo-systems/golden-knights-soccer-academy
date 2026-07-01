import { useRef, useState } from "react";
import { Newspaper, Trash2, Upload, Link2 } from "lucide-react";
import { useAdmin } from "@/admin/store";
import { NEWS_CATEGORIES, type NewsCategory } from "@/admin/types";
import { AdminHeader, Card, AdminIconButton, formatDate } from "@/components/admin/ui";
import { Select } from "@/components/admin/controls";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { cn } from "@/lib/utils";

export function AdminNews() {
  const { newsPosts, addNewsPost, removeNewsPost } = useAdmin();
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<NewsCategory>("Academy news");
  const [date, setDate] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [img, setImg] = useState("");
  const [imgMode, setImgMode] = useState<"upload" | "url">("upload");

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImg(reader.result as string);
    reader.readAsDataURL(file);
  }

  const canSubmit = title.trim() && excerpt.trim() && body.trim();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    addNewsPost({
      title: title.trim(),
      category,
      date: date.trim() || undefined,
      excerpt: excerpt.trim(),
      body,
      img: img || undefined,
    });
    setTitle("");
    setDate("");
    setExcerpt("");
    setBody("");
    setImg("");
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title="News"
        subtitle="Write posts that appear on the public News page."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* add post */}
        <Card className="h-fit p-6">
          <h2 className="font-heading text-xl font-black text-[#111217]">New post</h2>
          <form onSubmit={submit} className="mt-5 space-y-4">
            <Field label="Title" required>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Headline" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category" required>
                <Select
                  value={category}
                  onChange={(v) => setCategory(v as NewsCategory)}
                  options={NEWS_CATEGORIES.map((c) => ({ value: c, label: c }))}
                />
              </Field>
              <Field label="Date label" optional hint="Defaults to this month.">
                <Input value={date} onChange={(e) => setDate(e.target.value)} placeholder="e.g. June 2026" />
              </Field>
            </div>
            <Field label="Excerpt" required hint="A one-line summary for the card.">
              <Input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short summary" />
            </Field>
            <Field label="Body" required hint="Separate paragraphs with a blank line.">
              <Textarea value={body} onChange={(e) => setBody(e.target.value)} className="min-h-40" placeholder="Write the story..." />
            </Field>

            {/* image */}
            <div>
              <div className="mb-2 inline-flex rounded-full border border-[#e7e2dc] bg-[#f8f5f2] p-1 text-sm font-semibold">
                <button type="button" onClick={() => setImgMode("upload")} className={cn("inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 transition", imgMode === "upload" ? "bg-white text-[#111217] shadow-sm" : "text-[#6b6f76]")}>
                  <Upload className="size-4" /> Upload
                </button>
                <button type="button" onClick={() => setImgMode("url")} className={cn("inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 transition", imgMode === "url" ? "bg-white text-[#111217] shadow-sm" : "text-[#6b6f76]")}>
                  <Link2 className="size-4" /> URL
                </button>
              </div>
              {imgMode === "upload" ? (
                <button type="button" onClick={() => fileRef.current?.click()} className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#cfc8c0] bg-[#fbfaf8] py-4 text-sm font-semibold text-[#6b6f76] transition hover:border-primary hover:text-primary">
                  Choose a cover image
                  <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
                </button>
              ) : (
                <Input value={img} onChange={(e) => setImg(e.target.value)} placeholder="https://..." />
              )}
              {img && <img src={img} alt="Cover" className="mt-3 aspect-[16/9] w-full rounded-xl object-cover" />}
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={!canSubmit}>
              Publish post
            </Button>
          </form>
        </Card>

        {/* list */}
        <Card className="p-6">
          <h2 className="flex items-center gap-2 font-heading text-xl font-black text-[#111217]">
            <Newspaper className="size-5 text-primary" /> Posts{" "}
            <span className="text-[#9a9690]">({newsPosts.length})</span>
          </h2>
          {newsPosts.length === 0 ? (
            <p className="mt-5 text-sm text-[#6b6f76]">No posts yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {newsPosts.map((p) => (
                <div key={p.id} className="flex items-center gap-4 rounded-2xl border border-[#eee8e2] bg-[#fbfaf8] p-3">
                  <img src={p.img} alt={p.title} className="size-16 shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#111217]">{p.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">{p.category}</span>
                      <span className="text-xs text-[#9a9690]">{p.date || formatDate(p.createdAt)}</span>
                    </div>
                  </div>
                  <AdminIconButton label="Remove" icon={Trash2} tone="danger" onClick={() => removeNewsPost(p.id)} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
