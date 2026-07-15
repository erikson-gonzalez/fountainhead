import { z } from "zod";

// Shared admin request schemas (ported verbatim from apps/api admin.ts). Kept in
// a plain module so route.ts files only export HTTP handlers, while the list and
// [id] handlers share one schema definition.

export const testimonialSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  quote: z.string().min(1),
  type: z.enum(["artist", "student"]).optional().default("artist"),
  featured: z.boolean().optional().default(false),
});

export const albumSchema = z.object({
  artist: z.string().min(1),
  title: z.string().min(1),
  releaseDate: z.string().optional(),
  role: z.string().min(1),
  roleType: z
    .preprocess((val) => {
      const str = Array.isArray(val) ? val.join(",") : String(val ?? "").trim();
      if (!str) return "other";
      const valid = ["performer", "producer", "mixing", "writer", "other"];
      const parts = str.split(",").map((p) => p.trim().toLowerCase()).filter((p) => valid.includes(p));
      return parts.length > 0 ? [...new Set(parts)].join(",") : "other";
    }, z.string())
    .optional()
    .default("other"),
  genre: z.string().min(1),
  coverUrl: z.string().nullish(),
  spotifyEmbedUrl: z.string().nullish(),
  description: z.string().nullish(),
  featured: z.boolean().optional().default(false),
});

export const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceEur: z.union([z.number(), z.string()]),
  category: z.string().min(1),
  imageUrl: z.string().optional().nullable(),
  stock: z.number().optional().nullable(),
  digital: z.boolean().optional().default(false),
  featured: z.boolean().optional().default(false),
  deliveryType: z.enum(["physical", "download", "stream"]).optional().nullable(),
});

export const lessonSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  duration: z.number().min(0),
  topic: z.string().min(1),
  level: z.string().optional().default("intermediate"),
  videoUrl: z.string().min(1),
  thumbnailUrl: z.string().optional().nullable(),
});

export const resourceSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  fileUrl: z.string().min(1),
  fileType: z.string().min(1),
  sizeKb: z.number().optional().nullable(),
  downloadable: z.boolean().optional().default(true),
});

export const serviceSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceEur: z.union([z.number(), z.string()]),
  category: z.string().min(1),
  tag: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  unit: z.string().min(1),
  durationHours: z.union([z.number(), z.string()]).optional().nullable(),
});

export const bookOfferingSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceEur: z.union([z.number(), z.string()]),
  unit: z.string().min(1),
  tag: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  linkType: z.enum(["booking", "quote"]).optional().default("booking"),
  sortOrder: z.union([z.number(), z.string()]).optional().nullable(),
});

export const liveShowSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  venue: z.string().min(1),
  city: z.string().min(1),
  project: z.string().min(1),
  ticketUrl: z.string().url().optional().or(z.literal("")),
});
