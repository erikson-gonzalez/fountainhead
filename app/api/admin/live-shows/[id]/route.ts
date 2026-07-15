import { NextResponse, type NextRequest } from "next/server";
import { db, liveShowsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { liveShowSchema } from "@/lib/admin-schemas";

// PUT/DELETE /api/admin/live-shows/[id] — admin (middleware-gated).
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number((await params).id);
    if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    const parsed = liveShowSchema.partial().safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    const data = parsed.data as Record<string, unknown>;
    if (data.ticketUrl === "") data.ticketUrl = null;
    await db.update(liveShowsTable).set(data).where(eq(liveShowsTable.id, id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error updating live show:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number((await params).id);
    if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    await db.delete(liveShowsTable).where(eq(liveShowsTable.id, id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error deleting live show:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
