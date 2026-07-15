import { NextResponse, type NextRequest } from "next/server";
import { db, testimonialsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { testimonialSchema } from "@/lib/admin-schemas";

// PUT/DELETE /api/admin/testimonials/[id] — admin (middleware-gated).
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number((await params).id);
    if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    const parsed = testimonialSchema.partial().safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    await db.update(testimonialsTable).set(parsed.data).where(eq(testimonialsTable.id, id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error updating testimonial:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number((await params).id);
    if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    await db.delete(testimonialsTable).where(eq(testimonialsTable.id, id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error deleting testimonial:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
