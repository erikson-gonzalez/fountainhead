import { NextResponse } from "next/server";
import { db, bookOfferingsTable } from "@workspace/db";

// GET /api/books — public. Ordered by sortOrder, id; numerics coerced.
export async function GET() {
  try {
    const books = await db
      .select()
      .from(bookOfferingsTable)
      .orderBy(bookOfferingsTable.sortOrder, bookOfferingsTable.id);
    return NextResponse.json({
      books: books.map((b) => ({
        ...b,
        priceEur: Number(b.priceEur),
        sortOrder: b.sortOrder != null ? Number(b.sortOrder) : 0,
      })),
    });
  } catch (err) {
    console.error("Error listing books:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
