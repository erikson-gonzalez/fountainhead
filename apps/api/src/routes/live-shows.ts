import { Router, type IRouter } from "express";
import { db, liveShowsTable } from "@workspace/db";
import { desc, sql } from "drizzle-orm";

const router: IRouter = Router();

// Public: list all live shows, ordered by date desc (most recent first)
router.get("/", async (_req, res) => {
  try {
    const shows = await db
      .select()
      .from(liveShowsTable)
      .orderBy(desc(sql`${liveShowsTable.date}::date`));
    return res.json({ shows });
  } catch (err) {
    console.error("Error listing live shows:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
