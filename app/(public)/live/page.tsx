import { db, liveShowsTable } from "@workspace/db";
import { desc, sql } from "drizzle-orm";
import { LiveClient } from "./live-client";

// §1: Split — the booking modal + search/collapse are client state. Server
// fetches shows via Drizzle (same date::date desc ordering as GET /api/live-shows).
export const dynamic = "force-dynamic";

export default async function LivePage() {
  const shows = await db
    .select()
    .from(liveShowsTable)
    .orderBy(desc(sql`${liveShowsTable.date}::date`));

  return <LiveClient shows={shows} />;
}
