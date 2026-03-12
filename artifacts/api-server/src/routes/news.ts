import { Router, type IRouter } from "express";
import { db, newsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query["page"]) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query["limit"]) || 10));
    const offset = (page - 1) * limit;

    const [posts, totalResult] = await Promise.all([
      db.select().from(newsTable).orderBy(desc(newsTable.publishedAt)).limit(limit).offset(offset),
      db.select({ count: sql<number>`count(*)::int` }).from(newsTable),
    ]);

    const total = totalResult[0]?.count ?? 0;

    res.json({
      posts: posts.map((p) => ({
        ...p,
        excerpt: p.excerpt ?? null,
        imageUrl: p.imageUrl ?? null,
        publishedAt: p.publishedAt.toISOString(),
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error listing news:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const [post] = await db.select().from(newsTable).where(eq(newsTable.slug, slug));
    if (!post) return res.status(404).json({ error: "Post not found" });

    res.json({
      ...post,
      excerpt: post.excerpt ?? null,
      imageUrl: post.imageUrl ?? null,
      publishedAt: post.publishedAt.toISOString(),
    });
  } catch (err) {
    console.error("Error fetching news post:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
