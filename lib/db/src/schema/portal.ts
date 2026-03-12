import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const portalLessonsTable = pgTable("portal_lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  duration: integer("duration").notNull(),
  topic: text("topic").notNull(),
  level: text("level").notNull().default("intermediate"),
  videoUrl: text("video_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const portalResourcesTable = pgTable("portal_resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(),
  sizeKb: integer("size_kb"),
  downloadable: boolean("downloadable").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const portalAccessTable = pgTable("portal_access", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  studentOf: text("student_of"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPortalLessonSchema = createInsertSchema(portalLessonsTable).omit({ id: true, createdAt: true });
export const insertPortalResourceSchema = createInsertSchema(portalResourcesTable).omit({ id: true, createdAt: true });
export const insertPortalAccessSchema = createInsertSchema(portalAccessTable).omit({ id: true, createdAt: true });

export type InsertPortalLesson = z.infer<typeof insertPortalLessonSchema>;
export type InsertPortalResource = z.infer<typeof insertPortalResourceSchema>;
export type InsertPortalAccess = z.infer<typeof insertPortalAccessSchema>;
export type PortalLesson = typeof portalLessonsTable.$inferSelect;
export type PortalResource = typeof portalResourcesTable.$inferSelect;
export type PortalAccess = typeof portalAccessTable.$inferSelect;
