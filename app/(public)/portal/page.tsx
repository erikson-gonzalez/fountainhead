import { redirect } from "next/navigation";
import { db, portalLessonsTable, portalResourcesTable } from "@workspace/db";
import { auth } from "@/lib/auth";
import { PortalClient } from "./portal-client";

// §1: Split — page verifies the portal session server-side and fetches
// lessons/resources via Drizzle; tab switching lives in portal-client.
// middleware.ts also guards /portal, but the page re-checks defensively.
export const dynamic = "force-dynamic";

export default async function PortalPage() {
  const session = await auth();
  if (!session || session.user.role !== "portal") {
    redirect("/portal-access");
  }

  const [lessons, resources] = await Promise.all([
    db.select().from(portalLessonsTable).orderBy(portalLessonsTable.publishedAt),
    db.select().from(portalResourcesTable),
  ]);

  return (
    <PortalClient
      user={{
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        image: session.user.image ?? null,
      }}
      lessons={lessons}
      resources={resources}
    />
  );
}
