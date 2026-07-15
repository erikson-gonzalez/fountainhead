"use client";

import { useQuery } from "@tanstack/react-query";

export interface ArtistInfo {
  tagline: string;
  bio: string;
  heroTagline: string;
  heroVideoUrl: string;
  heroPosterUrl: string;
  heroTitlePrefix: string;
  heroTitleHighlight: string;
  heroTitleSuffix: string;
  testimonialsSectionTitle: string;
  testimonialsSectionSubtitle: string;
  aboutHeading: string;
  aboutSubheading: string;
  aboutPortraitUrl: string;
  endorsements: string;
  endorsementsSectionTitle: string;
  musicLinks: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
}

async function fetchArtistInfo(): Promise<ArtistInfo> {
  const res = await fetch("/api/artist-info", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch artist info");
  return res.json();
}

export function useArtistInfo() {
  return useQuery({
    queryKey: ["artist-info"],
    queryFn: fetchArtistInfo,
    staleTime: 30 * 1000, // 30s so edits in admin show quickly on home
    refetchOnWindowFocus: true, // refetch when switching back to tab after saving in admin
  });
}
