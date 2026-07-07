import { Router, type IRouter } from "express";
import { db, ordersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router: IRouter = Router();

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

router.post("/", async (req, res) => {
  try {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });

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

    return res.status(201).json({
      ...order,
      totalEur: Number(order.totalEur),
      createdAt: order.createdAt.toISOString(),
      notes: order.notes ?? null,
    });
  } catch (err) {
    console.error("Error creating order:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params["id"]);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
    if (!order) return res.status(404).json({ error: "Order not found" });

    return res.json({
      ...order,
      totalEur: Number(order.totalEur),
      createdAt: order.createdAt.toISOString(),
      notes: order.notes ?? null,
    });
  } catch (err) {
    console.error("Error fetching order:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
