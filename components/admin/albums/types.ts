export interface Album {
  id: number;
  artist: string;
  title: string;
  releaseDate: string;
  role: string;
  roleType: string;
  genre: string;
  coverUrl: string | null;
  spotifyEmbedUrl: string | null;
  description: string | null;
  featured: boolean;
}

export interface AlbumFormState {
  artist: string;
  title: string;
  otherRole: string;
  roleTypes: string[];
  genre: string;
  year: string;
  description: string;
  embedUrl: string;
  featured: boolean;
}

export interface AlbumCardPreviewProps {
  title: string;
  artist: string;
  role: string;
  genre: string;
  year: string;
  embedUrl: string;
  description?: string;
}

export interface RoleTypeOption {
  value: string;
  label: string;
}

export const ROLE_TYPES: readonly RoleTypeOption[] = [
  { value: "performer", label: "Performer" },
  { value: "producer", label: "Producer" },
  { value: "mixing", label: "Mixing" },
  { value: "writer", label: "Writer" },
  { value: "other", label: "Other" },
] as const;

export function deriveRole(roleTypes: string[], otherRole: string): string {
  const hasOther = roleTypes.includes("other");
  if (hasOther) return otherRole.trim();
  return roleTypes
    .map((r) => r.charAt(0).toUpperCase() + r.slice(1))
    .join(", ");
}
