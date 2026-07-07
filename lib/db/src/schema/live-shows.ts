import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const liveShowsTable = pgTable("live_shows", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(), // YYYY-MM-DD
  venue: text("venue").notNull(),
  city: text("city").notNull(),
  project: text("project").notNull(),
  ticketUrl: text("ticket_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type LiveShow = typeof liveShowsTable.$inferSelect;
export type InsertLiveShow = typeof liveShowsTable.$inferInsert;
