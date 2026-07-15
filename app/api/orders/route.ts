import { NextResponse, type NextRequest } from "next/server";
import { db, ordersTable } from "@workspace/db";
import { z } from "zod";

// POST /api/orders — public. §4: mock checkout ported as-is (client-supplied
// prices, status always "pending"). Same payload shape as Express.
const orderItemSchema = z.object({
  productId: z.number().nullable().optional(),
  serviceId: z.number().nullable().optional(),
  bookingId: z.number().nullable().optional(),
  name: z.string().min(1),
  quantity: z.number().int().positive(),
  priceEur: z.number().positive(),
});

const createOrderSchema = z.object({
  customerEmail: z.string().email(),
  customerName: z.string().min(1),
  items: z.array(orderItemSchema).min(1),
  notes: z.string().nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }

    const { customerEmail, customerName, items, notes } = parsed.data;
    const totalEur = items.reduce((sum, item) => sum + item.priceEur * item.quantity, 0);

    const [order] = await db
      .insert(ordersTable)
      .values({
        customerEmail,
        customerName,
        items: items as unknown as Record<string, unknown>[],
        totalEur: totalEur.toFixed(2),
        status: "pending",
        notes: notes ?? null,
      })
      .returning();

    return NextResponse.json(
      {
        ...order,
        totalEur: Number(order.totalEur),
        createdAt: order.createdAt.toISOString(),
        notes: order.notes ?? null,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Error creating order:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
