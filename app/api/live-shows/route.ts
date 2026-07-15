import { NextResponse } from "next/server";
import { db, liveShowsTable } from "@workspace/db";
import { desc, sql } from "drizzle-orm";

// GET /api/live-shows — public. Ordered by date desc (most recent first).
export async function GET() {
  try {
    const shows = await db
      .select()
      .from(liveShowsTable)
      .orderBy(desc(sql`${liveShowsTable.date}::date`));
    return NextResponse.json({ shows });
  } catch (err) {
    console.error("Error listing live shows:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
