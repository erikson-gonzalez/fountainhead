import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { numeric } from "drizzle-orm/pg-core";

export const bookOfferingsTable = pgTable("book_offerings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  priceEur: numeric("price_eur", { precision: 10, scale: 2 }).notNull(),
  unit: text("unit").notNull(),
  tag: text("tag"),
  icon: text("icon"),
  imageUrl: text("image_url"),
  linkType: text("link_type").notNull().default("booking"), // "booking" | "quote"
  sortOrder: numeric("sort_order", { precision: 4, scale: 0 }).default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBookOfferingSchema = createInsertSchema(bookOfferingsTable).omit({ id: true, createdAt: true });
export type InsertBookOffering = z.infer<typeof insertBookOfferingSchema>;
export type BookOffering = typeof bookOfferingsTable.$inferSelect;
