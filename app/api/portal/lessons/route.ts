import { NextResponse } from "next/server";
import { db, portalLessonsTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import { auth } from "@/lib/auth";

// GET /api/portal/lessons — session-gated (§16, closes the §3 bug). middleware
// also guards this path; the handler re-checks defensively (portal role only).
export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "portal") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [lessons, totalResult] = await Promise.all([
      db.select().from(portalLessonsTable).orderBy(portalLessonsTable.publishedAt),
      db.select({ count: sql<number>`count(*)::int` }).from(portalLessonsTable),
    ]);
    const total = totalResult[0]?.count ?? 0;
    return NextResponse.json({
      lessons: lessons.map((l) => ({
        ...l,
        thumbnailUrl: l.thumbnailUrl ?? null,
        publishedAt: l.publishedAt.toISOString(),
      })),
      total,
    });
  } catch (err) {
    console.error("Error listing portal lessons:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
