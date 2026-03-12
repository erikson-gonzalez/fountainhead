import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { numeric } from "drizzle-orm/pg-core";

export const quotesTable = pgTable("quotes", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  serviceType: text("service_type").notNull(),
  songCount: integer("song_count").notNull().default(1),
  projectDescription: text("project_description").notNull(),
  genre: text("genre"),
  budget: numeric("budget", { precision: 10, scale: 2 }),
  referenceLinks: text("reference_links"),
  estimatedPrice: numeric("estimated_price", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertQuoteSchema = createInsertSchema(quotesTable).omit({ id: true, createdAt: true });
export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Quote = typeof quotesTable.$inferSelect;
