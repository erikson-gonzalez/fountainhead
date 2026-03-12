import { Router, type IRouter } from "express";
import { db, quotesTable } from "@workspace/db";
import { z } from "zod";

const router: IRouter = Router();

const BASE_PRICES: Record<string, number> = {
  mixing: 200,
  mastering: 30,
  "stem-mastering": 100,
  "mixing-mastering": 300,
  production: 300,
  "string-arrangement": 200,
  cowriting: 300,
  "guitar-solo": 300,
};

function calculatePrice(serviceType: string, songCount: number): { basePrice: number; totalPrice: number; breakdown: Array<{ label: string; amount: number }> } {
  const basePrice = BASE_PRICES[serviceType] ?? 150;
  let totalPrice = basePrice * songCount;
  const breakdown: Array<{ label: string; amount: number }> = [
    { label: `${serviceType} × ${songCount} song${songCount > 1 ? "s" : ""}`, amount: basePrice * songCount },
  ];

  if (songCount >= 5) {
    const discount = Math.round(totalPrice * 0.1);
    totalPrice -= discount;
    breakdown.push({ label: "Multi-song discount (10%)", amount: -discount });
  } else if (songCount >= 3) {
    const discount = Math.round(totalPrice * 0.05);
    totalPrice -= discount;
    breakdown.push({ label: "Multi-song discount (5%)", amount: -discount });
  }

  return { basePrice, totalPrice, breakdown };
}

const estimateSchema = z.object({
  serviceType: z.string(),
  songCount: z.number().int().positive().default(1),
  additionalServices: z.array(z.string()).nullable().optional(),
});

router.post("/estimate", async (req, res) => {
  try {
    const parsed = estimateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });

    const { serviceType, songCount } = parsed.data;
    const estimate = calculatePrice(serviceType, songCount);

    res.json({ serviceType, songCount, ...estimate });
  } catch (err) {
    console.error("Error estimating quote:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const createQuoteSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  serviceType: z.string(),
  songCount: z.number().int().positive().default(1),
  projectDescription: z.string().min(1),
  genre: z.string().nullable().optional(),
  budget: z.number().nullable().optional(),
  referenceLinks: z.string().nullable().optional(),
  additionalServices: z.array(z.string()).nullable().optional(),
});

router.post("/", async (req, res) => {
  try {
    const parsed = createQuoteSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });

    const { customerName, customerEmail, serviceType, songCount, projectDescription, genre, budget, referenceLinks } = parsed.data;
    const { totalPrice } = calculatePrice(serviceType, songCount);

    const [quote] = await db
      .insert(quotesTable)
      .values({
        customerName,
        customerEmail,
        serviceType,
        songCount,
        projectDescription,
        genre: genre ?? null,
        budget: budget != null ? budget.toFixed(2) : null,
        referenceLinks: referenceLinks ?? null,
        estimatedPrice: totalPrice.toFixed(2),
        status: "pending",
      })
      .returning();

    res.status(201).json({
      ...quote,
      budget: quote.budget != null ? Number(quote.budget) : null,
      estimatedPrice: Number(quote.estimatedPrice),
      createdAt: quote.createdAt.toISOString(),
      genre: quote.genre ?? null,
      referenceLinks: quote.referenceLinks ?? null,
    });
  } catch (err) {
    console.error("Error creating quote:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
