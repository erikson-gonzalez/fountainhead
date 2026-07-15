import { NextResponse, type NextRequest } from "next/server";
import { db, liveShowsTable } from "@workspace/db";
import { desc, sql } from "drizzle-orm";
import { liveShowSchema } from "@/lib/admin-schemas";

// GET/POST /api/admin/live-shows — admin (middleware-gated).
export async function GET() {
  try {
    const rows = await db.select().from(liveShowsTable).orderBy(desc(sql`${liveShowsTable.date}::date`));
    return NextResponse.json({ shows: rows });
  } catch (err) {
    console.error("Error listing live shows:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const parsed = liveShowSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    const data = parsed.data;
    const [row] = await db
      .insert(liveShowsTable)
      .values({
        date: data.date,
        venue: data.venue,
        city: data.city,
        project: data.project,
        ticketUrl: data.ticketUrl?.trim() || null,
      })
      .returning({ id: liveShowsTable.id });
    return NextResponse.json({ ok: true, id: row?.id });
  } catch (err) {
    console.error("Error creating live show:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
