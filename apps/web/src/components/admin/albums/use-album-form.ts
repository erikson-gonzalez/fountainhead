import { useCallback, useState } from "react";
import { adminFetch } from "@/store/admin-auth-store";
import { toMusicEmbedUrl } from "@/lib/spotify-embed";
import type { Album, AlbumFormState } from "./types";
import { deriveRole } from "./types";

const EMPTY_FORM: AlbumFormState = {
  artist: "",
  title: "",
  otherRole: "",
  roleTypes: ["performer"],
  genre: "",
  year: "",
  description: "",
  embedUrl: "",
  featured: false,
};

interface ErrorResponse {
  message?: string;
  error?: string;
  details?: {
    fieldErrors?: Record<string, string | string[]>;
    formErrors?: string[];
  };
}

interface UseAddFormReturn {
  form: AlbumFormState;
  setForm: React.Dispatch<React.SetStateAction<AlbumFormState>>;
  addError: string | null;
  showAddForm: boolean;
  setShowAddForm: (v: boolean) => void;
  resetAddForm: () => void;
  handleAdd: (
    e: React.FormEvent,
    onSuccess: () => void,
    setSaving: (v: boolean) => void,
  ) => Promise<void>;
}

interface UseEditFormReturn {
  editForm: AlbumFormState;
  setEditForm: React.Dispatch<React.SetStateAction<AlbumFormState>>;
  editing: Album | null;
  editError: string | null;
  openEdit: (album: Album) => void;
  closeEdit: () => void;
  handleUpdate: (
    e: React.FormEvent,
    onSuccess: () => void,
    setSaving: (v: boolean) => void,
  ) => Promise<void>;
}

export function useAddForm(): UseAddFormReturn {
  const [form, setForm] = useState<AlbumFormState>(EMPTY_FORM);
  const [addError, setAddError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const resetAddForm = useCallback(() => {
    setForm(EMPTY_FORM);
    setAddError(null);
    setShowAddForm(false);
  }, []);

  const handleAdd = useCallback(
    async (
      e: React.FormEvent,
      onSuccess: () => void,
      setSaving: (v: boolean) => void,
    ) => {
      e.preventDefault();
      e.stopPropagation();
      setAddError(null);
      const url = form.embedUrl.trim();
      const derivedRole = deriveRole(form.roleTypes, form.otherRole);
      if (
        !form.artist.trim() ||
        !form.title.trim() ||
        !derivedRole ||
        !form.genre.trim() ||
        !url
      )
        return;
      if (!toMusicEmbedUrl(url)) return;
      setSaving(true);
      try {
        const res = await adminFetch("/api/admin/albums", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            artist: form.artist,
            title: form.title,
            role: derivedRole,
            roleType:
              form.roleTypes.length > 0 ? form.roleTypes.join(",") : "other",
            genre: form.genre,
            releaseDate: form.year.trim() || "1900",
            description: form.description.trim() || undefined,
            spotifyEmbedUrl: url,
            featured: form.featured,
          }),
        });
        if (res.ok) {
          resetAddForm();
          onSuccess();
        } else {
          const err: ErrorResponse = await res.json().catch(() => ({}));
          const fieldErr = err?.details?.fieldErrors
            ? Object.entries(err.details.fieldErrors)
                .map(
                  ([k, v]) =>
                    `${k}: ${Array.isArray(v) ? v.join(", ") : v}`,
                )
                .join("; ")
            : null;
          const formErr = err?.details?.formErrors?.length
            ? err.details.formErrors.join("; ")
            : null;
          setAddError(
            fieldErr ||
              formErr ||
              err?.message ||
              err?.error ||
              `Error ${res.status}. Check your session.`,
          );
        }
      } catch (err: unknown) {
        setAddError(
          err instanceof Error ? err.message : "Connection error.",
        );
      } finally {
        setSaving(false);
      }
    },
    [form, resetAddForm],
  );

  return { form, setForm, addError, showAddForm, setShowAddForm, resetAddForm, handleAdd };
}

export function useEditForm(): UseEditFormReturn {
  const [editForm, setEditForm] = useState<AlbumFormState>(EMPTY_FORM);
  const [editing, setEditing] = useState<Album | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const openEdit = useCallback((album: Album) => {
    setEditError(null);
    setEditing(album);
    const rts = album.roleType
      ? album.roleType
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : ["other"];
    setEditForm({
      artist: album.artist,
      title: album.title,
      otherRole: rts.includes("other") ? album.role : "",
      roleTypes: rts,
      genre: album.genre,
      year: album.releaseDate
        ? album.releaseDate.split("-")[0].replace("1900", "")
        : "",
      description: album.description ?? "",
      embedUrl: album.spotifyEmbedUrl ?? "",
      featured: album.featured,
    });
  }, []);

  const closeEdit = useCallback(() => {
    setEditing(null);
    setEditError(null);
  }, []);

  const handleUpdate = useCallback(
    async (
      e: React.FormEvent,
      onSuccess: () => void,
      setSaving: (v: boolean) => void,
    ) => {
      e.preventDefault();
      e.stopPropagation();
      setEditError(null);
      const url = editForm.embedUrl.trim();
      const derivedRole = deriveRole(editForm.roleTypes, editForm.otherRole);
      if (
        !editing ||
        !editForm.artist.trim() ||
        !editForm.title.trim() ||
        !derivedRole ||
        !editForm.genre.trim() ||
        !url
      )
        return;
      if (!toMusicEmbedUrl(url)) return;
      setSaving(true);
      try {
        const res = await adminFetch(`/api/admin/albums/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            artist: editForm.artist,
            title: editForm.title,
            role: derivedRole,
            roleType:
              editForm.roleTypes.length > 0
                ? editForm.roleTypes.join(",")
                : "other",
            genre: editForm.genre,
            releaseDate: editForm.year.trim() || "1900",
            description: editForm.description.trim() || undefined,
            spotifyEmbedUrl: url,
            featured: editForm.featured,
          }),
        });
        if (res.ok) {
          closeEdit();
          onSuccess();
        } else {
          const err: ErrorResponse = await res.json().catch(() => ({}));
          setEditError(
            err?.message ||
              err?.error ||
              `Error ${res.status}. Check your session.`,
          );
        }
      } catch (err: unknown) {
        setEditError(
          err instanceof Error ? err.message : "Connection error.",
        );
      } finally {
        setSaving(false);
      }
    },
    [editForm, editing, closeEdit],
  );

  return { editForm, setEditForm, editing, editError, openEdit, closeEdit, handleUpdate };
}
