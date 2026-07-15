import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { calculatePrice } from "@/lib/quote-pricing";

// POST /api/quotes/estimate — public.
const estimateSchema = z.object({
  serviceType: z.string(),
  songCount: z.number().int().positive().default(1),
  songsOver6Min: z.number().int().min(0).nullable().optional(),
  additionalServices: z.array(z.string()).nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = estimateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }

    const { serviceType, songCount, songsOver6Min } = parsed.data;
    const estimate = await calculatePrice(serviceType, songCount, songsOver6Min ?? 0);

    return NextResponse.json({ serviceType, songCount, ...estimate });
  } catch (err) {
    console.error("Error estimating quote:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
