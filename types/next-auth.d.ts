import type { DefaultSession } from "next-auth";

export type UserRole = "admin" | "portal";

declare module "next-auth" {
  interface User {
    role: UserRole;
  }

  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
}

// NOTE: JWT is not augmented here. `next-auth/jwt` only re-exports (`export *`)
// the interface from `@auth/core/jwt`, so a `declare module "next-auth/jwt"`
// augmentation does not merge into it, and `@auth/core/jwt` is not resolvable
// from the workspace root under pnpm (it is a transitive, non-direct dep).
// The token's `id`/`role` are therefore read via explicit narrowing/casts in
// the jwt/session callbacks (lib/auth/config.ts). Session.user (augmented above)
// is what middleware and server code consume, and that IS strongly typed.
