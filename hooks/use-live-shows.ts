"use client";

import { useQuery } from "@tanstack/react-query";

export interface LiveShow {
  id: number;
  date: string;
  venue: string;
  city: string;
  project: string;
  ticketUrl: string | null;
}

export function useLiveShows() {
  return useQuery({
    queryKey: ["/api/live-shows"],
    queryFn: async ({ signal }) => {
      const res = await fetch("/api/live-shows", { signal });
      if (!res.ok) throw new Error("Failed to fetch live shows");
      const data = await res.json();
      return data.shows as LiveShow[];
    },
  });
}
