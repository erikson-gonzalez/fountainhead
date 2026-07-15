import { NextResponse, type NextRequest } from "next/server";
import { db, bookingsTable } from "@workspace/db";
import { z } from "zod";
import { SERVICE_PRICES, SERVICE_DURATIONS } from "@/lib/booking-slots";

// GET/POST /api/bookings — public. Same payload shapes as Express.
export async function GET() {
  try {
    const bookings = await db.select().from(bookingsTable).orderBy(bookingsTable.date);
    return NextResponse.json({
      bookings: bookings.map((b) => ({
        ...b,
        priceEur: Number(b.priceEur),
        notes: b.notes ?? null,
        createdAt: b.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error("Error listing bookings:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const createBookingSchema = z.object({
  serviceType: z.enum(["lesson", "coaching", "studio"]),
  date: z.string(),
  startTime: z.string(),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  notes: z.string().nullable().optional(),
  durationHours: z.number().int().positive().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createBookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }

    const { serviceType, date, startTime, customerName, customerEmail, notes } = parsed.data;
    const duration = SERVICE_DURATIONS[serviceType] ?? 1;
    const price = SERVICE_PRICES[serviceType] ?? 0;

    const [h, m] = startTime.split(":").map(Number);
    const endHour = h + duration;
    const endTime = `${String(endHour).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

    const [booking] = await db
      .insert(bookingsTable)
      .values({
        serviceType,
        date,
        startTime,
        endTime,
        customerName,
        customerEmail,
        notes: notes ?? null,
        priceEur: price.toFixed(2),
        status: "pending",
        durationHours: duration,
      })
      .returning();

    return NextResponse.json(
      {
        ...booking,
        priceEur: Number(booking.priceEur),
        notes: booking.notes ?? null,
        createdAt: booking.createdAt.toISOString(),
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Error creating booking:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
