import { Disc } from "lucide-react";
import { toMusicEmbedUrl } from "@/lib/spotify-embed";
import type { AlbumCardPreviewProps } from "./types";

export function AlbumCardPreview({
  title,
  artist,
  role,
  genre,
  year,
  embedUrl,
  description,
}: AlbumCardPreviewProps) {
  const resolvedEmbed = embedUrl.trim() ? toMusicEmbedUrl(embedUrl.trim()) : null;
  const showYear = year.trim() && year.trim() !== "1900";

  return (
    <div className="rounded-xl bg-[#0a0a0a] border border-white/10 p-4">
      <p className="text-xs text-white/30 uppercase tracking-widest mb-3">
        Vista previa del card
      </p>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
        <div className="w-full sm:w-[280px] shrink-0 rounded-lg overflow-hidden bg-[#121212]">
          {resolvedEmbed ? (
            <iframe
              src={resolvedEmbed}
              title="Music player"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="w-full h-[152px] rounded-lg border-0 min-w-0"
            />
          ) : (
            <div className="h-[152px] flex items-center justify-center text-white/20">
              <Disc className="w-12 h-12" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 pt-1 overflow-hidden">
          <h3 className="text-white font-bold text-xl leading-tight mb-1 truncate">
            {title || (
              <span className="text-white/20 italic">Title</span>
            )}
          </h3>
          <p className="text-white/50 text-sm uppercase tracking-wider mb-2 truncate">
            {artist || <span className="italic">Artista</span>}
          </p>
          <div className="flex flex-wrap gap-2 text-sm min-w-0 mb-2">
            {role && (
              <span className="text-red-400 border border-red-400/30 px-2 py-0.5 rounded-sm bg-red-400/5 truncate max-w-full">
                {role}
              </span>
            )}
            {genre && (
              <span className="text-white/60 border border-white/10 px-2 py-0.5 rounded-sm bg-white/5 truncate max-w-full">
                {genre}
              </span>
            )}
            {showYear && (
              <span className="text-white/40 shrink-0">{year}</span>
            )}
          </div>
          {description && (
            <p className="text-white/40 text-sm leading-relaxed line-clamp-2">
              {description.length > 100
                ? description.slice(0, 100) + "…"
                : description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
