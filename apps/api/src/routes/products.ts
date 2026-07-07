import { Router, type IRouter } from "express";
import { db, productsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query["page"]) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query["limit"]) || 12));
    const category = req.query["category"] as string | undefined;
    const offset = (page - 1) * limit;

    const baseQuery = db.select().from(productsTable);
    const countQuery = db.select({ count: sql<number>`count(*)::int` }).from(productsTable);

    const [products, totalResult] = await Promise.all([
      category && category !== "all"
        ? baseQuery.where(eq(productsTable.category, category)).orderBy(desc(productsTable.featured)).limit(limit).offset(offset)
        : baseQuery.orderBy(desc(productsTable.featured)).limit(limit).offset(offset),
      category && category !== "all"
        ? countQuery.where(eq(productsTable.category, category))
        : countQuery,
    ]);

    const total = totalResult[0]?.count ?? 0;

    return res.json({
      products: products.map((p) => ({
        ...p,
        priceEur: Number(p.priceEur),
        imageUrl: p.imageUrl ?? null,
        stock: p.stock ?? null,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error listing products:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params["id"]);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, id));
    if (!product) return res.status(404).json({ error: "Product not found" });

    return res.json({ ...product, priceEur: Number(product.priceEur), imageUrl: product.imageUrl ?? null, stock: product.stock ?? null });
  } catch (err) {
    console.error("Error fetching product:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
