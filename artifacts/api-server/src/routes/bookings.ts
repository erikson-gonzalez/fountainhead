import { Router, type IRouter } from "express";
import { db, bookingsTable } from "@workspace/db";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const router: IRouter = Router();

const SERVICE_PRICES: Record<string, number> = {
  lesson: 45,
  coaching: 50,
  studio: 200,
};

const SERVICE_DURATIONS: Record<string, number> = {
  lesson: 1,
  coaching: 1,
  studio: 8,
};

function generateAvailableSlots(serviceType: string, month: string) {
  const [year, monthNum] = month.split("-").map(Number);
  const daysInMonth = new Date(year, monthNum, 0).getDate();
  const slots = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, monthNum - 1, day);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    const dateStr = `${year}-${String(monthNum).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const times = serviceType === "studio" ? ["10:00"] : ["10:00", "14:00", "16:00"];

    for (const startTime of times) {
      const duration = SERVICE_DURATIONS[serviceType] ?? 1;
      const [h, m] = startTime.split(":").map(Number);
      const endHour = h + duration;
      const endTime = `${String(endHour).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

      slots.push({ date: dateStr, startTime, endTime, available: true });
    }
  }

  return slots;
}

router.get("/availability", async (req, res) => {
  try {
    const serviceType = req.query["serviceType"] as string;
    const month = req.query["month"] as string;

    if (!serviceType || !month) {
      return res.status(400).json({ error: "serviceType and month are required" });
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

    res.json({ slots, serviceType, month });
  } catch (err) {
    console.error("Error fetching availability:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const createBookingSchema = z.object({
  serviceType: z.enum(["lesson", "coaching", "studio"]),
  date: z.string(),
  startTime: z.string(),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  notes: z.string().nullable().optional(),
  durationHours: z.number().int().positive().optional(),
});

router.post("/", async (req, res) => {
  try {
    const parsed = createBookingSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });

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

    res.status(201).json({
      ...booking,
      priceEur: Number(booking.priceEur),
      notes: booking.notes ?? null,
      createdAt: booking.createdAt.toISOString(),
    });
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const bookings = await db.select().from(bookingsTable).orderBy(bookingsTable.date);
    res.json({
      bookings: bookings.map((b) => ({
        ...b,
        priceEur: Number(b.priceEur),
        notes: b.notes ?? null,
        createdAt: b.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error("Error listing bookings:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
