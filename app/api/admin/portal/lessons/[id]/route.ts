import { NextResponse, type NextRequest } from "next/server";
import { db, portalLessonsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { lessonSchema } from "@/lib/admin-schemas";

// PUT/DELETE /api/admin/portal/lessons/[id] — admin (middleware-gated).
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number((await params).id);
    if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    const parsed = lessonSchema.partial().safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    await db.update(portalLessonsTable).set(parsed.data).where(eq(portalLessonsTable.id, id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error updating lesson:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number((await params).id);
    if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    await db.delete(portalLessonsTable).where(eq(portalLessonsTable.id, id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error deleting lesson:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
