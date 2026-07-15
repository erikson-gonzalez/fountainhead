import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PortalAccessClient } from "./portal-access-client";

// §1: Split — the sign-in form + NextAuth signIn() calls live in the client.
// Server-side we send already-authenticated portal users straight to /portal.
export const dynamic = "force-dynamic";

export default async function PortalAccessPage() {
  const session = await auth();
  if (session?.user.role === "portal") {
    redirect("/portal");
  }
  return <PortalAccessClient />;
}
