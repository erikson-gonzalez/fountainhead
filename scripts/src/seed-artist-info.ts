import { db, artistInfoTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const FULL_BIO = `Renowned worldwide for his pioneering work on the fretless guitar, Tom Geldschläger (aka Fountainhead) is a multi-instrumentalist, producer, and mixing engineer operating out of his studio in Berlin, Germany.

He has contributed to critically acclaimed records by artists such as Obscura, Defeated Sanity, Ray Riendeau, and many others, bridging the gap between extreme metal, jazz fusion, and cinematic soundscapes.

As an educator, Tom has conducted masterclasses across the globe and built a dedicated community of students exploring advanced guitar techniques and creative production.`;

const DEFAULT_ARTIST_INFO = {
  tagline: "Berlin-based guitarist, producer & mixing engineer",
  bio: FULL_BIO,
  heroTagline: "Berlin-based virtuoso guitarist, producer, and mixing engineer. Pushing boundaries in modern metal.",
  heroTitlePrefix: "Mastering the",
  heroTitleHighlight: "Fretless",
  heroTitleSuffix: "Dimension",
  testimonialsSectionTitle: "Industry Voices",
  testimonialsSectionSubtitle: "What top artists and students say about working with Fountainhead.",
  aboutHeading: "TOM GELDSCHLÄGER",
  aboutSubheading: "Fountainhead",
  endorsements: "Aristides Guitars, Steinberg, Engl Amplification, Neural DSP, Bare Knuckle Pickups, Elixir Strings, MONO",
  musicLinks: "",
  contactEmail: "thefountainhead@gmx.net",
  contactPhone: "03066300766",
  contactAddress: "Scheiblerstrasse 4, 12437 Berlin",
};

async function seedArtistInfo() {
  console.log("🎸 Seeding/updating artist info...");

  const [existing] = await db.select().from(artistInfoTable).limit(1);

  const existingAny = existing as Record<string, unknown>;
  const needsHeroTitle =
    !existingAny?.heroTitlePrefix?.toString().trim() ||
    !existingAny?.heroTitleHighlight?.toString().trim() ||
    !existingAny?.heroTitleSuffix?.toString().trim();

  if (!existing) {
    await db.insert(artistInfoTable).values(DEFAULT_ARTIST_INFO);
    console.log("✅ Artist info created.");
  } else if (!existing.bio || existing.bio.length < 100) {
    await db
      .update(artistInfoTable)
      .set({
        ...DEFAULT_ARTIST_INFO,
        updatedAt: new Date(),
      })
      .where(eq(artistInfoTable.id, existing.id));
    console.log("✅ Artist info updated (bio was empty).");
  } else if (needsHeroTitle) {
    await db
      .update(artistInfoTable)
      .set({
        heroTitlePrefix: DEFAULT_ARTIST_INFO.heroTitlePrefix,
        heroTitleHighlight: DEFAULT_ARTIST_INFO.heroTitleHighlight,
        heroTitleSuffix: DEFAULT_ARTIST_INFO.heroTitleSuffix,
        updatedAt: new Date(),
      })
      .where(eq(artistInfoTable.id, existing.id));
    console.log("✅ Artist info updated (hero title fields were empty).");
  } else {
    console.log("✅ Artist info already has content. No changes.");
  }

  process.exit(0);
}

seedArtistInfo().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
