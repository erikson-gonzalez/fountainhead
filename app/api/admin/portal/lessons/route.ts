import { NextResponse, type NextRequest } from "next/server";
import { db, portalLessonsTable } from "@workspace/db";
import { lessonSchema } from "@/lib/admin-schemas";

// POST /api/admin/portal/lessons — admin (middleware-gated).
export async function POST(request: NextRequest) {
  try {
    const parsed = lessonSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    await db.insert(portalLessonsTable).values(parsed.data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error creating lesson:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
