import { toMusicEmbedUrl } from "@/lib/spotify-embed";

interface MusicEmbedBlockProps {
  url: string;
}

export function MusicEmbedBlock({ url }: MusicEmbedBlockProps) {
  const embedUrl = toMusicEmbedUrl(url);
  if (!embedUrl) return null;
  return (
    <iframe
      src={embedUrl}
      title="Music player"
      width="100%"
      height="152"
      frameBorder="0"
      allowFullScreen
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      className="block rounded-lg"
    />
  );
}
