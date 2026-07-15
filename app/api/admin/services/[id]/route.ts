import { NextResponse, type NextRequest } from "next/server";
import { db, servicesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { serviceSchema } from "@/lib/admin-schemas";

// PUT/DELETE /api/admin/services/[id] — admin (middleware-gated).
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number((await params).id);
    if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    const parsed = serviceSchema.partial().safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    const data = parsed.data as Record<string, unknown>;
    if (data.priceEur !== undefined) data.priceEur = String(data.priceEur);
    if (data.durationHours !== undefined) data.durationHours = data.durationHours != null ? String(data.durationHours) : null;
    await db.update(servicesTable).set(data).where(eq(servicesTable.id, id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error updating service:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number((await params).id);
    if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    await db.delete(servicesTable).where(eq(servicesTable.id, id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error deleting service:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
