import { NextResponse, type NextRequest } from "next/server";
import { db, quoteConfigTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

// GET/PUT /api/admin/quote-config — admin (middleware-gated). Whitelist verbatim.
const QUOTE_CONFIG_KEYS = [
  "base_price_mixing",
  "base_price_mastering",
  "base_price_mixing-mastering",
  "base_price_production",
  "base_price_guitar-solo",
  "base_price_stem-mastering",
  "base_price_string-arrangement",
  "base_price_cowriting",
  "album_discount_percent",
  "album_min_songs",
  "long_song_surcharge_percent",
] as const;

export async function GET() {
  try {
    const rows = await db.select().from(quoteConfigTable);
    const config: Record<string, string> = {};
    for (const r of rows) config[r.key] = r.value;
    return NextResponse.json({ config });
  } catch (err) {
    console.error("Error fetching quote config:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const quoteConfigUpdateSchema = z.record(z.string(), z.union([z.string(), z.number()]));

export async function PUT(request: NextRequest) {
  try {
    const parsed = quoteConfigUpdateSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });

    for (const [key, val] of Object.entries(parsed.data)) {
      if (!QUOTE_CONFIG_KEYS.includes(key as (typeof QUOTE_CONFIG_KEYS)[number])) continue;
      const value = String(val);
      const [existing] = await db.select().from(quoteConfigTable).where(eq(quoteConfigTable.key, key)).limit(1);
      if (existing) {
        await db.update(quoteConfigTable).set({ value, updatedAt: new Date() }).where(eq(quoteConfigTable.key, key));
      } else {
        await db.insert(quoteConfigTable).values({ key, value });
      }
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error updating quote config:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
