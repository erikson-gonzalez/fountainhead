import { NextResponse, type NextRequest } from "next/server";
import { db, portalResourcesTable } from "@workspace/db";
import { resourceSchema } from "@/lib/admin-schemas";

// POST /api/admin/portal/resources — admin (middleware-gated).
export async function POST(request: NextRequest) {
  try {
    const parsed = resourceSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    await db.insert(portalResourcesTable).values(parsed.data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error creating resource:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
