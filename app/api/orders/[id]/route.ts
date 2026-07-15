import { NextResponse } from "next/server";
import { db, ordersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

// GET /api/orders/[id] — public.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    return NextResponse.json({
      ...order,
      totalEur: Number(order.totalEur),
      createdAt: order.createdAt.toISOString(),
      notes: order.notes ?? null,
    });
  } catch (err) {
    console.error("Error fetching order:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
