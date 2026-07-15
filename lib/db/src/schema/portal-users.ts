import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

/**
 * portal_users — the single additive schema change required by portal auth (§3).
 *
 * The existing portal_access table is a lead-capture "request access" form and
 * holds no credentials. Real NextAuth authentication needs a credentials store:
 *  - passwordHash is null for Google-only accounts.
 *  - provider is "credentials" | "google".
 * Access is still gated on portal_access.status === "granted" at authorize/signIn
 * time (see lib/auth); this table only stores identity, never grants access.
 */
export const portalUsersTable = pgTable("portal_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  name: text("name").notNull(),
  provider: text("provider").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PortalUser = typeof portalUsersTable.$inferSelect;
export type InsertPortalUser = typeof portalUsersTable.$inferInsert;
