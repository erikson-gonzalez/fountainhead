import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, adminUsersTable, portalUsersTable, portalAccessTable } from "@workspace/db";
import { authConfig } from "./config";

/**
 * Node-runtime NextAuth instance (§3): the full config with providers whose
 * authorize()/signIn logic needs the database and bcrypt. Used by the
 * app/api/auth/[...nextauth] route handler and server-side `auth()` calls.
 * Middleware uses the edge-safe authConfig directly instead of this module.
 */

/** Portal access is granted iff portal_access.status === "granted" for the email. */
async function isPortalAccessGranted(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;
  const [row] = await db
    .select({ status: portalAccessTable.status })
    .from(portalAccessTable)
    .where(eq(portalAccessTable.email, normalized))
    .limit(1);
  return row?.status === "granted";
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    // Admin — Credentials. authorize() ports the Express /api/admin/login logic
    // verbatim: look up admin_users by username, bcrypt.compare the password.
    Credentials({
      id: "admin-credentials",
      name: "Admin",
      credentials: { username: {}, password: {} },
      async authorize(credentials) {
        const username = asString(credentials?.username);
        const password = asString(credentials?.password);
        if (!username || !password) return null;

        const [admin] = await db
          .select()
          .from(adminUsersTable)
          .where(eq(adminUsersTable.username, username))
          .limit(1);
        if (!admin) return null;

        const match = await bcrypt.compare(password, admin.passwordHash);
        if (!match) return null;

        return { id: String(admin.id), name: admin.username, role: "admin" };
      },
    }),
    // Portal — Credentials (email + password). Gated on granted access.
    Credentials({
      id: "portal-credentials",
      name: "Portal",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const email = asString(credentials?.email).trim().toLowerCase();
        const password = asString(credentials?.password);
        if (!email || !password) return null;

        const [user] = await db
          .select()
          .from(portalUsersTable)
          .where(eq(portalUsersTable.email, email))
          .limit(1);
        if (!user || !user.passwordHash) return null;

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) return null;

        if (!(await isPortalAccessGranted(email))) return null;

        return { id: String(user.id), email: user.email, name: user.name, role: "portal" };
      },
    }),
    // Portal — Google. Placeholder env vars for now (filled in later, do not block).
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ account, user, profile }) {
      // Credentials providers already gate access inside authorize(); only the
      // Google OAuth path needs the granted-access check here (§3).
      if (account?.provider !== "google") return true;

      const email = (user.email ?? profile?.email ?? "").trim().toLowerCase();
      if (!email) return false;
      if (!(await isPortalAccessGranted(email))) return false;

      // Ensure a portal_users record exists for Google-only accounts.
      const [existing] = await db
        .select({ id: portalUsersTable.id })
        .from(portalUsersTable)
        .where(eq(portalUsersTable.email, email))
        .limit(1);
      if (!existing) {
        await db.insert(portalUsersTable).values({
          email,
          name: user.name ?? profile?.name ?? email,
          passwordHash: null,
          provider: "google",
        });
      }
      return true;
    },
  },
});
