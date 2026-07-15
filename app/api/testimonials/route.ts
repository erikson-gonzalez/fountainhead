import { NextResponse, type NextRequest } from "next/server";
import { db, testimonialsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

// GET /api/testimonials?type=... — public. Ordered featured-first, optional type filter.
export async function GET(request: NextRequest) {
  try {
    const typeFilter = request.nextUrl.searchParams.get("type") ?? undefined;
    const query = db.select().from(testimonialsTable).orderBy(desc(testimonialsTable.featured));
    const testimonials =
      typeFilter && typeFilter !== "all"
        ? await query.where(eq(testimonialsTable.type, typeFilter))
        : await query;
    return NextResponse.json({ testimonials });
  } catch (err) {
    console.error("Error listing testimonials:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
