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
  Sliders,
  Disc3,
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
  { value: "Sliders", label: "Sliders (Mixing)", Icon: Sliders },
  { value: "Disc3", label: "Disc (Mastering)", Icon: Disc3 },
  { value: "Music4", label: "Music (Production)", Icon: Music4 },
  { value: "Guitar", label: "Guitar", Icon: Guitar },
];

const CATEGORY_OPTIONS = [
  { value: "mixing", label: "Mixing" },
  { value: "mastering", label: "Mastering" },
  { value: "stem-mastering", label: "Stem Mastering" },
  { value: "mixing-mastering", label: "Mixing + Mastering" },
  { value: "production", label: "Production" },
  { value: "cowriting", label: "Co-writing" },
  { value: "guitar-solo", label: "Guitar Solo" },
  { value: "other", label: "Other" },
];

const PREDEFINED_CATEGORIES = new Set(CATEGORY_OPTIONS.filter((o) => o.value !== "other").map((o) => o.value));

const ICON_MAP: Record<string, LucideIcon> = {
  Sliders,
  Disc3,
  Music4,
  Guitar,
};

type Service = {
  id: number;
  name: string;
  description: string;
  priceEur: number;
  category: string;
  tag: string | null;
  icon: string | null;
  unit: string;
};

const emptyForm = {
  name: "",
  description: "",
  priceEur: "",
  category: "mixing",
  categoryOther: "",
  tag: "",
  icon: "Sliders",
  unit: "per song",
};

export function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const loadServices = () => {
    adminFetch("/api/admin/services")
      .then((r) => r.json())
      .then((data) => setServices(data.services ?? []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => loadServices(), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim() || !form.priceEur || !form.unit.trim()) return;
    const category = form.category === "other" ? form.categoryOther.trim().toLowerCase().replace(/\s+/g, "-") : form.category;
    if (!category) return;
    setSaving(true);
    try {
      const body = {
        name: form.name.trim(),
        description: form.description.trim(),
        priceEur: parseFloat(form.priceEur) || 0,
        category,
        tag: form.tag.trim() || null,
        icon: form.icon || null,
        unit: form.unit.trim(),
      };
      if (editingId) {
        await adminFetch(`/api/admin/services/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        setEditingId(null);
      } else {
        await adminFetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      setForm(emptyForm);
      loadServices();
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (s: Service) => {
    setEditingId(s.id);
    const isOther = !PREDEFINED_CATEGORIES.has(s.category);
    setForm({
      name: s.name,
      description: s.description,
      priceEur: String(s.priceEur),
      category: isOther ? "other" : s.category,
      categoryOther: isOther ? s.category : "",
      tag: s.tag ?? "",
      icon: s.icon ?? "Sliders",
      unit: s.unit,
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this service?")) return;
    await adminFetch(`/api/admin/services/${id}`, { method: "DELETE" });
    loadServices();
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const PreviewIcon = ICON_MAP[form.icon] ?? Sliders;
  const previewCategory = form.category === "other" ? form.categoryOther : form.category;
  const previewService = {
    name: form.name || "Service Name",
    description: form.description || "Service description goes here.",
    priceEur: parseFloat(form.priceEur) || 0,
    unit: form.unit || "per song",
    tag: form.tag || previewCategory,
  };

  if (loading) {
    return <div className="text-slate-500">Loading services...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <Card className="bg-white border-slate-200 w-full">
          <CardHeader>
            <CardTitle className="text-slate-900">
              {editingId ? "Edit Service" : "New Service"}
            </CardTitle>
            <CardDescription>
              Create or edit a service. Changes appear on the /services page.
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
                    placeholder="Mixing, Mastering, Guitar..."
                    className="bg-white text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Category (for quote)</Label>
                <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                  <SelectTrigger className="bg-white text-slate-900 placeholder:text-slate-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.category === "other" && (
                  <Input
                    value={form.categoryOther}
                    onChange={(e) => setForm((f) => ({ ...f, categoryOther: e.target.value }))}
                    placeholder="e.g. string-arrangement, consulting..."
                    className="bg-white text-slate-900 placeholder:text-slate-400 mt-2"
                  />
                )}
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Mixing & Mastering (1 song)"
                  className="bg-white text-slate-900 placeholder:text-slate-400"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Complete mix and master of one track..."
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
                    placeholder="300"
                    className="bg-white text-slate-900 placeholder:text-slate-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Input
                    value={form.unit}
                    onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                    placeholder="per song"
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
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
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
              How it will appear on the /services page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-slate-200 bg-slate-900 p-6">
              <div className="group relative flex flex-col bg-slate-800/50 border border-slate-700 rounded-sm overflow-hidden">
                <div className="h-0.5 w-full bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="p-7 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <PreviewIcon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-sm bg-white/5 text-slate-400 border border-slate-600">
                      {previewService.tag}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-white mb-3 leading-snug">
                    {previewService.name}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-6">
                    {previewService.description}
                  </p>
                  <div className="mb-6 pt-5 border-t border-slate-600">
                    <div className="font-display text-3xl font-bold text-white">
                      {formatPrice(previewService.priceEur)}
                    </div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">
                      {previewService.unit}
                    </div>
                  </div>
                  <Button className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 border-primary/50" size="sm" disabled>
                    Get a Quote <ArrowRight className="w-3.5 h-3.5" />
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
          <CardTitle className="text-slate-900">Services ({services.length})</CardTitle>
          <CardDescription>
            Edit or delete existing services
          </CardDescription>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <p className="text-slate-500 text-sm">No services yet. Create one above.</p>
          ) : (
            <div className="space-y-4">
              {services.map((s) => {
                const Icon = ICON_MAP[s.icon ?? ""] ?? Music4;
                return (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-slate-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{s.name}</p>
                        <p className="text-sm text-slate-500">
                          {s.tag ?? s.category} · {formatPrice(s.priceEur)} {s.unit}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(s)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-700">
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
