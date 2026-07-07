import { useState } from "react";
import { useListAlbums } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Disc } from "lucide-react";
import { cn } from "@/lib/utils";
import { AlbumCard } from "@/components/albums/album-card";

const ROLES = ["All", "Performer", "Producer", "Mixing", "Writer"] as const;

export default function Discography() {
  const [activeRole, setActiveRole] = useState<typeof ROLES[number]>("All");

  const queryRole = activeRole === "All" ? undefined : activeRole.toLowerCase();
  const { data, isLoading } = useListAlbums({ role: queryRole, limit: 50 });

  return (
    <div className="w-full pt-32 pb-6 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 min-w-0">
        <div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4 uppercase tracking-wider">Discography</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">A comprehensive archive of performances, productions, and mixing credits.</p>
        </div>

        <div className="flex flex-nowrap gap-1 p-1 rounded-lg bg-white/5 border border-white/10 w-full max-w-full min-w-0 md:w-auto md:max-w-none overflow-x-auto md:overflow-visible [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20">
          {ROLES.map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={cn(
                "px-2.5 py-2 text-xs sm:text-sm font-medium tracking-wider uppercase rounded-md transition-all duration-200 shrink-0 md:px-4",
                activeRole === role
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              )}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-[280px] h-[152px] shrink-0 rounded-lg bg-white/5" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-white/5 rounded w-3/4" />
                <div className="h-4 bg-white/5 rounded w-1/2" />
                <div className="h-3 bg-white/5 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {data?.albums?.map((album, i) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: Math.min(i * 0.03, 0.15) }}
            >
              <AlbumCard album={album} />
            </motion.div>
          ))}
        </div>
      )}

      {data?.albums?.length === 0 && !isLoading && (
        <div className="text-center py-24 text-muted-foreground">
          <Disc className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p>No albums found for this filter.</p>
        </div>
      )}
    </div>
  );
}
