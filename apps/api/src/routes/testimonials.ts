import { Router, type IRouter } from "express";
import { db, testimonialsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const typeFilter = req.query["type"] as string | undefined;

    const query = db.select().from(testimonialsTable).orderBy(desc(testimonialsTable.featured));

    const testimonials = typeFilter && typeFilter !== "all"
      ? await query.where(eq(testimonialsTable.type, typeFilter))
      : await query;

    res.json({ testimonials });
  } catch (err) {
    console.error("Error listing testimonials:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
