import { db, albumsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { DiscographyClient } from "./discography-client";

// §1: Split — role filter is client state. Server fetches the archive via Drizzle
// (same order/limit as GET /api/albums); the client filters in-memory so the
// role toggle stays instant (no per-click round-trip).
export const dynamic = "force-dynamic";

export default async function DiscographyPage() {
  const albums = await db
    .select()
    .from(albumsTable)
    .orderBy(desc(albumsTable.id))
    .limit(50);

  return <DiscographyClient albums={albums} />;
}
