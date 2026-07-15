import { NextResponse } from "next/server";
import { db, portalResourcesTable } from "@workspace/db";
import { auth } from "@/lib/auth";

// GET /api/portal/resources — session-gated (§16, closes the §3 bug).
export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "portal") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const resources = await db.select().from(portalResourcesTable);
    return NextResponse.json({
      resources: resources.map((r) => ({ ...r, sizeKb: r.sizeKb ?? null })),
    });
  } catch (err) {
    console.error("Error listing portal resources:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
