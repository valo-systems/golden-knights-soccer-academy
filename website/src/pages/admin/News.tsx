import { useRef, useState } from "react";
import { Link2, Newspaper, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { useAdmin } from "@/admin/store";
import { NEWS_CATEGORIES, type NewsCategory, type NewsPost } from "@/admin/types";
import { AdminHeader, AdminIconButton, Card, Modal, formatDate, useConfirm, useToast } from "@/components/admin/ui";
import { Select } from "@/components/admin/controls";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { cn } from "@/lib/utils";

export function AdminNews() {
  const { newsPosts, addNewsPost, updateNewsPost, removeNewsPost } = useAdmin();
  const confirm = useConfirm();
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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

  function openAdd() {
    setEditingId(null);
    setTitle(""); setCategory("Academy news"); setDate("");
    setExcerpt(""); setBody(""); setImg(""); setImgMode("upload");
    setOpen(true);
  }

  function startEdit(p: NewsPost) {
    setEditingId(p.id);
    setTitle(p.title);
    setCategory(p.category);
    setDate(typeof p.date === "string" ? p.date : "");
    setExcerpt(p.excerpt);
    setBody(Array.isArray(p.body) ? p.body.join("\n\n") : (p.body as string));
    setImg(p.img ?? "");
    setImgMode(p.img?.startsWith("data:") ? "upload" : "url");
    setOpen(true);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    if (editingId) {
      updateNewsPost(editingId, {
        title: title.trim(),
        category,
        date: date.trim() || undefined,
        excerpt: excerpt.trim(),
        body: body as unknown as string[],
        img: img || undefined,
      });
      toast("Post updated.");
    } else {
      addNewsPost({
        title: title.trim(),
        category,
        date: date.trim() || undefined,
        excerpt: excerpt.trim(),
        body,
        img: img || undefined,
      });
      toast("Post published.");
    }
    close();
  }

  function close() {
    setOpen(false);
    setEditingId(null);
    setTitle(""); setDate(""); setExcerpt(""); setBody(""); setImg("");
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <>
      <AdminHeader
        title="News"
        subtitle="Write posts that appear on the public News page."
        actions={
          <Button type="button" onClick={openAdd}>
            <Plus /> Add post
          </Button>
        }
      />

      <Card className="overflow-hidden border-[#e7e2dc] bg-white shadow-[0_16px_42px_rgba(17,18,23,0.05)]">
        {newsPosts.length === 0 ? (
          <EmptyState onAdd={openAdd} />
        ) : (
          <>
            {/* desktop table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#fbfaf8] text-xs font-black uppercase tracking-wide text-[#6b6f76]">
                  <tr>
                    <th className="px-5 py-3">Post</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eee8e2]">
                  {newsPosts.map((p) => (
                    <tr key={p.id} className="transition-colors hover:bg-[#fbfaf8]">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {p.img ? (
                            <img
                              src={p.img}
                              alt={p.title}
                              className="size-12 shrink-0 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#f0ede8]">
                              <Newspaper className="size-5 text-[#cfc8c0]" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-[#111217]">{p.title}</p>
                            <p className="mt-0.5 line-clamp-1 text-xs text-[#6b6f76]">{p.excerpt}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                          {p.category}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-[#6b6f76]">
                        {p.date || formatDate(p.createdAt)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <AdminIconButton label="Edit post" icon={Pencil} onClick={() => startEdit(p)} />
                          <AdminIconButton label="Remove post" icon={Trash2} tone="danger" onClick={async () => {
                              const ok = await confirm({ title: "Remove post?", message: `"${p.title}" will be permanently deleted.`, danger: true });
                              if (ok) { removeNewsPost(p.id); toast("Post deleted.", "danger"); }
                            }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* mobile cards */}
            <div className="space-y-3 p-4 lg:hidden">
              {newsPosts.map((p) => (
                <article
                  key={p.id}
                  className="flex items-center gap-3 rounded-2xl border border-[#e7e2dc] bg-white p-3 shadow-[0_4px_12px_rgba(17,18,23,0.04)]"
                >
                  {p.img ? (
                    <img src={p.img} alt={p.title} className="size-16 shrink-0 rounded-xl object-cover" />
                  ) : (
                    <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-[#f0ede8]">
                      <Newspaper className="size-6 text-[#cfc8c0]" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#111217]">{p.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        {p.category}
                      </span>
                      <span className="text-xs text-[#9a9690]">{p.date || formatDate(p.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <AdminIconButton label="Edit post" icon={Pencil} onClick={() => startEdit(p)} />
                    <AdminIconButton label="Remove post" icon={Trash2} tone="danger" onClick={async () => {
                              const ok = await confirm({ title: "Remove post?", message: `"${p.title}" will be permanently deleted.`, danger: true });
                              if (ok) { removeNewsPost(p.id); toast("Post deleted.", "danger"); }
                            }} />
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </Card>

      <Modal title={editingId ? "Edit post" : "New post"} open={open} onClose={close}>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Title" required>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Headline"
            />
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
              <Input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. June 2026"
              />
            </Field>
          </div>
          <Field label="Excerpt" required hint="A one-line summary for the card.">
            <Input
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short summary"
            />
          </Field>
          <Field label="Body" required hint="Separate paragraphs with a blank line.">
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-40"
              placeholder="Write the story..."
            />
          </Field>

          <div>
            <div className="mb-2 inline-flex rounded-full border border-[#e7e2dc] bg-[#f8f5f2] p-1 text-sm font-semibold">
              <button
                type="button"
                onClick={() => setImgMode("upload")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 transition",
                  imgMode === "upload" ? "bg-white text-[#111217] shadow-sm" : "text-[#6b6f76]"
                )}
              >
                <Upload className="size-4" /> Upload
              </button>
              <button
                type="button"
                onClick={() => setImgMode("url")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 transition",
                  imgMode === "url" ? "bg-white text-[#111217] shadow-sm" : "text-[#6b6f76]"
                )}
              >
                <Link2 className="size-4" /> URL
              </button>
            </div>
            {imgMode === "upload" ? (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#cfc8c0] bg-[#fbfaf8] py-4 text-sm font-semibold text-[#6b6f76] transition hover:border-primary hover:text-primary"
              >
                Choose a cover image
                <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
              </button>
            ) : (
              <Input value={img} onChange={(e) => setImg(e.target.value)} placeholder="https://..." />
            )}
            {img && (
              <img src={img} alt="Cover" className="mt-3 aspect-[16/9] w-full rounded-xl object-cover" />
            )}
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={!canSubmit}>
            {editingId ? "Save changes" : "Publish post"}
          </Button>
        </form>
      </Modal>
    </>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Newspaper className="size-10 text-[#d9d2ca]" />
      <p className="mt-3 text-sm font-bold text-[#111217]">No posts yet.</p>
      <p className="mt-1 text-xs text-[#6b6f76]">Add your first post to get started.</p>
      <Button type="button" onClick={onAdd} className="mt-5">
        <Plus /> Add post
      </Button>
    </div>
  );
}
