import { NextResponse, type NextRequest } from "next/server";
import { db, bookingsTable } from "@workspace/db";
import { and, eq } from "drizzle-orm";
import { generateAvailableSlots } from "@/lib/booking-slots";

// GET /api/bookings/availability — public.
export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const serviceType = sp.get("serviceType");
    const month = sp.get("month");

    if (!serviceType || !month) {
      return NextResponse.json({ error: "serviceType and month are required" }, { status: 400 });
    }

    const bookedSlots = await db
      .select({ date: bookingsTable.date, startTime: bookingsTable.startTime })
      .from(bookingsTable)
      .where(and(eq(bookingsTable.serviceType, serviceType), eq(bookingsTable.status, "confirmed")));

    const bookedSet = new Set(bookedSlots.map((b) => `${b.date}-${b.startTime}`));
    const slots = generateAvailableSlots(serviceType, month).map((slot) => ({
      ...slot,
      available: !bookedSet.has(`${slot.date}-${slot.startTime}`),
    }));

    return NextResponse.json({ slots, serviceType, month });
  } catch (err) {
    console.error("Error fetching availability:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
