import type { NextAuthConfig } from "next-auth";
import type { UserRole } from "@/types/next-auth";

/**
 * Edge-safe NextAuth configuration (§3).
 *
 * This module MUST stay free of Node-only imports (db/pg, bcrypt) because it is
 * consumed by middleware.ts, which runs on the Edge runtime. The provider
 * `authorize()` functions — which need the database and bcrypt — live in
 * lib/auth/index.ts, the Node-runtime instance. The jwt/session callbacks here
 * only move fields around, so they are safe to run on both runtimes.
 *
 * Session strategy is JWT (not database sessions) with a 7-day token so the
 * token can be verified on the Edge inside middleware.
 */
const SEVEN_DAYS_IN_SECONDS = 60 * 60 * 24 * 7;

export const authConfig = {
  // trustHost lets NextAuth resolve the deployment URL from the host header
  // (required behind Vercel's proxy / any reverse proxy).
  trustHost: true,
  session: { strategy: "jwt", maxAge: SEVEN_DAYS_IN_SECONDS },
  pages: { signIn: "/tomfountainhead-admin/login" },
  // Providers are attached in lib/auth/index.ts (Node runtime). Kept empty here
  // so the Edge middleware bundle never pulls in db/bcrypt.
  providers: [],
  callbacks: {
    jwt({ token, user, account }) {
      if (user) {
        token.id = user.id ?? token.sub ?? "";
        const role = (user as { role?: UserRole }).role;
        // Credentials providers set `role` in authorize(); Google sign-ins have
        // no role on the user object, so portal is inferred from the provider.
        token.role = role ?? (account?.provider === "google" ? "portal" : token.role);
      }
      return token;
    },
    session({ session, token }) {
      // token is JWT (Record<string, unknown>); see types/next-auth.d.ts for why
      // it is not augmented. Narrow/cast into the strongly-typed Session.user.
      session.user.id = typeof token.id === "string" ? token.id : "";
      session.user.role = token.role as UserRole;
      return session;
    },
  },
} satisfies NextAuthConfig;
