import { Router, type IRouter } from "express";
import { db, servicesTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const services = await db.select().from(servicesTable);
    res.json({
      services: services.map((s) => ({
        ...s,
        priceEur: Number(s.priceEur),
        durationHours: s.durationHours != null ? Number(s.durationHours) : null,
      })),
    });
  } catch (err) {
    console.error("Error listing services:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
