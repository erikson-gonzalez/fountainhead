import { NextResponse, type NextRequest } from "next/server";
import { db, bookOfferingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { bookOfferingSchema } from "@/lib/admin-schemas";

// PUT/DELETE /api/admin/books/[id] — admin (middleware-gated).
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number((await params).id);
    if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    const parsed = bookOfferingSchema.partial().safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    const data = parsed.data as Record<string, unknown>;
    if (data.priceEur !== undefined) data.priceEur = String(data.priceEur);
    if (data.sortOrder !== undefined) data.sortOrder = data.sortOrder != null ? String(data.sortOrder) : null;
    await db.update(bookOfferingsTable).set(data).where(eq(bookOfferingsTable.id, id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error updating book offering:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number((await params).id);
    if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    await db.delete(bookOfferingsTable).where(eq(bookOfferingsTable.id, id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error deleting book offering:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
