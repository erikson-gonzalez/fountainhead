import { db, albumsTable, newsTable, productsTable, testimonialsTable, servicesTable, portalLessonsTable, portalResourcesTable } from "@workspace/db";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear all tables
  await db.execute(sql`TRUNCATE albums, news, products, testimonials, services, portal_lessons, portal_resources RESTART IDENTITY CASCADE`);

  // --- ALBUMS ---
  await db.insert(albumsTable).values([
    { artist: "Changeling", title: "Changeling", releaseDate: "2025-04-25", role: "Writer, Arranger, Performer, Producer, Mixing", genre: "Prog/Technical Death Metal", featured: true },
    { artist: "Pyre", title: "Burning // Blazing", releaseDate: "2025-04-04", role: "Producer, Mixing/Mastering", genre: "Hardcore/Metalcore", featured: false },
    { artist: "Leviathan", title: "Shrine Of Sacrifice (Single)", releaseDate: "2025-01-09", role: "Mixing/Mastering, Guest Soloist", genre: "Technical Death Metal", featured: false },
    { artist: "Thunder And Lightning", title: "Of Wrath And Ruin", releaseDate: "2024-11-15", role: "Lead Guitar & Solos", genre: "Heavy Metal", featured: true },
    { artist: "Amuse To Death", title: "Phantasmagoria", releaseDate: "2024-11-08", role: "Production, Mix/Master, fretted & fretless guitar", genre: "Swing-Metal", featured: false },
    { artist: "Merely Minds", title: "EP", releaseDate: "2024-10-10", role: "Production, Mixing/Mastering", genre: "Pop/Rock", featured: false },
    { artist: "Ingurgitating Oblivion", title: "Ontology Of Nought", releaseDate: "2024-09-27", role: "Fretted & Fretless Guitar Solos", genre: "Progressive Death Metal", featured: true },
    { artist: "Sayas", title: "There Where Light Remains (Single)", releaseDate: "2024-05-20", role: "Mixing/Mastering", genre: "Death Metal", featured: false },
    { artist: "Hannes Grossmann", title: "Echoes Of Eternity", releaseDate: "2024-02-09", role: "Guest guitar solo", genre: "Progressive Metal", featured: false },
    { artist: "The Ritual Aura", title: "Heresiarch", releaseDate: "2023-11-10", role: "Fretted & fretless guest solos", genre: "Death Metal", featured: false },
    { artist: "Fountainhead", title: "Changeling", releaseDate: "2024-01-01", role: "Writer, Arranger, Performer, Producer, Mixing, Mastering", genre: "Experimental/Progressive Metal", featured: true, description: "The most ambitious Fountainhead album yet, featuring over 50 guest musicians." },
    { artist: "Obscura", title: "Akroasis", releaseDate: "2016-02-05", role: "Lead Guitar (incl. 15-min epic 'Weltseele')", genre: "Technical Death Metal", featured: true },
    { artist: "Defeated Sanity", title: "Passages Into Deformity", releaseDate: "2013-01-01", role: "Guitars, Production", genre: "Brutal Death Metal", featured: false },
    { artist: "Belphegor", title: "Conjuring The Dead", releaseDate: "2014-08-08", role: "Live Guitar", genre: "Black/Death Metal", featured: false },
    { artist: "Fountainhead", title: "Fear Is The Enemy", releaseDate: "2013-01-01", role: "Writer, Performer, Producer", genre: "Progressive Metal", featured: false, description: "Fountainhead debut album — the beginning of a unique sonic journey." },
  ]);
  console.log("✅ Albums seeded");

  // --- TESTIMONIALS ---
  await db.insert(testimonialsTable).values([
    { name: "Christian Münzner", role: "Obscura", quote: "The Steve Vai of the new millennium", type: "artist", featured: true },
    { name: "Karl Sanders", role: "Nile", quote: "WOW! That's some beautiful guitar playing", type: "artist", featured: true },
    { name: "Andy La Rocque", role: "King Diamond / Death", quote: "Absolutely stunning guitar work — one of a kind", type: "artist", featured: true },
    { name: "Mike Abdow", role: "Fates Warning", quote: "...most deserving of the title innovator", type: "artist", featured: true },
    { name: "Ray Riendeau", role: "Halford", quote: "He's unique in a world of cliche guitarists", type: "artist", featured: true },
    { name: "Richard Hallebeek", role: "Guitar Virtuoso", quote: "I LOVE Fountainhead", type: "artist", featured: false },
    { name: "Bill Bruce", role: "Shotgun Messiah", quote: "There is no one on this planet that can even attempt what he does!", type: "artist", featured: false },
    { name: "Laurie Monk", role: "truthinshredding.com", quote: "Stunning, yes stunning music and guitar", type: "artist", featured: false },
    { name: "Christopher Johnson", role: "Student", quote: "Tom's teaching completely transformed my approach to guitar. The way he combines technique with musicality is unmatched.", type: "student", featured: true },
    { name: "Sebastian Müller", role: "Student", quote: "Best investment I've made as a musician. Tom brings passion, knowledge and patience to every lesson.", type: "student", featured: true },
    { name: "Daniel Bacskocky", role: "Student", quote: "His approach to fretless guitar opened a world I didn't know existed. Incredible teacher.", type: "student", featured: false },
    { name: "Christopher Soriano", role: "Student", quote: "After two months of lessons with Tom, my playing improved more than in the previous two years.", type: "student", featured: false },
    { name: "Guido Nerger", role: "The Astronauts Return", quote: "The mix Tom delivered for our album was beyond what we imagined. Professional, detailed and with a genuine understanding of our music.", type: "student", featured: true },
    { name: "Ben Kettner", role: "Requital / Liquid Fire", quote: "Tom's production work is impeccable. He understands metal production at a deep level.", type: "student", featured: false },
  ]);
  console.log("✅ Testimonials seeded");

  // --- NEWS ---
  await db.insert(newsTable).values([
    {
      slug: "project-intrada-cottbus-2023",
      title: "Project Intrada in Cottbus",
      content: "Tom performed with Project Intrada in Cottbus — an incredible evening of genre-defying music that pushed the boundaries of what live performance can be. The show was met with standing ovations and left the audience speechless.",
      excerpt: "An incredible evening of genre-defying music in Cottbus.",
      publishedAt: new Date("2023-11-01"),
    },
    {
      slug: "website-update-2024",
      title: "Finally, a website update",
      content: "After years of requests, we've completely overhauled the Fountainhead web presence. New booking system, shop, student portal, and everything in between. Welcome to the new fountainhead.de!",
      excerpt: "The Fountainhead website has been completely rebuilt from the ground up.",
      publishedAt: new Date("2024-03-01"),
    },
    {
      slug: "new-album-recordings-final-phase",
      title: "New Fountainhead album recordings: final phase",
      content: "After months of intensive recording sessions featuring over 50 guest musicians from around the world, the new Fountainhead album has entered its final mixing and mastering phase. Expect the unexpected — this album pushes every boundary.",
      excerpt: "The new Fountainhead album enters its final phase with 50+ guest musicians.",
      publishedAt: new Date("2024-08-15"),
    },
    {
      slug: "new-vianova-album-done",
      title: "New Vianova album DONE",
      content: "Proud to announce that the Vianova album production is complete! Tom handled full production, mixing and mastering duties on this one — the result is something truly special.",
      excerpt: "Tom completes production on the new Vianova album.",
      publishedAt: new Date("2024-06-10"),
    },
    {
      slug: "thunder-lightning-fear-released",
      title: "Thunder & Lightning 'F.E.A.R.' released!",
      content: "The new Thunder & Lightning track F.E.A.R. is out now on all platforms. Tom played lead guitar and solos throughout — a massive riff machine with a ton of attitude.",
      excerpt: "Thunder & Lightning drop 'F.E.A.R.' featuring Tom on lead guitar.",
      publishedAt: new Date("2024-04-20"),
    },
    {
      slug: "brass-signature-picks-available",
      title: "Brass version of Tom's signature guitar picks now available!",
      content: "After massive demand following the nylon version, the Fountainhead signature brass guitar picks by Winspear Instrumental are now available in the shop. These are the exact picks used by Tom live and in the studio — also favored by players from Falling In Reverse and Nile.",
      excerpt: "Fountainhead signature brass picks now available in the shop.",
      publishedAt: new Date("2024-05-01"),
    },
    {
      slug: "india-masterclass-tour-2023",
      title: "India Masterclass Tour — 9 cities!",
      content: "Tom just wrapped an incredible masterclass tour across 9 cities in India — connecting with musicians, sharing techniques for fretless guitar, production and composing. The response was overwhelming and plans for a return visit are already in motion.",
      excerpt: "Tom completes an epic 9-city masterclass tour across India.",
      publishedAt: new Date("2023-06-20"),
    },
    {
      slug: "orchestral-arrangements-service",
      title: "New service: orchestral arrangements",
      content: "Tom now offers professional orchestral and string arrangements for your recordings. If you want to add real orchestral depth and sophistication to your project, this is the service for you. Get in touch or use the quote builder on the website.",
      excerpt: "String & orchestral arrangements now available as a service.",
      publishedAt: new Date("2023-09-15"),
    },
    {
      slug: "bareknuckle-pickups-endorsement",
      title: "New endorsement with Bareknuckle Pickups",
      content: "Thrilled to announce an endorsement deal with Bareknuckle Pickups — makers of some of the finest handwound guitar pickups in the world. Tom's signature Aristides guitars are now loaded with custom Bareknuckle sets.",
      excerpt: "Tom joins the Bareknuckle Pickups artist roster.",
      publishedAt: new Date("2023-12-01"),
    },
    {
      slug: "ingurgitating-oblivion-contribution",
      title: "Tom to contribute to Ingurgitating Oblivion's upcoming album",
      content: "Exciting news: Tom has been invited to contribute fretted and fretless guitar solos to the upcoming Ingurgitating Oblivion album. A match made in progressive death metal heaven.",
      excerpt: "Tom joins Ingurgitating Oblivion for fretless guest solos.",
      publishedAt: new Date("2024-01-10"),
    },
  ]);
  console.log("✅ News seeded");

  // --- PRODUCTS ---
  await db.insert(productsTable).values([
    {
      name: "Fountainhead Signature Pick — Nylon (Pack of 6)",
      description: "The original Fountainhead signature pick by Winspear Instrumental. Ultra-precise attack, warm articulation. Used by Tom live and in the studio. As featured in Falling In Reverse and Nile.",
      priceEur: "18.00",
      category: "picks",
      featured: true,
      digital: false,
      stock: 50,
    },
    {
      name: "Fountainhead Signature Pick — Brass (Pack of 3)",
      description: "The premium brass edition of Tom's signature pick. Heavier feel, percussive attack, extraordinary sustain. Limited run — collector's item.",
      priceEur: "28.00",
      category: "picks",
      featured: true,
      digital: false,
      stock: 30,
    },
    {
      name: "Fountainhead T-Shirt — Flame Logo (Black)",
      description: "Premium heavyweight cotton t-shirt with the iconic Fountainhead flame logo screen-printed in crimson red on black. Available in S, M, L, XL, XXL.",
      priceEur: "25.00",
      category: "merch",
      featured: true,
      digital: false,
      stock: 100,
    },
    {
      name: "Fountainhead Hoodie — Flame Logo",
      description: "Heavy-duty pullover hoodie with embroidered flame logo. Dark charcoal grey, unisex fit. Perfect for those cold Berlin rehearsals.",
      priceEur: "55.00",
      category: "merch",
      featured: false,
      digital: false,
      stock: 40,
    },
    {
      name: "Fretless Guitar Masterclass — Complete Course",
      description: "Tom's definitive guide to fretless guitar. 8+ hours of video lessons covering technique, intonation, vibrato, style, and original compositions. Stream in your student portal.",
      priceEur: "149.00",
      category: "courses",
      featured: true,
      digital: true,
      stock: null,
    },
    {
      name: "Advanced Metal Guitar Techniques — Online Course",
      description: "Deep dive into advanced metal guitar: sweep picking, tapping, hybrid picking, exotic scales, and composing for technical metal. 6 hours of content.",
      priceEur: "99.00",
      category: "courses",
      featured: true,
      digital: true,
      stock: null,
    },
    {
      name: "Guitar Composition & Songwriting — Course",
      description: "Learn Tom's approach to writing compelling guitar-driven compositions. From riff construction to full arrangement — the complete creative process.",
      priceEur: "79.00",
      category: "courses",
      featured: false,
      digital: true,
      stock: null,
    },
    {
      name: "Death Metal Production Blueprint — Sample Pack",
      description: "Professional drum samples, DI guitar tones, bass samples and FX chains used in Tom's productions. DAW-agnostic. 4GB of high-quality audio.",
      priceEur: "49.00",
      category: "sample-packs",
      featured: true,
      digital: true,
      stock: null,
    },
    {
      name: "Fretless Guitar Tones — Sample Pack",
      description: "Authentic fretless guitar phrases, loops and one-shots in various styles — from ambient to death metal. Unique sounds you won't find anywhere else.",
      priceEur: "35.00",
      category: "sample-packs",
      featured: true,
      digital: true,
      stock: null,
    },
    {
      name: "Progressive Metal Drum MIDI Pack",
      description: "MIDI drum patterns and grooves covering progressive, technical, and experimental metal styles. 200+ patterns, all humanized.",
      priceEur: "29.00",
      category: "sample-packs",
      featured: false,
      digital: true,
      stock: null,
    },
  ]);
  console.log("✅ Products seeded");

  // --- SERVICES ---
  await db.insert(servicesTable).values([
    { name: "Guitar Lesson (1 hour)", description: "1-on-1 guitar lesson via Zoom/Skype or in-person in Berlin. Topics: technique, theory, songwriting, composition, performance psychology.", priceEur: "45.00", category: "lesson", durationHours: "1", unit: "per hour" },
    { name: "Creative Coaching (1 session)", description: "A focused creative coaching session to unlock your musical potential. Song development, artistic direction, overcoming creative blocks.", priceEur: "50.00", category: "coaching", durationHours: "1", unit: "per session" },
    { name: "Studio Recording Session (Berlin)", description: "Full 8-hour recording session in Tom's Berlin studio. Professional gear, expert production, dry/wet/DI tracks delivered.", priceEur: "200.00", category: "studio", durationHours: "8", unit: "per 8-hour session" },
    { name: "Mixing & Mastering (1 song)", description: "Complete mix and master of one track. Full revision cycle, stems returned, streaming and CD-ready masters.", priceEur: "300.00", category: "mixing", durationHours: null, unit: "per song" },
    { name: "Mastering Only (1 song)", description: "Mastering of a finished mix. Loudness optimization, format delivery, reference playback.", priceEur: "30.00", category: "mastering", durationHours: null, unit: "per song" },
    { name: "Stem Mastering (1 song)", description: "Stem-by-stem mastering for maximum mix-to-master translation. Ideal for complex arrangements.", priceEur: "100.00", category: "mastering", durationHours: null, unit: "per song" },
    { name: "Guitar Solo (Session Recording)", description: "Professional guest guitar solo recorded in Berlin. Fretted or fretless. Delivered with dry, wet, and DI tracks + video of the final take.", priceEur: "300.00", category: "guitar-solo", durationHours: null, unit: "per solo" },
    { name: "Co-writing / Composition (1 song)", description: "Full co-writing service. Tom joins as a creative partner on your track — from initial ideas to final arrangement.", priceEur: "300.00", category: "production", durationHours: null, unit: "per song" },
    { name: "String Arrangements (1 song)", description: "Professional orchestral and string arrangements for your recordings. Score + MIDI + audio mockup delivered.", priceEur: "200.00", category: "arrangement", durationHours: null, unit: "per song" },
    { name: "Full Production (1 song)", description: "Complete music production from scratch: arrangement, recording, mixing and mastering. Tom handles it all.", priceEur: "500.00", category: "production", durationHours: null, unit: "per song" },
  ]);
  console.log("✅ Services seeded");

  // --- PORTAL LESSONS ---
  await db.insert(portalLessonsTable).values([
    {
      title: "Fretless Guitar — The Foundation",
      description: "Introduction to fretless guitar: intonation, vibrato, shifting positions. Why this instrument will change how you hear music.",
      duration: 45,
      topic: "Fretless Guitar",
      level: "beginner",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      publishedAt: new Date("2024-01-15"),
    },
    {
      title: "Sweep Picking Mastery — Clean Arpeggios at Speed",
      description: "Tom's complete method for developing clean, musical sweep picking. From 3-string shapes to 7-string monsters.",
      duration: 60,
      topic: "Technique",
      level: "advanced",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      publishedAt: new Date("2024-02-01"),
    },
    {
      title: "Exotic Scales for Metal Guitar",
      description: "Beyond pentatonics — harmonic minor, melodic minor, phrygian dominant, diminished and Hungarian minor in a metal context.",
      duration: 50,
      topic: "Theory & Scales",
      level: "intermediate",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      publishedAt: new Date("2024-03-10"),
    },
    {
      title: "Composing Technical Death Metal Riffs",
      description: "Tom breaks down the compositional process behind his most complex riffs. Odd meters, polyrhythm, and motivic development.",
      duration: 75,
      topic: "Composition",
      level: "advanced",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      publishedAt: new Date("2024-04-05"),
    },
    {
      title: "Guitar Psychology — Performing Under Pressure",
      description: "The mental side of performing. How to stay calm, focused and musical when it matters most. Stage fright and beyond.",
      duration: 40,
      topic: "Performance Psychology",
      level: "intermediate",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      publishedAt: new Date("2024-05-20"),
    },
    {
      title: "Home Recording — Getting a Pro Guitar Sound",
      description: "From interface setup to amp simulation to mic placement. Everything you need to record guitar at home with professional results.",
      duration: 55,
      topic: "Recording",
      level: "beginner",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      publishedAt: new Date("2024-06-15"),
    },
  ]);
  console.log("✅ Portal lessons seeded");

  // --- PORTAL RESOURCES (tabs only are downloadable) ---
  await db.insert(portalResourcesTable).values([
    {
      title: "Fretless Guitar Technique — Tab Sheet #1",
      description: "Detailed tab and notation for the exercises from Lesson 1. Print and practice.",
      category: "Tabs",
      fileUrl: "/portal/resources/fretless-tab-01.pdf",
      fileType: "pdf",
      sizeKb: 240,
      downloadable: true,
    },
    {
      title: "Sweep Picking Exercises — Complete Tab Pack",
      description: "All sweep picking exercises from the Mastery lesson in one PDF.",
      category: "Tabs",
      fileUrl: "/portal/resources/sweep-tabs.pdf",
      fileType: "pdf",
      sizeKb: 380,
      downloadable: true,
    },
    {
      title: "Exotic Scales Reference Sheet",
      description: "Printable reference card for all scales covered in the Theory & Scales lesson.",
      category: "Tabs",
      fileUrl: "/portal/resources/exotic-scales-ref.pdf",
      fileType: "pdf",
      sizeKb: 120,
      downloadable: true,
    },
    {
      title: "Riff Analysis — Technical Death Metal Compositions",
      description: "Annotated score analysis of Tom's riff-writing approach. Download and study.",
      category: "Tabs",
      fileUrl: "/portal/resources/riff-analysis.pdf",
      fileType: "pdf",
      sizeKb: 560,
      downloadable: true,
    },
    {
      title: "Backing Tracks — E Phrygian Dominant (Stream Only)",
      description: "Practice backing tracks in E Phrygian Dominant. Multiple tempos available.",
      category: "Backing Tracks",
      fileUrl: "/portal/resources/backing-phrygian.mp3",
      fileType: "mp3",
      sizeKb: 12000,
      downloadable: false,
    },
    {
      title: "Reading List — Music Theory & Composition Books",
      description: "Tom's curated reading list for serious students of music theory and composition.",
      category: "Study Materials",
      fileUrl: "/portal/resources/reading-list.pdf",
      fileType: "pdf",
      sizeKb: 80,
      downloadable: true,
    },
  ]);
  console.log("✅ Portal resources seeded");

  console.log("🎸 Database seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
