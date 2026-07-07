import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { adminFetch } from "@/store/admin-auth-store";
import { Loader2, Plus, Trash2, MoreVertical, Pencil, RefreshCw } from "lucide-react";

interface LiveShow {
  id: number;
  date: string;
  venue: string;
  city: string;
  project: string;
  ticketUrl: string | null;
}

export function AdminLiveShows() {
  const [shows, setShows] = useState<LiveShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [city, setCity] = useState("");
  const [project, setProject] = useState("");
  const [ticketUrl, setTicketUrl] = useState("");
  const [editing, setEditing] = useState<LiveShow | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editVenue, setEditVenue] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editProject, setEditProject] = useState("");
  const [editTicketUrl, setEditTicketUrl] = useState("");

  function loadShows() {
    setLoading(true);
    setLoadError(null);
    adminFetch("/api/admin/live-shows")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setShows(data?.shows ?? []);
        setLoadError(null);
      })
      .catch((err) => {
        setShows([]);
        setLoadError(err instanceof Error ? err.message : "Error loading");
      })
      .finally(() => setLoading(false));
  }

  useEffect(loadShows, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!date.trim() || !venue.trim() || !city.trim() || !project.trim()) return;
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/live-shows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: date.trim(),
          venue: venue.trim(),
          city: city.trim(),
          project: project.trim(),
          ticketUrl: ticketUrl.trim() || undefined,
        }),
      });
      if (res.ok) {
        setDate("");
        setVenue("");
        setCity("");
        setProject("");
        setTicketUrl("");
        loadShows();
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this show?")) return;
    setSaving(true);
    try {
      const res = await adminFetch(`/api/admin/live-shows/${id}`, { method: "DELETE" });
      if (res.ok) loadShows();
    } finally {
      setSaving(false);
    }
  }

  function openEdit(s: LiveShow) {
    setEditing(s);
    setEditDate(s.date);
    setEditVenue(s.venue);
    setEditCity(s.city);
    setEditProject(s.project);
    setEditTicketUrl(s.ticketUrl ?? "");
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editing || !editDate.trim() || !editVenue.trim() || !editCity.trim() || !editProject.trim()) return;
    setSaving(true);
    try {
      const res = await adminFetch(`/api/admin/live-shows/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: editDate.trim(),
          venue: editVenue.trim(),
          city: editCity.trim(),
          project: editProject.trim(),
          ticketUrl: editTicketUrl.trim() || undefined,
        }),
      });
      if (res.ok) {
        setEditing(null);
        loadShows();
      }
    } finally {
      setSaving(false);
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = shows.filter((s) => s.date >= today);
  const past = shows.filter((s) => s.date < today);

  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader>
        <CardTitle className="text-slate-900">Live Shows</CardTitle>
        <CardDescription>
          Manage shows, masterclasses and clinics. Past-dated shows automatically appear in "Past Highlights".
          The tickets link is used for the "Get Tickets" button.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleAdd} className="space-y-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
          <h4 className="font-medium text-slate-800">Add show</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Fecha (YYYY-MM-DD)</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-white border-slate-200 text-slate-900"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Venue</label>
              <Input
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Wacken Open Air"
                className="bg-white border-slate-200 text-slate-900"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Ciudad</label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Wacken, DE"
                className="bg-white border-slate-200 text-slate-900"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Proyecto</label>
              <Input
                value={project}
                onChange={(e) => setProject(e.target.value)}
                placeholder="Fountainhead"
                className="bg-white border-slate-200 text-slate-900"
                required
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-700">URL de tickets (opcional)</label>
              <Input
                value={ticketUrl}
                onChange={(e) => setTicketUrl(e.target.value)}
                placeholder="https://..."
                type="url"
                className="bg-white border-slate-200 text-slate-900"
              />
            </div>
          </div>
          <Button type="submit" size="sm" className="bg-slate-800 hover:bg-slate-900" disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span className="ml-2">Add</span>
          </Button>
        </form>

        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <h4 className="font-medium text-slate-800">Shows ({upcoming.length} upcoming, {past.length} past)</h4>
            <Button type="button" variant="ghost" size="sm" onClick={loadShows} disabled={loading} className="text-slate-600 hover:text-slate-800 shrink-0">
              <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
              Refrescar
            </Button>
          </div>
          {loading ? (
            <p className="text-sm text-slate-500">Cargando...</p>
          ) : loadError ? (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-700 mb-2">{loadError}</p>
              <Button type="button" variant="outline" size="sm" onClick={loadShows} className="border-red-200">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reintentar
              </Button>
            </div>
          ) : shows.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No shows. Add the first one above.</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {shows.map((s) => (
                <div
                  key={s.id}
                  className="flex items-start justify-between gap-4 p-4 rounded-lg border border-slate-200 bg-white"
                >
                  <div>
                    <p className="font-medium text-slate-900">{s.venue}</p>
                    <p className="text-xs text-slate-500">
                      {s.date} · {s.city} · {s.project}
                    </p>
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
                      <DropdownMenuItem onClick={() => openEdit(s)} className="cursor-pointer text-slate-700">
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(s.id)}
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
            <DialogTitle>Edit show</DialogTitle>
            <DialogDescription>Edit the show details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Fecha (YYYY-MM-DD)</label>
                <Input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="border-slate-200 bg-white text-slate-900"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Venue</label>
                <Input
                  value={editVenue}
                  onChange={(e) => setEditVenue(e.target.value)}
                  className="border-slate-200 bg-white text-slate-900"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Ciudad</label>
                <Input
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                  className="border-slate-200 bg-white text-slate-900"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Proyecto</label>
                <Input
                  value={editProject}
                  onChange={(e) => setEditProject(e.target.value)}
                  className="border-slate-200 bg-white text-slate-900"
                  required
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-slate-700">URL de tickets (opcional)</label>
                <Input
                  value={editTicketUrl}
                  onChange={(e) => setEditTicketUrl(e.target.value)}
                  type="url"
                  placeholder="https://..."
                  className="border-slate-200 bg-white text-slate-900"
                />
              </div>
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
