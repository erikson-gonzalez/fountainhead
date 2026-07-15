import { NextResponse, type NextRequest } from "next/server";
import { db, productsTable } from "@workspace/db";
import { productSchema } from "@/lib/admin-schemas";

// GET/POST /api/admin/products — admin (middleware-gated).
export async function GET() {
  try {
    const rows = await db.select().from(productsTable).orderBy(productsTable.id);
    return NextResponse.json({
      products: rows.map((p) => ({ ...p, priceEur: Number(p.priceEur), imageUrl: p.imageUrl ?? null, stock: p.stock ?? null })),
    });
  } catch (err) {
    console.error("Error listing products:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const parsed = productSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    const { priceEur, deliveryType, digital, ...rest } = parsed.data;
    const digitalVal = deliveryType ? deliveryType !== "physical" : (digital ?? false);
    await db.insert(productsTable).values({ ...rest, priceEur: String(priceEur), deliveryType: deliveryType ?? null, digital: digitalVal });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error creating product:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
