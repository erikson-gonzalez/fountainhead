import { NextResponse, type NextRequest } from "next/server";
import { db, quotesTable } from "@workspace/db";
import { z } from "zod";
import { calculatePrice } from "@/lib/quote-pricing";

// POST /api/quotes — public. Same payload shape as Express.
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createQuoteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }

    const { customerName, customerEmail, serviceType, songCount, projectDescription, genre, budget, referenceLinks } = parsed.data;
    const { totalPrice } = await calculatePrice(serviceType, songCount, 0);

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

    return NextResponse.json(
      {
        ...quote,
        budget: quote.budget != null ? Number(quote.budget) : null,
        estimatedPrice: Number(quote.estimatedPrice),
        createdAt: quote.createdAt.toISOString(),
        genre: quote.genre ?? null,
        referenceLinks: quote.referenceLinks ?? null,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Error creating quote:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
