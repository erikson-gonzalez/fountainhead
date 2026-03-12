import { Router, type IRouter } from "express";
import { db, portalLessonsTable, portalResourcesTable, portalAccessTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import { z } from "zod";

const router: IRouter = Router();

router.get("/lessons", async (req, res) => {
  try {
    const [lessons, totalResult] = await Promise.all([
      db.select().from(portalLessonsTable).orderBy(portalLessonsTable.publishedAt),
      db.select({ count: sql<number>`count(*)::int` }).from(portalLessonsTable),
    ]);

    const total = totalResult[0]?.count ?? 0;

    res.json({
      lessons: lessons.map((l) => ({
        ...l,
        thumbnailUrl: l.thumbnailUrl ?? null,
        publishedAt: l.publishedAt.toISOString(),
      })),
      total,
    });
  } catch (err) {
    console.error("Error listing portal lessons:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/resources", async (req, res) => {
  try {
    const resources = await db.select().from(portalResourcesTable);
    res.json({
      resources: resources.map((r) => ({
        ...r,
        sizeKb: r.sizeKb ?? null,
      })),
    });
  } catch (err) {
    console.error("Error listing portal resources:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const accessSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  studentOf: z.string().nullable().optional(),
});

router.post("/access", async (req, res) => {
  try {
    const parsed = accessSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });

    const { name, email, studentOf } = parsed.data;

    const existing = await db
      .select()
      .from(portalAccessTable)
      .where(sql`${portalAccessTable.email} = ${email}`);

    if (existing.length > 0) {
      const record = existing[0]!;
      return res.json({
        status: record.status === "granted" ? "granted" : "pending",
        message: record.status === "granted"
          ? "Access already granted. Welcome back!"
          : "Your request is under review. We'll contact you soon.",
      });
    }

    await db.insert(portalAccessTable).values({
      name,
      email,
      studentOf: studentOf ?? null,
      status: "pending",
    });

    res.json({
      status: "pending",
      message: "Access request submitted! Tom will review and get back to you within 48 hours.",
    });
  } catch (err) {
    console.error("Error requesting portal access:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
