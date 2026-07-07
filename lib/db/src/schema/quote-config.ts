import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const quoteConfigTable = pgTable("quote_config", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type QuoteConfig = typeof quoteConfigTable.$inferSelect;
export type InsertQuoteConfig = typeof quoteConfigTable.$inferInsert;
