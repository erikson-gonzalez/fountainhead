import { db, quoteConfigTable } from "@workspace/db";

// Quote pricing logic ported verbatim from the Express quotes route. Shared by
// the /api/quotes/estimate and /api/quotes handlers (quote-config whitelist).

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

export async function getQuoteConfig() {
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

export async function calculatePrice(
  serviceType: string,
  songCount: number,
  songsOver6Min: number,
): Promise<{ basePrice: number; totalPrice: number; breakdown: Array<{ label: string; amount: number }> }> {
  const config = await getQuoteConfig();
  const basePrice = config.basePrices[serviceType] ?? 150;

  const baseSubtotal = basePrice * songCount;
  const breakdown: Array<{ label: string; amount: number }> = [
    { label: `${serviceType.replace("-", " ")} × ${songCount} song${songCount > 1 ? "s" : ""}`, amount: baseSubtotal },
  ];

  let subtotal = baseSubtotal;

  const longCount = Math.min(Math.max(0, songsOver6Min), songCount);
  if (longCount > 0) {
    const surcharge = Math.round(longCount * basePrice * (config.longSongSurchargePercent / 100));
    subtotal += surcharge;
    breakdown.push({
      label: `Long song surcharge (${longCount} song${longCount > 1 ? "s" : ""} > 6 min, +${config.longSongSurchargePercent}%)`,
      amount: surcharge,
    });
  }

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
