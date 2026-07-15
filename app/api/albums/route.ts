import { NextResponse, type NextRequest } from "next/server";
import { db, albumsTable } from "@workspace/db";
import { eq, desc, sql, and, like, type SQL } from "drizzle-orm";

// GET /api/albums — public. page/limit/role/genre/featured filters. Same shape as Express.
export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const page = Math.max(1, Number(sp.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(sp.get("limit")) || 12));
    const roleFilter = sp.get("role") ?? undefined;
    const genreFilter = sp.get("genre") ?? undefined;
    const featuredFilter = sp.get("featured");
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];
    const roleLower = roleFilter?.toLowerCase();
    if (roleFilter) {
      if (["performer", "producer", "mixing", "writer", "other"].includes(roleLower ?? "")) {
        conditions.push(like(albumsTable.roleType, `%${roleLower}%`));
      } else {
        conditions.push(like(albumsTable.role, `%${roleFilter}%`));
      }
    }
    if (genreFilter) conditions.push(like(albumsTable.genre, `%${genreFilter}%`));
    if (featuredFilter === "true") conditions.push(eq(albumsTable.featured, true));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [albums, totalResult] = await Promise.all([
      db.select().from(albumsTable).where(whereClause).orderBy(desc(albumsTable.id)).limit(limit).offset(offset),
      db.select({ count: sql<number>`count(*)::int` }).from(albumsTable).where(whereClause),
    ]);

    const total = totalResult[0]?.count ?? 0;
    return NextResponse.json({
      albums: albums.map((a) => ({ ...a, coverUrl: a.coverUrl ?? null, description: a.description ?? null })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error listing albums:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
