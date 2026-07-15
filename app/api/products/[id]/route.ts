import { NextResponse } from "next/server";
import { db, productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

// GET /api/products/[id] — public.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, id));
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json({ ...product, priceEur: Number(product.priceEur), imageUrl: product.imageUrl ?? null, stock: product.stock ?? null });
  } catch (err) {
    console.error("Error fetching product:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
