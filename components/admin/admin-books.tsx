"use client";

import { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Lightbulb,
  Mic2,
  Music4,
  Guitar,
  ArrowRight,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const ICON_OPTIONS: { value: string; label: string; Icon: LucideIcon }[] = [
  { value: "BookOpen", label: "Book (Lesson)", Icon: BookOpen },
  { value: "Lightbulb", label: "Lightbulb (Coaching)", Icon: Lightbulb },
  { value: "Mic2", label: "Mic (Studio)", Icon: Mic2 },
  { value: "Music4", label: "Music (Arrangements)", Icon: Music4 },
  { value: "Guitar", label: "Guitar", Icon: Guitar },
];

const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen,
  Lightbulb,
  Mic2,
  Music4,
  Guitar,
};

type BookOffering = {
  id: number;
  name: string;
  description: string;
  priceEur: number;
  unit: string;
  tag: string | null;
  icon: string | null;
  imageUrl: string | null;
  linkType: string;
};

const emptyForm = {
  name: "",
  description: "",
  priceEur: "",
  unit: "per hour",
  tag: "",
  icon: "BookOpen",
  imageUrl: "",
  linkType: "booking" as "booking" | "quote",
};

export function AdminBooks() {
  const [books, setBooks] = useState<BookOffering[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const loadBooks = () => {
    adminFetch("/api/admin/books")
      .then((r) => r.json())
      .then((data) => setBooks(data.books ?? []))
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => loadBooks(), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim() || !form.priceEur || !form.unit.trim()) return;
    setSaving(true);
    try {
      const body = {
        name: form.name.trim(),
        description: form.description.trim(),
        priceEur: parseFloat(form.priceEur) || 0,
        unit: form.unit.trim(),
        tag: form.tag.trim() || null,
        icon: form.icon || null,
        imageUrl: form.imageUrl.trim() || null,
        linkType: form.linkType,
      };
      if (editingId) {
        await adminFetch(`/api/admin/books/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        setEditingId(null);
      } else {
        await adminFetch("/api/admin/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      setForm(emptyForm);
      loadBooks();
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (b: BookOffering) => {
    setEditingId(b.id);
    setForm({
      name: b.name,
      description: b.description,
      priceEur: String(b.priceEur),
      unit: b.unit,
      tag: b.tag ?? "",
      icon: b.icon ?? "BookOpen",
      imageUrl: b.imageUrl ?? "",
      linkType: (b.linkType === "quote" ? "quote" : "booking") as "booking" | "quote",
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this book offering?")) return;
    await adminFetch(`/api/admin/books/${id}`, { method: "DELETE" });
    loadBooks();
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const PreviewIcon = ICON_MAP[form.icon] ?? BookOpen;
  const previewBook = {
    name: form.name || "Guitar Lesson",
    description: form.description || "1-on-1 guitar lesson via Zoom/Skype or in-person in Berlin.",
    priceEur: parseFloat(form.priceEur) || 0,
    unit: form.unit || "per hour",
    tag: form.tag || "Education",
    imageUrl: form.imageUrl.trim() || null,
  };

  if (loading) {
    return <div className="text-slate-500">Loading books...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <Card className="bg-white border-slate-200 w-full">
          <CardHeader>
            <CardTitle className="text-slate-900">
              {editingId ? "Edit Book Offering" : "New Book Offering"}
            </CardTitle>
            <CardDescription>
              Create or edit a bookable session. Changes appear on the /book page.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-slate-900">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Icon</Label>
                  <Select value={form.icon} onValueChange={(v) => setForm((f) => ({ ...f, icon: v }))}>
                    <SelectTrigger className="bg-white text-slate-900 placeholder:text-slate-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ICON_OPTIONS.map(({ value, label, Icon }) => (
                        <SelectItem key={value} value={value}>
                          <span className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tag (badge)</Label>
                  <Input
                    value={form.tag}
                    onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
                    placeholder="Education, Studio..."
                    className="bg-white text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Link type</Label>
                <Select value={form.linkType} onValueChange={(v) => setForm((f) => ({ ...f, linkType: v as "booking" | "quote" }))}>
                  <SelectTrigger className="bg-white text-slate-900 placeholder:text-slate-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="booking">Booking (add to cart flow)</SelectItem>
                    <SelectItem value="quote">Quote (link to /quote)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  value={form.imageUrl}
                  onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                  placeholder="https://... or /images/..."
                  className="bg-white text-slate-900 placeholder:text-slate-400"
                />
                <p className="text-xs text-slate-500">Optional. Shown at top of card for visual appeal.</p>
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Guitar Lesson"
                  className="bg-white text-slate-900 placeholder:text-slate-400"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="1-on-1 guitar lesson via Zoom/Skype..."
                  rows={3}
                  className="bg-white text-slate-900 placeholder:text-slate-400 resize-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (€)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.priceEur}
                    onChange={(e) => setForm((f) => ({ ...f, priceEur: e.target.value }))}
                    placeholder="45"
                    className="bg-white text-slate-900 placeholder:text-slate-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Input
                    value={form.unit}
                    onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                    placeholder="per hour"
                    className="bg-white text-slate-900 placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {editingId ? "Update" : "Create"}
                </Button>
                {editingId && (
                  <button type="button" onClick={handleCancel} className="h-10 px-6 rounded-sm text-sm font-medium border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition-colors">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Visualizer */}
        <Card className="bg-white border-slate-200 w-full">
          <CardHeader>
            <CardTitle className="text-slate-900">Preview</CardTitle>
            <CardDescription>
              How it will appear on the /book page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-slate-200 bg-slate-900 p-6">
              <div className="group flex flex-col bg-slate-800/50 border border-slate-700 rounded-sm overflow-hidden">
                {previewBook.imageUrl ? (
                  <div className="aspect-video w-full overflow-hidden bg-slate-700">
                    <img
                      src={previewBook.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full bg-slate-700/50 flex items-center justify-center">
                    <PreviewIcon className="w-16 h-16 text-slate-500" />
                  </div>
                )}
                <div className="p-7 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <PreviewIcon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-sm bg-white/5 text-slate-400 border border-slate-600">
                      {previewBook.tag}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-white mb-2 leading-snug">
                    {previewBook.name}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-4">
                    {previewBook.description}
                  </p>
                  <div className="mb-4 pt-4 border-t border-slate-600">
                    <div className="font-display text-xl font-bold text-white">
                      {formatPrice(previewBook.priceEur)}
                    </div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">
                      {previewBook.unit}
                    </div>
                  </div>
                  <Button className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 border-primary/50" size="sm" disabled>
                    Book Now <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* List */}
      <Card className="bg-white border-slate-200 w-full">
        <CardHeader>
          <CardTitle className="text-slate-900">Book Offerings ({books.length})</CardTitle>
          <CardDescription>
            Edit or delete existing offerings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {books.length === 0 ? (
            <p className="text-slate-500 text-sm">No offerings yet. Create one above.</p>
          ) : (
            <div className="space-y-4">
              {books.map((b) => {
                const Icon = ICON_MAP[b.icon ?? ""] ?? BookOpen;
                return (
                  <div
                    key={b.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-slate-50">
                    <div className="flex items-center gap-4">
                      {b.imageUrl ? (
                        <img src={b.imageUrl} alt="" className="w-14 h-14 rounded-lg object-cover" />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-slate-200 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-slate-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-slate-900">{b.name}</p>
                        <p className="text-sm text-slate-500">
                          {b.tag ?? b.linkType} · {formatPrice(b.priceEur)} {b.unit}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(b)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(b.id)} className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
