import { NextResponse, type NextRequest } from "next/server";
import { db, productsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";

// GET /api/products — public. page/limit/category filter. Same shape as Express.
export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const page = Math.max(1, Number(sp.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(sp.get("limit")) || 12));
    const category = sp.get("category") ?? undefined;
    const offset = (page - 1) * limit;

    const hasCategory = Boolean(category && category !== "all");
    const [products, totalResult] = await Promise.all([
      hasCategory
        ? db.select().from(productsTable).where(eq(productsTable.category, category!)).orderBy(desc(productsTable.featured)).limit(limit).offset(offset)
        : db.select().from(productsTable).orderBy(desc(productsTable.featured)).limit(limit).offset(offset),
      hasCategory
        ? db.select({ count: sql<number>`count(*)::int` }).from(productsTable).where(eq(productsTable.category, category!))
        : db.select({ count: sql<number>`count(*)::int` }).from(productsTable),
    ]);

    const total = totalResult[0]?.count ?? 0;
    return NextResponse.json({
      products: products.map((p) => ({
        ...p,
        priceEur: Number(p.priceEur),
        imageUrl: p.imageUrl ?? null,
        stock: p.stock ?? null,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error listing products:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
