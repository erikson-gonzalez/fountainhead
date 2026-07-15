import { handlers } from "@/lib/auth";

// NextAuth v5 catch-all (§2). GET/POST handle sign-in, callback, session, signout.
export const { GET, POST } = handlers;
