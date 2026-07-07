import { Disc } from "lucide-react";
import type { Album } from "@workspace/api-client-react";
import { toMusicEmbedUrl } from "@/lib/spotify-embed";

type AlbumWithEmbed = Album & { spotifyEmbedUrl?: string | null };

interface AlbumCardProps {
  album: AlbumWithEmbed;
}

function MusicEmbed({ url }: { url: string }) {
  const embedUrl = toMusicEmbedUrl(url);
  if (!embedUrl) return null;
  return (
    <iframe
      src={embedUrl}
      title="Music player"
      frameBorder="0"
      allowFullScreen
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      className="w-full h-[152px] rounded-lg border-0 min-w-0"
    />
  );
}

export function AlbumCard({ album }: AlbumCardProps) {
  const hasEmbed = album.spotifyEmbedUrl && toMusicEmbedUrl(album.spotifyEmbedUrl);
  const year = album.releaseDate?.split("-")[0];
  const showYear = year && year !== "1900";
  const description = album.description
    ? album.description.length > 100
      ? album.description.slice(0, 100) + "…"
      : album.description
    : null;

  return (
    <article className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
      <div className="w-full sm:w-[280px] shrink-0 rounded-lg overflow-hidden bg-[#121212]">
        {hasEmbed ? (
          <MusicEmbed url={album.spotifyEmbedUrl!} />
        ) : (
          <div className="h-[152px] flex items-center justify-center text-white/20">
            {album.coverUrl ? (
              <img
                src={album.coverUrl}
                alt={album.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Disc className="w-12 h-12" />
            )}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 pt-1 overflow-hidden">
        <h3
          className="text-white font-display font-bold text-xl leading-tight mb-1 truncate"
          title={album.title}
        >
          {album.title}
        </h3>
        <p
          className="text-muted-foreground text-sm uppercase tracking-wider mb-2 truncate"
          title={album.artist}
        >
          {album.artist}
        </p>
        <div className="flex flex-wrap gap-2 text-sm min-w-0 mb-2">
          <span className="text-primary border border-primary/30 px-2 py-0.5 rounded-sm bg-primary/5 truncate max-w-full">
            {album.role}
          </span>
          {album.genre && (
            <span className="text-white/60 border border-white/10 px-2 py-0.5 rounded-sm bg-white/5 truncate max-w-full">
              {album.genre}
            </span>
          )}
          {showYear && (
            <span className="text-muted-foreground/70 shrink-0">{year}</span>
          )}
        </div>
        {description && (
          <p className="text-muted-foreground/70 text-sm leading-relaxed line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </article>
  );
}
