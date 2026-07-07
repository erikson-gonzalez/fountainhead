import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { AlbumFormState } from "./types";
import { deriveRole } from "./types";
import { RoleTypePicker } from "./role-type-picker";
import { AlbumCardPreview } from "./album-card-preview";

interface AlbumFormFieldsProps {
  form: AlbumFormState;
  onChange: (patch: Partial<AlbumFormState>) => void;
  showPreview?: boolean;
  layout?: "add" | "edit";
}

export function AlbumFormFields({
  form,
  onChange,
  showPreview = true,
  layout = "add",
}: AlbumFormFieldsProps) {
  const isEdit = layout === "edit";
  const hasPreview =
    showPreview && (form.title || form.artist || form.genre || form.embedUrl);

  return (
    <>
      <div className={isEdit ? "grid grid-cols-2 gap-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
        {isEdit ? (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Artista</label>
              <Input
                value={form.artist}
                onChange={(e) => onChange({ artist: e.target.value })}
                className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Title</label>
              <Input
                value={form.title}
                onChange={(e) => onChange({ title: e.target.value })}
                className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
                required
              />
            </div>
          </>
        ) : (
          <>
            <Input
              value={form.artist}
              onChange={(e) => onChange({ artist: e.target.value })}
              placeholder="Artista"
              className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
              required
            />
            <Input
              value={form.title}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="Title (album or song)"
              className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
              required
            />
          </>
        )}
      </div>

      <RoleTypePicker
        selected={form.roleTypes}
        onChange={(next) => onChange({ roleTypes: next })}
      />

      {form.roleTypes.includes("other") &&
        (isEdit ? (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Especificar otro rol
            </label>
            <Input
              value={form.otherRole}
              onChange={(e) => onChange({ otherRole: e.target.value })}
              placeholder="ej: Guest, Session Guitarist…"
              className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
              required
            />
          </div>
        ) : (
          <Input
            value={form.otherRole}
            onChange={(e) => onChange({ otherRole: e.target.value })}
            placeholder="Especificar otro rol (ej: Guest, Session Guitarist…)"
            className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
            required
          />
        ))}

      {isEdit ? (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Genre</label>
            <Input
              value={form.genre}
              onChange={(e) => onChange({ genre: e.target.value })}
              className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Year</label>
            <Input
              value={form.year}
              onChange={(e) => onChange({ year: e.target.value })}
              placeholder="ej: 2024"
              maxLength={4}
              className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Description (optional, max 100 chars visible on card)"
              maxLength={300}
              rows={3}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              URL Spotify / Apple Music / YouTube
            </label>
            <Input
              value={form.embedUrl}
              onChange={(e) => onChange({ embedUrl: e.target.value })}
              placeholder="https://open.spotify.com/album/..."
              className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
              required
            />
          </div>
        </>
      ) : (
        <>
          <Input
            value={form.genre}
            onChange={(e) => onChange({ genre: e.target.value })}
            placeholder="Genre"
            className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
            required
          />
          <Input
            value={form.year}
            onChange={(e) => onChange({ year: e.target.value })}
            placeholder="Year (e.g. 2024)"
            maxLength={4}
            className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
          />
          <textarea
            value={form.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Description (optional, max 100 chars visible on card)"
            maxLength={300}
            rows={3}
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
          <Input
            value={form.embedUrl}
            onChange={(e) => onChange({ embedUrl: e.target.value })}
            placeholder="URL Spotify, Apple Music o YouTube (para reproducir)"
            className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
            required
          />
        </>
      )}

      <label className="flex items-center gap-2.5 cursor-pointer select-none">
        <Checkbox
          checked={form.featured}
          onCheckedChange={(checked) => onChange({ featured: !!checked })}
        />
        <span className="text-sm font-medium text-slate-700">
          Featured Work <span className="text-slate-400 font-normal">(max 4, shown on home)</span>
        </span>
      </label>

      {hasPreview && (
        <AlbumCardPreview
          title={form.title}
          artist={form.artist}
          role={deriveRole(form.roleTypes, form.otherRole)}
          genre={form.genre}
          year={form.year}
          embedUrl={form.embedUrl}
          description={form.description}
        />
      )}
    </>
  );
}
