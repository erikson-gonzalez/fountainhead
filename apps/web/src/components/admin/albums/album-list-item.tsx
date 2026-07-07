import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Disc } from "lucide-react";
import { toMusicEmbedUrl } from "@/lib/spotify-embed";
import type { Album } from "./types";
import { MusicEmbedBlock } from "./music-embed-block";

interface AlbumListItemProps {
  album: Album;
  saving: boolean;
  onEdit: (album: Album) => void;
  onDelete: (id: number) => void;
}

export function AlbumListItem({
  album,
  saving,
  onEdit,
  onDelete,
}: AlbumListItemProps) {
  const hasEmbed =
    album.spotifyEmbedUrl && toMusicEmbedUrl(album.spotifyEmbedUrl);

  const roleTypeTags = album.roleType
    ? album.roleType
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const releaseYear = album.releaseDate?.split("-")[0];
  const showYear = releaseYear && releaseYear !== "1900";

  const handleEdit = useCallback(() => onEdit(album), [album, onEdit]);
  const handleDelete = useCallback(
    () => onDelete(album.id),
    [album.id, onDelete],
  );

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
      <div className="flex-shrink-0 w-full md:w-72 min-w-0 rounded-lg overflow-hidden bg-[#121212]">
        {hasEmbed ? (
          <MusicEmbedBlock url={album.spotifyEmbedUrl!} />
        ) : (
          <div className="h-[152px] flex items-center justify-center bg-slate-100">
            <Disc className="w-12 h-12 text-slate-300" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center overflow-hidden">
        <p
          className="font-medium text-slate-900 text-base truncate"
          title={album.title}
        >
          {album.title}
        </p>
        <p
          className="text-xs text-slate-500 uppercase tracking-wider mt-0.5 truncate"
          title={album.artist}
        >
          {album.artist}
        </p>
        <div className="flex flex-wrap gap-1 mt-2 min-w-0">
          {roleTypeTags.map((rt) => (
            <span
              key={rt}
              className="text-xs px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 uppercase shrink-0"
            >
              {rt}
            </span>
          ))}
          <span className="text-xs text-slate-500 truncate min-w-0">
            {album.role}
          </span>
          {album.genre && (
            <span className="text-xs text-slate-500 shrink-0">
              · {album.genre}
            </span>
          )}
          {showYear && (
            <span className="text-xs text-slate-400 shrink-0">
              · {releaseYear}
            </span>
          )}
        </div>
        <div className="mt-auto pt-3 flex gap-2">
          <Button
            type="button"
            size="sm"
            onClick={handleEdit}
            disabled={saving}
            className="bg-slate-800 hover:bg-slate-900 text-white"
          >
            <Pencil className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleDelete}
            disabled={saving}
            className="bg-slate-800 hover:bg-slate-900 text-white"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
