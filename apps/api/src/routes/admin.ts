import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { db, adminUsersTable, artistInfoTable, productsTable, portalLessonsTable, portalResourcesTable, testimonialsTable, albumsTable, quoteConfigTable, servicesTable, bookOfferingsTable, liveShowsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { z } from "zod";
import { requireAdmin, signAdminToken } from "../middleware/admin-auth";

const router: IRouter = Router();

// Debug: log all admin requests (remove in production if verbose)
router.use((req, _res, next) => {
  if (req.method === "POST" || req.method === "PUT") {
    console.log("[Admin] Incoming:", req.method, req.path);
  }
  next();
});

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

router.post("/login", async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
    }

    const { username, password } = parsed.data;

    const [admin] = await db
      .select()
      .from(adminUsersTable)
      .where(eq(adminUsersTable.username, username))
      .limit(1);

    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials", code: "INVALID_CREDENTIALS" });
    }

    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials", code: "INVALID_CREDENTIALS" });
    }

    const token = signAdminToken(admin.username, String(admin.id));
    return res.json({ token, username: admin.username });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/me", requireAdmin, (req, res) => {
  return res.json({ username: req.admin?.username ?? "" });
});

// --- Artist info (protected) ---
const artistInfoSchema = z.object({
  tagline: z.string().optional(),
  bio: z.string().optional(),
  heroTagline: z.string().optional(),
  heroVideoUrl: z.string().optional(),
  heroPosterUrl: z.string().optional(),
  heroTitlePrefix: z.string().optional(),
  heroTitleHighlight: z.string().optional(),
  heroTitleSuffix: z.string().optional(),
  testimonialsSectionTitle: z.string().optional(),
  testimonialsSectionSubtitle: z.string().optional(),
  aboutHeading: z.string().optional(),
  aboutSubheading: z.string().optional(),
  aboutPortraitUrl: z.string().optional(),
  endorsementsSectionTitle: z.string().optional(),
  endorsements: z.string().optional(),
  musicLinks: z.string().optional(),
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
  contactAddress: z.string().optional(),
});

router.put("/artist-info", requireAdmin, async (req, res) => {
  try {
    const parsed = artistInfoSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
    }
    const data = parsed.data;
    console.log("[artist-info PUT] heroTitlePrefix:", JSON.stringify(data.heroTitlePrefix));
    console.log("[artist-info PUT] heroTitleHighlight:", JSON.stringify(data.heroTitleHighlight));
    console.log("[artist-info PUT] heroTitleSuffix:", JSON.stringify(data.heroTitleSuffix));

    const [existing] = await db.select().from(artistInfoTable).limit(1);
    console.log("[artist-info PUT] existing.heroTitlePrefix:", JSON.stringify((existing as Record<string,unknown>)?.heroTitlePrefix));

    // Use raw body to allow clearing fields: if key is present (even with ""), use it; else keep existing
    const body = req.body as Record<string, unknown>;
    const heroTitlePrefix =
      body && "heroTitlePrefix" in body
        ? String(body.heroTitlePrefix ?? "").trim()
        : ((existing as { heroTitlePrefix?: string })?.heroTitlePrefix ?? "");
    const heroTitleHighlight =
      body && "heroTitleHighlight" in body
        ? String(body.heroTitleHighlight ?? "").trim()
        : ((existing as { heroTitleHighlight?: string })?.heroTitleHighlight ?? "");
    const heroTitleSuffix =
      body && "heroTitleSuffix" in body
        ? String(body.heroTitleSuffix ?? "").trim()
        : ((existing as { heroTitleSuffix?: string })?.heroTitleSuffix ?? "");

    const payload = {
      tagline: data.tagline ?? existing?.tagline ?? "",
      bio: data.bio ?? existing?.bio ?? "",
      heroTagline: data.heroTagline ?? existing?.heroTagline ?? "",
      heroVideoUrl: data.heroVideoUrl ?? (existing as { heroVideoUrl?: string })?.heroVideoUrl ?? "",
      heroPosterUrl: data.heroPosterUrl ?? (existing as { heroPosterUrl?: string })?.heroPosterUrl ?? "",
      heroTitlePrefix,
      heroTitleHighlight,
      heroTitleSuffix,
      testimonialsSectionTitle: data.testimonialsSectionTitle ?? (existing as { testimonialsSectionTitle?: string })?.testimonialsSectionTitle ?? "",
      testimonialsSectionSubtitle: data.testimonialsSectionSubtitle ?? (existing as { testimonialsSectionSubtitle?: string })?.testimonialsSectionSubtitle ?? "",
      aboutHeading: data.aboutHeading ?? (existing as { aboutHeading?: string })?.aboutHeading ?? "",
      aboutSubheading: data.aboutSubheading ?? (existing as { aboutSubheading?: string })?.aboutSubheading ?? "",
      aboutPortraitUrl: data.aboutPortraitUrl ?? (existing as { aboutPortraitUrl?: string })?.aboutPortraitUrl ?? "",
      endorsementsSectionTitle: data.endorsementsSectionTitle ?? (existing as { endorsementsSectionTitle?: string })?.endorsementsSectionTitle ?? "Official Endorsements",
      endorsements: data.endorsements ?? existing?.endorsements ?? "",
      musicLinks: data.musicLinks ?? existing?.musicLinks ?? "",
      contactEmail: data.contactEmail ?? existing?.contactEmail ?? "",
      contactPhone: data.contactPhone ?? existing?.contactPhone ?? "",
      contactAddress: data.contactAddress ?? existing?.contactAddress ?? "",
    };

    if (existing) {
      await db.update(artistInfoTable).set({ ...payload, updatedAt: new Date() }).where(eq(artistInfoTable.id, existing.id));
    } else {
      await db.insert(artistInfoTable).values(payload);
    }
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error updating artist info:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// --- Testimonials (protected) ---
const testimonialSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  quote: z.string().min(1),
  type: z.enum(["artist", "student"]).optional().default("artist"),
  featured: z.boolean().optional().default(false),
});

router.get("/testimonials", requireAdmin, async (_req, res) => {
  try {
    const rows = await db.select().from(testimonialsTable).orderBy(testimonialsTable.id);
    return res.json({ testimonials: rows });
  } catch (err) {
    console.error("Error listing testimonials:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/testimonials", requireAdmin, async (req, res) => {
  try {
    const parsed = testimonialSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
    const [row] = await db.insert(testimonialsTable).values(parsed.data).returning({ id: testimonialsTable.id });
    return res.json({ ok: true, id: row?.id });
  } catch (err) {
    console.error("Error creating testimonial:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/testimonials/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    const parsed = testimonialSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
    await db.update(testimonialsTable).set(parsed.data).where(eq(testimonialsTable.id, id));
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error updating testimonial:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/testimonials/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    await db.delete(testimonialsTable).where(eq(testimonialsTable.id, id));
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error deleting testimonial:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// --- Albums / Discography (protected) ---
const albumSchema = z.object({
  artist: z.string().min(1),
  title: z.string().min(1),
  releaseDate: z.string().optional(),
  role: z.string().min(1),
  roleType: z
    .preprocess((val) => {
      const str = Array.isArray(val) ? val.join(",") : String(val ?? "").trim();
      if (!str) return "other";
      const valid = ["performer", "producer", "mixing", "writer", "other"];
      const parts = str
        .split(",")
        .map((p) => p.trim().toLowerCase())
        .filter((p) => valid.includes(p));
      return parts.length > 0 ? [...new Set(parts)].join(",") : "other";
    }, z.string())
    .optional()
    .default("other"),
  genre: z.string().min(1),
  coverUrl: z.string().nullish(),
  spotifyEmbedUrl: z.string().nullish(),
  description: z.string().nullish(),
  featured: z.boolean().optional().default(false),
});

router.get("/albums", requireAdmin, async (_req, res) => {
  try {
    const rows = await db.select().from(albumsTable).orderBy(desc(albumsTable.createdAt), desc(albumsTable.id));
    return res.json({ albums: rows });
  } catch (err) {
    console.error("Error listing albums:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/albums", requireAdmin, async (req, res) => {
  try {
    const parsed = albumSchema.safeParse(req.body);
    if (!parsed.success) {
      console.error("[Admin POST /albums] Validation failed:", JSON.stringify(parsed.error.flatten(), null, 2));
      return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
    }
    const data = parsed.data;
    if (data.featured) {
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(albumsTable)
        .where(eq(albumsTable.featured, true));
      if (count >= 4)
        return res.status(400).json({ error: "Ya hay 4 featured works. Desmarca uno antes de añadir otro." });
    }
    const [row] = await db.insert(albumsTable).values({
      artist: data.artist,
      title: data.title,
      releaseDate: data.releaseDate ?? "1900-01-01",
      role: data.role,
      roleType: data.roleType,
      genre: data.genre,
      coverUrl: data.coverUrl ?? null,
      spotifyEmbedUrl: data.spotifyEmbedUrl ?? null,
      description: data.description ?? null,
      featured: data.featured ?? false,
    }).returning({ id: albumsTable.id });
    return res.json({ ok: true, id: row?.id });
  } catch (err) {
    console.error("Error creating album:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/albums/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    const parsed = albumSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
    const data = parsed.data as Record<string, unknown>;
    if (data.featured === true) {
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(albumsTable)
        .where(eq(albumsTable.featured, true));
      if (count >= 4) {
        const [current] = await db.select({ featured: albumsTable.featured }).from(albumsTable).where(eq(albumsTable.id, id));
        if (!current?.featured)
          return res.status(400).json({ error: "Ya hay 4 featured works. Desmarca uno antes de marcar otro." });
      }
    }
    await db.update(albumsTable).set(data).where(eq(albumsTable.id, id));
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error updating album:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/albums/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    await db.delete(albumsTable).where(eq(albumsTable.id, id));
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error deleting album:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// --- Products (protected) ---
const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceEur: z.union([z.number(), z.string()]),
  category: z.string().min(1),
  imageUrl: z.string().optional().nullable(),
  stock: z.number().optional().nullable(),
  digital: z.boolean().optional().default(false),
  featured: z.boolean().optional().default(false),
  deliveryType: z.enum(["physical", "download", "stream"]).optional().nullable(),
});

router.get("/products", requireAdmin, async (_req, res) => {
  try {
    const rows = await db.select().from(productsTable).orderBy(productsTable.id);
    return res.json({
      products: rows.map((p) => ({
        ...p,
        priceEur: Number(p.priceEur),
        imageUrl: p.imageUrl ?? null,
        stock: p.stock ?? null,
      })),
    });
  } catch (err) {
    console.error("Error listing products:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/products", requireAdmin, async (req, res) => {
  try {
    const parsed = productSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
    const { priceEur, deliveryType, digital, ...rest } = parsed.data;
    const digitalVal = deliveryType ? (deliveryType !== "physical") : (digital ?? false);
    await db.insert(productsTable).values({ ...rest, priceEur: String(priceEur), deliveryType: deliveryType ?? null, digital: digitalVal });
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error creating product:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/products/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    const parsed = productSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
    const data = parsed.data as Record<string, unknown>;
    if (data.priceEur !== undefined) data.priceEur = String(data.priceEur);
    await db.update(productsTable).set(data).where(eq(productsTable.id, id));
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error updating product:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/products/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    await db.delete(productsTable).where(eq(productsTable.id, id));
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error deleting product:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// --- Portal lessons (protected) ---
const lessonSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  duration: z.number().min(0),
  topic: z.string().min(1),
  level: z.string().optional().default("intermediate"),
  videoUrl: z.string().min(1),
  thumbnailUrl: z.string().optional().nullable(),
});

router.post("/portal/lessons", requireAdmin, async (req, res) => {
  try {
    const parsed = lessonSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
    await db.insert(portalLessonsTable).values(parsed.data);
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error creating lesson:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/portal/lessons/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    const parsed = lessonSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
    await db.update(portalLessonsTable).set(parsed.data).where(eq(portalLessonsTable.id, id));
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error updating lesson:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/portal/lessons/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    await db.delete(portalLessonsTable).where(eq(portalLessonsTable.id, id));
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error deleting lesson:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// --- Portal resources (protected) ---
const resourceSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  fileUrl: z.string().min(1),
  fileType: z.string().min(1),
  sizeKb: z.number().optional().nullable(),
  downloadable: z.boolean().optional().default(true),
});

router.post("/portal/resources", requireAdmin, async (req, res) => {
  try {
    const parsed = resourceSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
    await db.insert(portalResourcesTable).values(parsed.data);
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error creating resource:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/portal/resources/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    const parsed = resourceSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
    await db.update(portalResourcesTable).set(parsed.data).where(eq(portalResourcesTable.id, id));
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error updating resource:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/portal/resources/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    await db.delete(portalResourcesTable).where(eq(portalResourcesTable.id, id));
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error deleting resource:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// --- Services (protected) ---
const serviceSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceEur: z.union([z.number(), z.string()]),
  category: z.string().min(1),
  tag: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  unit: z.string().min(1),
  durationHours: z.union([z.number(), z.string()]).optional().nullable(),
});

router.get("/services", requireAdmin, async (_req, res) => {
  try {
    const rows = await db.select().from(servicesTable).orderBy(servicesTable.id);
    return res.json({
      services: rows.map((s) => ({
        ...s,
        priceEur: Number(s.priceEur),
        durationHours: s.durationHours != null ? Number(s.durationHours) : null,
      })),
    });
  } catch (err) {
    console.error("Error listing services:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/services", requireAdmin, async (req, res) => {
  try {
    const parsed = serviceSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
    const { priceEur, durationHours, ...rest } = parsed.data;
    const [row] = await db
      .insert(servicesTable)
      .values({
        ...rest,
        priceEur: String(priceEur),
        durationHours: durationHours != null ? String(durationHours) : null,
      })
      .returning({ id: servicesTable.id });
    return res.json({ ok: true, id: row?.id });
  } catch (err) {
    console.error("Error creating service:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/services/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    const parsed = serviceSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
    const data = parsed.data as Record<string, unknown>;
    if (data.priceEur !== undefined) data.priceEur = String(data.priceEur);
    if (data.durationHours !== undefined) data.durationHours = data.durationHours != null ? String(data.durationHours) : null;
    await db.update(servicesTable).set(data).where(eq(servicesTable.id, id));
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error updating service:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/services/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    await db.delete(servicesTable).where(eq(servicesTable.id, id));
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error deleting service:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// --- Book offerings (protected) ---
const bookOfferingSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceEur: z.union([z.number(), z.string()]),
  unit: z.string().min(1),
  tag: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  linkType: z.enum(["booking", "quote"]).optional().default("booking"),
  sortOrder: z.union([z.number(), z.string()]).optional().nullable(),
});

router.get("/books", requireAdmin, async (_req, res) => {
  try {
    const rows = await db.select().from(bookOfferingsTable).orderBy(bookOfferingsTable.sortOrder, bookOfferingsTable.id);
    return res.json({
      books: rows.map((b) => ({
        ...b,
        priceEur: Number(b.priceEur),
        sortOrder: b.sortOrder != null ? Number(b.sortOrder) : 0,
      })),
    });
  } catch (err) {
    console.error("Error listing books:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/books", requireAdmin, async (req, res) => {
  try {
    const parsed = bookOfferingSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
    const { priceEur, sortOrder, ...rest } = parsed.data;
    const [row] = await db
      .insert(bookOfferingsTable)
      .values({
        ...rest,
        priceEur: String(priceEur),
        sortOrder: sortOrder != null ? String(sortOrder) : null,
      })
      .returning({ id: bookOfferingsTable.id });
    return res.json({ ok: true, id: row?.id });
  } catch (err) {
    console.error("Error creating book offering:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/books/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    const parsed = bookOfferingSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
    const data = parsed.data as Record<string, unknown>;
    if (data.priceEur !== undefined) data.priceEur = String(data.priceEur);
    if (data.sortOrder !== undefined) data.sortOrder = data.sortOrder != null ? String(data.sortOrder) : null;
    await db.update(bookOfferingsTable).set(data).where(eq(bookOfferingsTable.id, id));
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error updating book offering:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/books/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    await db.delete(bookOfferingsTable).where(eq(bookOfferingsTable.id, id));
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error deleting book offering:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// --- Live Shows (protected) ---
const liveShowSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  venue: z.string().min(1),
  city: z.string().min(1),
  project: z.string().min(1),
  ticketUrl: z.string().url().optional().or(z.literal("")),
});

router.get("/live-shows", requireAdmin, async (_req, res) => {
  try {
    const rows = await db.select().from(liveShowsTable).orderBy(desc(sql`${liveShowsTable.date}::date`));
    return res.json({ shows: rows });
  } catch (err) {
    console.error("Error listing live shows:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/live-shows", requireAdmin, async (req, res) => {
  try {
    const parsed = liveShowSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
    const data = parsed.data;
    const [row] = await db
      .insert(liveShowsTable)
      .values({
        date: data.date,
        venue: data.venue,
        city: data.city,
        project: data.project,
        ticketUrl: data.ticketUrl?.trim() || null,
      })
      .returning({ id: liveShowsTable.id });
    return res.json({ ok: true, id: row?.id });
  } catch (err) {
    console.error("Error creating live show:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/live-shows/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    const parsed = liveShowSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
    const data = parsed.data as Record<string, unknown>;
    if (data.ticketUrl === "") data.ticketUrl = null;
    await db.update(liveShowsTable).set(data).where(eq(liveShowsTable.id, id));
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error updating live show:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/live-shows/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    await db.delete(liveShowsTable).where(eq(liveShowsTable.id, id));
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error deleting live show:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// --- Quote config / Rates (protected) ---
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

router.get("/quote-config", requireAdmin, async (_req, res) => {
  try {
    const rows = await db.select().from(quoteConfigTable);
    const config: Record<string, string> = {};
    for (const r of rows) config[r.key] = r.value;
    return res.json({ config });
  } catch (err) {
    console.error("Error fetching quote config:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const quoteConfigUpdateSchema = z.record(z.string(), z.union([z.string(), z.number()]));

router.put("/quote-config", requireAdmin, async (req, res) => {
  try {
    const parsed = quoteConfigUpdateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });

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
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error updating quote config:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
