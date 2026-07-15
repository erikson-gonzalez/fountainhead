import { NextResponse, type NextRequest } from "next/server";
import { db, servicesTable } from "@workspace/db";
import { serviceSchema } from "@/lib/admin-schemas";

// GET/POST /api/admin/services — admin (middleware-gated).
export async function GET() {
  try {
    const rows = await db.select().from(servicesTable).orderBy(servicesTable.id);
    return NextResponse.json({
      services: rows.map((s) => ({
        ...s,
        priceEur: Number(s.priceEur),
        durationHours: s.durationHours != null ? Number(s.durationHours) : null,
      })),
    });
  } catch (err) {
    console.error("Error listing services:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const parsed = serviceSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    const { priceEur, durationHours, ...rest } = parsed.data;
    const [row] = await db
      .insert(servicesTable)
      .values({ ...rest, priceEur: String(priceEur), durationHours: durationHours != null ? String(durationHours) : null })
      .returning({ id: servicesTable.id });
    return NextResponse.json({ ok: true, id: row?.id });
  } catch (err) {
    console.error("Error creating service:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
