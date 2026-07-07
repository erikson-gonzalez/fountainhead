import { Router, type IRouter } from "express";
import { db, bookOfferingsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const books = await db
      .select()
      .from(bookOfferingsTable)
      .orderBy(bookOfferingsTable.sortOrder, bookOfferingsTable.id);
    res.json({
      books: books.map((b) => ({
        ...b,
        priceEur: Number(b.priceEur),
        sortOrder: b.sortOrder != null ? Number(b.sortOrder) : 0,
      })),
    });
  } catch (err) {
    console.error("Error listing books:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
