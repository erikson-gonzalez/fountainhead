import { db, bookOfferingsTable } from "@workspace/db";

const OFFERINGS = [
  {
    name: "Guitar Lesson",
    description: "1-on-1 guitar lesson via Zoom/Skype or in-person in Berlin. Topics: technique, theory, songwriting, composition, performance psychology.",
    priceEur: "45.00",
    unit: "per hour",
    tag: "Education",
    icon: "BookOpen",
    imageUrl: null,
    linkType: "booking",
    sortOrder: "0",
  },
  {
    name: "Creative Coaching",
    description: "A focused creative coaching session to unlock your musical potential. Song development, artistic direction, overcoming creative blocks.",
    priceEur: "50.00",
    unit: "per session",
    tag: "Coaching",
    icon: "Lightbulb",
    imageUrl: null,
    linkType: "booking",
    sortOrder: "1",
  },
  {
    name: "Studio Recording Session (Berlin)",
    description: "Full 8-hour recording session in Tom's Berlin studio. Professional gear, expert production, dry/wet/DI tracks delivered.",
    priceEur: "200.00",
    unit: "per 8-hour session",
    tag: "Studio",
    icon: "Mic2",
    imageUrl: null,
    linkType: "booking",
    sortOrder: "2",
  },
  {
    name: "String Arrangements",
    description: "Professional orchestral and string arrangements for your recordings. Score + MIDI + audio mockup delivered.",
    priceEur: "200.00",
    unit: "per song",
    tag: "Arrangements",
    icon: "Music4",
    imageUrl: null,
    linkType: "quote",
    sortOrder: "3",
  },
];

async function seed() {
  console.log("🌱 Seeding book offerings...");
  const existing = await db.select().from(bookOfferingsTable);
  if (existing.length > 0) {
    console.log("⚠️ Book offerings already exist. Skipping. Delete rows first to re-seed.");
    return;
  }
  await db.insert(bookOfferingsTable).values(OFFERINGS);
  console.log(`✅ Seeded ${OFFERINGS.length} book offerings`);
}

seed().catch(console.error).finally(() => process.exit(0));
