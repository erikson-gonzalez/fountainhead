"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { adminFetch } from "@/lib/admin-fetch";
import { Loader2, Plus, Trash2, MoreVertical, Pencil, RefreshCw } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  type: string;
  featured: boolean;
}

export function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [quote, setQuote] = useState("");
  const [type, setType] = useState<"artist" | "student">("artist");
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editQuote, setEditQuote] = useState("");
  const [editType, setEditType] = useState<"artist" | "student">("artist");

  function loadTestimonials() {
    setLoading(true);
    setLoadError(null);
    adminFetch("/api/admin/testimonials")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setTestimonials(data?.testimonials ?? []);
        setLoadError(null);
      })
      .catch((err) => {
        setTestimonials([]);
        setLoadError(err instanceof Error ? err.message : "Error loading");
      })
      .finally(() => setLoading(false));
  }

  useEffect(loadTestimonials, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !role.trim() || !quote.trim()) return;
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, quote, type }),
      });
      if (res.ok) {
        setName("");
        setRole("");
        setQuote("");
        loadTestimonials();
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this testimonial?")) return;
    setSaving(true);
    try {
      const res = await adminFetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      if (res.ok) loadTestimonials();
    } finally {
      setSaving(false);
    }
  }

  function openEdit(t: Testimonial) {
    setEditing(t);
    setEditName(t.name);
    setEditRole(t.role);
    setEditQuote(t.quote);
    setEditType((t.type === "student" ? "student" : "artist") as "artist" | "student");
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editing || !editName.trim() || !editRole.trim() || !editQuote.trim()) return;
    setSaving(true);
    try {
      const res = await adminFetch(`/api/admin/testimonials/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, role: editRole, quote: editQuote, type: editType }),
      });
      if (res.ok) {
        setEditing(null);
        loadTestimonials();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader>
        <CardTitle className="text-slate-900">Testimonios (Industry Voices)</CardTitle>
        <CardDescription>
          Testimonials appear in the Home section. Edit name, role and quote.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleAdd} className="space-y-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
          <h4 className="font-medium text-slate-800">Add testimonial</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre (ej: Christopher Johnson)"
              className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
            />
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Rol (ej: Student, Halford)"
              className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <Textarea
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="Cita del testimonio..."
            rows={2}
            className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
          />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="radio"
                checked={type === "artist"}
                onChange={() => setType("artist")}
              />
              Artista
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="radio"
                checked={type === "student"}
                onChange={() => setType("student")}
              />
              Estudiante
            </label>
            <Button type="submit" size="sm" className="bg-slate-800 hover:bg-slate-900" disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span className="ml-2">Add</span>
            </Button>
          </div>
        </form>

        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <h4 className="font-medium text-slate-800">Testimonios actuales</h4>
            <Button type="button" variant="ghost" size="sm" onClick={loadTestimonials} disabled={loading} className="text-slate-600 hover:text-slate-800 shrink-0">
              <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
              Refrescar
            </Button>
          </div>
          {loading ? (
            <p className="text-sm text-slate-500">Cargando...</p>
          ) : loadError ? (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-700 mb-2">{loadError}</p>
              <Button type="button" variant="outline" size="sm" onClick={loadTestimonials} className="border-red-200">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reintentar
              </Button>
            </div>
          ) : testimonials.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No testimonials. Add the first one above.</p>
          ) : (
            <div className="space-y-3">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="flex items-start justify-between gap-4 p-4 rounded-lg border border-slate-200 bg-white"
                >
                  <div>
                    <p className="font-medium text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">{t.role}</p>
                    <p className="text-sm text-slate-600 mt-1 italic">&ldquo;{t.quote}&rdquo;</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-slate-500 hover:text-slate-700 shrink-0"
                        disabled={saving}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border-slate-200">
                      <DropdownMenuItem onClick={() => openEdit(t)} className="cursor-pointer text-slate-700">
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(t.id)}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="bg-white border-slate-200 text-slate-900 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit testimonial</DialogTitle>
            <DialogDescription>Modifica nombre, rol y cita del testimonio.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Nombre</label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border-slate-200 bg-white text-slate-900"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Rol</label>
                <Input
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="border-slate-200 bg-white text-slate-900"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Cita</label>
              <Textarea
                value={editQuote}
                onChange={(e) => setEditQuote(e.target.value)}
                rows={3}
                className="border-slate-200 bg-white text-slate-900"
              />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="radio" checked={editType === "artist"} onChange={() => setEditType("artist")} />
                Artista
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="radio" checked={editType === "student"} onChange={() => setEditType("student")} />
                Estudiante
              </label>
            </div>
            <DialogFooter className="gap-2 sm:gap-0 pt-4">
              <Button type="button" variant="outline" onClick={() => setEditing(null)} className="border-slate-200">
                Cancelar
              </Button>
              <Button type="submit" className="bg-slate-800 hover:bg-slate-900" disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
