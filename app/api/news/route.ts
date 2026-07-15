import { NextResponse, type NextRequest } from "next/server";
import { db, newsTable } from "@workspace/db";
import { desc, sql } from "drizzle-orm";

// GET /api/news — public. page/limit pagination. Same shape as Express.
export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const page = Math.max(1, Number(sp.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(sp.get("limit")) || 10));
    const offset = (page - 1) * limit;

    const [posts, totalResult] = await Promise.all([
      db.select().from(newsTable).orderBy(desc(newsTable.publishedAt)).limit(limit).offset(offset),
      db.select({ count: sql<number>`count(*)::int` }).from(newsTable),
    ]);

    const total = totalResult[0]?.count ?? 0;
    return NextResponse.json({
      posts: posts.map((p) => ({
        ...p,
        excerpt: p.excerpt ?? null,
        imageUrl: p.imageUrl ?? null,
        publishedAt: p.publishedAt.toISOString(),
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error listing news:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
