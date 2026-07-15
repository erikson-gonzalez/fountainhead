"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import type { Album } from "./types";
import { AlbumListItem } from "./album-list-item";

interface AlbumListProps {
  albums: Album[];
  loading: boolean;
  saving: boolean;
  onRefresh: () => void;
  onEdit: (album: Album) => void;
  onDelete: (id: number) => void;
}

export function AlbumList({
  albums,
  loading,
  saving,
  onRefresh,
  onEdit,
  onDelete,
}: AlbumListProps) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-3">
        <h4 className="font-medium text-slate-800">Material actual</h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
          className="text-slate-600 hover:text-slate-800"
        >
          <RefreshCw
            className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`}
          />
          Refrescar
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : albums.length === 0 ? (
        <p className="text-sm text-slate-500 italic">No hay material.</p>
      ) : (
        <div className="space-y-8">
          {albums.map((album) => (
            <AlbumListItem
              key={album.id}
              album={album}
              saving={saving}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
