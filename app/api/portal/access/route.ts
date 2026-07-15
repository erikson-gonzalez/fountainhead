import { NextResponse, type NextRequest } from "next/server";
import { db, portalAccessTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

// POST /api/portal/access — PUBLIC lead-capture "request access" form (not auth).
const accessSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  studentOf: z.string().nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = accessSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }

    const { name, email, studentOf } = parsed.data;

    const existing = await db.select().from(portalAccessTable).where(eq(portalAccessTable.email, email));
    if (existing.length > 0) {
      const record = existing[0]!;
      return NextResponse.json({
        status: record.status === "granted" ? "granted" : "pending",
        message:
          record.status === "granted"
            ? "Access already granted. Welcome back!"
            : "Your request is under review. We'll contact you soon.",
      });
    }

    await db.insert(portalAccessTable).values({
      name,
      email,
      studentOf: studentOf ?? null,
      status: "pending",
    });

    return NextResponse.json({
      status: "pending",
      message: "Access request submitted! Tom will review and get back to you within 48 hours.",
    });
  } catch (err) {
    console.error("Error requesting portal access:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
