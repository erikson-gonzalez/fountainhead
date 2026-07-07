import { Router, type IRouter } from "express";
import { db, quotesTable, quoteConfigTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router: IRouter = Router();

const DEFAULT_BASE_PRICES: Record<string, number> = {
  mixing: 200,
  mastering: 30,
  "stem-mastering": 100,
  "mixing-mastering": 300,
  production: 300,
  "string-arrangement": 200,
  cowriting: 300,
  "guitar-solo": 300,
};

const DEFAULT_ALBUM_DISCOUNT_PERCENT = 10;
const DEFAULT_ALBUM_MIN_SONGS = 8;
const DEFAULT_LONG_SONG_SURCHARGE_PERCENT = 10;

async function getQuoteConfig() {
  const rows = await db.select().from(quoteConfigTable);
  const config: Record<string, string> = {};
  for (const r of rows) config[r.key] = r.value;

  const basePrices: Record<string, number> = { ...DEFAULT_BASE_PRICES };
  for (const [k, v] of Object.entries(config)) {
    if (k.startsWith("base_price_")) {
      const service = k.replace("base_price_", "");
      const num = parseFloat(v);
      if (!Number.isNaN(num)) basePrices[service] = num;
    }
  }

  return {
    basePrices,
    albumDiscountPercent: parseFloat(config.album_discount_percent ?? "") || DEFAULT_ALBUM_DISCOUNT_PERCENT,
    albumMinSongs: parseInt(config.album_min_songs ?? "", 10) || DEFAULT_ALBUM_MIN_SONGS,
    longSongSurchargePercent: parseFloat(config.long_song_surcharge_percent ?? "") || DEFAULT_LONG_SONG_SURCHARGE_PERCENT,
  };
}

async function calculatePrice(
  serviceType: string,
  songCount: number,
  songsOver6Min: number
): Promise<{ basePrice: number; totalPrice: number; breakdown: Array<{ label: string; amount: number }> }> {
  const config = await getQuoteConfig();
  const basePrice = config.basePrices[serviceType] ?? 150;

  const baseSubtotal = basePrice * songCount;
  const breakdown: Array<{ label: string; amount: number }> = [
    { label: `${serviceType.replace("-", " ")} × ${songCount} song${songCount > 1 ? "s" : ""}`, amount: baseSubtotal },
  ];

  let subtotal = baseSubtotal;

  // Long song surcharge (+10% per song over 6 min)
  const longCount = Math.min(Math.max(0, songsOver6Min), songCount);
  if (longCount > 0) {
    const surcharge = Math.round(longCount * basePrice * (config.longSongSurchargePercent / 100));
    subtotal += surcharge;
    breakdown.push({
      label: `Long song surcharge (${longCount} song${longCount > 1 ? "s" : ""} > 6 min, +${config.longSongSurchargePercent}%)`,
      amount: surcharge,
    });
  }

  // Album discount (8+ songs, 10%)
  if (songCount >= config.albumMinSongs) {
    const discount = Math.round(subtotal * (config.albumDiscountPercent / 100));
    subtotal -= discount;
    breakdown.push({
      label: `Album discount (${config.albumMinSongs}+ songs, ${config.albumDiscountPercent}%)`,
      amount: -discount,
    });
  }

  return { basePrice, totalPrice: subtotal, breakdown };
}

const estimateSchema = z.object({
  serviceType: z.string(),
  songCount: z.number().int().positive().default(1),
  songsOver6Min: z.number().int().min(0).nullable().optional(),
  additionalServices: z.array(z.string()).nullable().optional(),
});

router.post("/estimate", async (req, res) => {
  try {
    const parsed = estimateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });

    const { serviceType, songCount, songsOver6Min } = parsed.data;
    const estimate = await calculatePrice(serviceType, songCount, songsOver6Min ?? 0);

    return res.json({ serviceType, songCount, ...estimate });
  } catch (err) {
    console.error("Error estimating quote:", err);
    return res.status(500).json({ error: "Internal server error" });
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

    return res.status(201).json({
      ...quote,
      budget: quote.budget != null ? Number(quote.budget) : null,
      estimatedPrice: Number(quote.estimatedPrice),
      createdAt: quote.createdAt.toISOString(),
      genre: quote.genre ?? null,
      referenceLinks: quote.referenceLinks ?? null,
    });
  } catch (err) {
    console.error("Error creating quote:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
