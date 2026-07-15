import { NextResponse } from "next/server";
import { db, servicesTable } from "@workspace/db";

// GET /api/services — public. numeric columns coerced to Number.
export async function GET() {
  try {
    const services = await db.select().from(servicesTable);
    return NextResponse.json({
      services: services.map((s) => ({
        ...s,
        priceEur: Number(s.priceEur),
        durationHours: s.durationHours != null ? Number(s.durationHours) : null,
      })),
    });
  } catch (err) {
    console.error("Error listing services:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
