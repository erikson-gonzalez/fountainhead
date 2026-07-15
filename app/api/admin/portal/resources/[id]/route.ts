import { NextResponse, type NextRequest } from "next/server";
import { db, portalResourcesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { resourceSchema } from "@/lib/admin-schemas";

// PUT/DELETE /api/admin/portal/resources/[id] — admin (middleware-gated).
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number((await params).id);
    if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    const parsed = resourceSchema.partial().safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    await db.update(portalResourcesTable).set(parsed.data).where(eq(portalResourcesTable.id, id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error updating resource:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number((await params).id);
    if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    await db.delete(portalResourcesTable).where(eq(portalResourcesTable.id, id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error deleting resource:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
