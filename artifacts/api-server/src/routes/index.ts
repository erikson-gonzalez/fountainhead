import { Router, type IRouter } from "express";
import healthRouter from "./health";
import albumsRouter from "./albums";
import newsRouter from "./news";
import productsRouter from "./products";
import ordersRouter from "./orders";
import bookingsRouter from "./bookings";
import quotesRouter from "./quotes";
import testimonialsRouter from "./testimonials";
import portalRouter from "./portal";
import servicesRouter from "./services";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/albums", albumsRouter);
router.use("/news", newsRouter);
router.use("/products", productsRouter);
router.use("/orders", ordersRouter);
router.use("/bookings", bookingsRouter);
router.use("/quotes", quotesRouter);
router.use("/testimonials", testimonialsRouter);
router.use("/portal", portalRouter);
router.use("/services", servicesRouter);

export default router;
