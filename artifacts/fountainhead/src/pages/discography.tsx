import { useState } from "react";
import { useListAlbums } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Disc, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ROLES = ["All", "Performer", "Producer", "Mixing", "Writer"];

export default function Discography() {
  const [activeRole, setActiveRole] = useState("All");
  
  // Mapping 'All' to undefined for the API call
  const queryRole = activeRole === "All" ? undefined : activeRole.toLowerCase();
  
  const { data, isLoading } = useListAlbums({ role: queryRole, limit: 50 });

  return (
    <div className="w-full pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4 uppercase tracking-wider">Discography</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">A comprehensive archive of performances, productions, and mixing credits.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground mr-2" />
          {ROLES.map(role => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={cn(
                "px-4 py-2 text-sm font-medium tracking-wider uppercase border rounded-sm transition-all",
                activeRole === role 
                  ? "border-primary bg-primary/10 text-primary" 
                  : "border-white/10 text-muted-foreground hover:border-white/30 hover:text-white"
              )}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-pulse">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-square bg-white/5 border border-white/10 rounded-sm" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
          {data?.albums?.map((album, i) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group"
            >
              <div className="aspect-square relative mb-4 overflow-hidden bg-white/5 border border-white/10 rounded-sm shadow-lg">
                {album.coverUrl ? (
                  <img src={album.coverUrl} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/10">
                    <Disc className="w-12 h-12" />
                  </div>
                )}
                {album.featured && (
                  <div className="absolute top-2 right-2 bg-secondary text-secondary-foreground text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-sm shadow-md">
                    Featured
                  </div>
                )}
              </div>
              <h3 className="text-white font-display font-bold text-lg leading-tight mb-1">{album.title}</h3>
              <p className="text-muted-foreground text-sm uppercase tracking-wider mb-2">{album.artist}</p>
              <div className="flex gap-2 text-xs">
                <span className="text-primary border border-primary/30 px-1.5 py-0.5 rounded-sm bg-primary/5">{album.role}</span>
                <span className="text-muted-foreground/70">{album.releaseDate.split('-')[0]}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {data?.albums?.length === 0 && (
        <div className="text-center py-24 text-muted-foreground">
          <Disc className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p>No albums found for this filter.</p>
        </div>
      )}
    </div>
  );
}
