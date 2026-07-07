import { Router, type IRouter } from "express";
import { db, albumsTable } from "@workspace/db";
import { eq, desc, sql, and, like, type SQL } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query["page"]) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query["limit"]) || 12));
    const roleFilter = req.query["role"] as string | undefined;
    const genreFilter = req.query["genre"] as string | undefined;
    const featuredFilter = req.query["featured"];

    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];
    const roleLower = roleFilter?.toLowerCase();
    if (roleFilter) {
      if (["performer", "producer", "mixing", "writer", "other"].includes(roleLower ?? "")) {
        conditions.push(like(albumsTable.roleType, `%${roleLower}%`));
      } else {
        conditions.push(like(albumsTable.role, `%${roleFilter}%`));
      }
    }
    if (genreFilter) conditions.push(like(albumsTable.genre, `%${genreFilter}%`));
    if (featuredFilter === "true") conditions.push(eq(albumsTable.featured, true));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [albums, totalResult] = await Promise.all([
      db
        .select()
        .from(albumsTable)
        .where(whereClause)
        .orderBy(desc(albumsTable.id))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(albumsTable)
        .where(whereClause),
    ]);

    const total = totalResult[0]?.count ?? 0;

    return res.json({
      albums: albums.map((a) => ({ ...a, coverUrl: a.coverUrl ?? null, description: a.description ?? null })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error listing albums:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params["id"]);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    const [album] = await db.select().from(albumsTable).where(eq(albumsTable.id, id));
    if (!album) return res.status(404).json({ error: "Album not found" });

    return res.json({ ...album, coverUrl: album.coverUrl ?? null, description: album.description ?? null });
  } catch (err) {
    console.error("Error fetching album:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
