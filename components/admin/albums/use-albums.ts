"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import type { Album } from "./types";

interface UseAlbumsReturn {
  albums: Album[];
  loading: boolean;
  loadError: string | null;
  saving: boolean;
  setSaving: React.Dispatch<React.SetStateAction<boolean>>;
  loadAlbums: () => void;
  handleDelete: (id: number) => Promise<void>;
}

export function useAlbums(): UseAlbumsReturn {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadAlbums = useCallback(() => {
    setLoading(true);
    setLoadError(null);
    adminFetch("/api/admin/albums")
      .then((r) => {
        if (r.status === 404) return { albums: [] };
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<{ albums: Album[] }>;
      })
      .then((data) => {
        setAlbums(data?.albums ?? []);
        setLoadError(null);
      })
      .catch((err: unknown) => {
        setAlbums([]);
        const msg = err instanceof Error ? err.message : "Error loading";
        setLoadError(msg === "HTTP 404" ? null : msg);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadAlbums();
  }, [loadAlbums]);

  const handleDelete = useCallback(
    async (id: number) => {
      if (!confirm("Delete this item from the discography?")) return;
      setSaving(true);
      try {
        const res = await adminFetch(`/api/admin/albums/${id}`, {
          method: "DELETE",
        });
        if (res.ok) loadAlbums();
      } finally {
        setSaving(false);
      }
    },
    [loadAlbums],
  );

  return {
    albums,
    loading,
    loadError,
    saving,
    setSaving,
    loadAlbums,
    handleDelete,
  };
}
