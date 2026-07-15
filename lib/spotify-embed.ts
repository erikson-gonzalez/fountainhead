/**
 * Converts music URLs (Spotify, Apple Music, YouTube/YouTube Music) to embed format.
 */
export function toMusicEmbedUrl(url: string | null | undefined): string | null {
  if (!url || !url.trim()) return null;
  const trimmed = url.trim();
  if (trimmed.includes("/embed/")) return trimmed;
  // Spotify: open.spotify.com/album/xxx
  const spotify = trimmed.match(/spotify\.com\/(album|track|playlist)\/([a-zA-Z0-9]+)/);
  if (spotify) return `https://open.spotify.com/embed/${spotify[1]}/${spotify[2]}`;
  // Apple Music: music.apple.com/xx/album/name/123 -> embed.music.apple.com/xx/album/name/123
  const apple = trimmed.match(/music\.apple\.com\/([^/]+)\/(album|song|playlist|music-video)\/([^?]+)/);
  if (apple) return `https://embed.music.apple.com/${apple[1]}/${apple[2]}/${apple[3]}`;
  if (trimmed.includes("embed.music.apple.com")) return trimmed;
  // YouTube: youtube.com/watch?v=xxx or youtu.be/xxx
  const ytWatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}`;
  // YouTube playlist
  const ytList = trimmed.match(/youtube\.com\/.*[?&]list=([a-zA-Z0-9_-]+)/);
  if (ytList) return `https://www.youtube.com/embed/videoseries?list=${ytList[1]}`;
  if (trimmed.includes("youtube.com/embed/")) return trimmed;
  return null;
}

/** @deprecated Use toMusicEmbedUrl */
export function toSpotifyEmbedUrl(url: string | null | undefined): string | null {
  return toMusicEmbedUrl(url);
}
