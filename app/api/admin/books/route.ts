import { NextResponse, type NextRequest } from "next/server";
import { db, bookOfferingsTable } from "@workspace/db";
import { bookOfferingSchema } from "@/lib/admin-schemas";

// GET/POST /api/admin/books — admin (middleware-gated).
export async function GET() {
  try {
    const rows = await db.select().from(bookOfferingsTable).orderBy(bookOfferingsTable.sortOrder, bookOfferingsTable.id);
    return NextResponse.json({
      books: rows.map((b) => ({ ...b, priceEur: Number(b.priceEur), sortOrder: b.sortOrder != null ? Number(b.sortOrder) : 0 })),
    });
  } catch (err) {
    console.error("Error listing books:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const parsed = bookOfferingSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    const { priceEur, sortOrder, ...rest } = parsed.data;
    const [row] = await db
      .insert(bookOfferingsTable)
      .values({ ...rest, priceEur: String(priceEur), sortOrder: sortOrder != null ? String(sortOrder) : null })
      .returning({ id: bookOfferingsTable.id });
    return NextResponse.json({ ok: true, id: row?.id });
  } catch (err) {
    console.error("Error creating book offering:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
