import { NextResponse, type NextRequest } from "next/server";
import { db, testimonialsTable } from "@workspace/db";
import { testimonialSchema } from "@/lib/admin-schemas";

// GET/POST /api/admin/testimonials — admin (middleware-gated).

export async function GET() {
  try {
    const rows = await db.select().from(testimonialsTable).orderBy(testimonialsTable.id);
    return NextResponse.json({ testimonials: rows });
  } catch (err) {
    console.error("Error listing testimonials:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const parsed = testimonialSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    const [row] = await db.insert(testimonialsTable).values(parsed.data).returning({ id: testimonialsTable.id });
    return NextResponse.json({ ok: true, id: row?.id });
  } catch (err) {
    console.error("Error creating testimonial:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
