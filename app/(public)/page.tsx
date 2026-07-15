import { db, artistInfoTable, albumsTable, testimonialsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { HomeClient } from "./home-client";

// §1: Home is Split — testimonials carousel + hero video are client state, so the
// server page fetches via Drizzle (mirrors /api/artist-info, /api/albums?featured,
// /api/testimonials) and passes data to home-client.tsx.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [[artistInfo], albums, testimonials] = await Promise.all([
    db.select().from(artistInfoTable).limit(1),
    db
      .select()
      .from(albumsTable)
      .where(eq(albumsTable.featured, true))
      .orderBy(desc(albumsTable.id))
      .limit(4),
    db.select().from(testimonialsTable).orderBy(desc(testimonialsTable.featured)),
  ]);

  return (
    <HomeClient
      artistInfo={artistInfo ?? null}
      albums={albums}
      testimonials={testimonials}
    />
  );
}
