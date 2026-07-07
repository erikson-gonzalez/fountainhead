import { pgTable, serial, text, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ROLE_TYPES = ["performer", "producer", "mixing", "writer", "other"] as const;
export type RoleType = (typeof ROLE_TYPES)[number];

export const albumsTable = pgTable("albums", {
  id: serial("id").primaryKey(),
  artist: text("artist").notNull(),
  title: text("title").notNull(),
  releaseDate: text("release_date").notNull(),
  role: text("role").notNull(),
  roleType: text("role_type").notNull().default("other"),
  genre: text("genre").notNull(),
  coverUrl: text("cover_url"),
  spotifyEmbedUrl: text("spotify_embed_url"),
  description: text("description"),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// roleType: allow comma-separated values (e.g. "performer,other") - use z.any() to avoid enum validation
export const insertAlbumSchema = createInsertSchema(albumsTable, {
  roleType: z
    .any()
    .transform((val) => {
      const str = Array.isArray(val) ? val.join(",") : String(val ?? "").trim();
      if (!str) return "other";
      const valid = ["performer", "producer", "mixing", "writer", "other"];
      const parts = str
        .split(",")
        .map((p) => p.trim().toLowerCase())
        .filter((p) => valid.includes(p));
      return parts.length > 0 ? [...new Set(parts)].join(",") : "other";
    })
    .optional()
    .default("other"),
}).omit({ id: true, createdAt: true });
export type InsertAlbum = z.infer<typeof insertAlbumSchema>;
export type Album = typeof albumsTable.$inferSelect;
