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
import booksRouter from "./books";
import artistInfoRouter from "./artist-info";
import adminRouter from "./admin";
import liveShowsRouter from "./live-shows";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/artist-info", artistInfoRouter);
router.use("/live-shows", liveShowsRouter);
router.use("/admin", adminRouter);
router.use("/albums", albumsRouter);
router.use("/news", newsRouter);
router.use("/products", productsRouter);
router.use("/orders", ordersRouter);
router.use("/bookings", bookingsRouter);
router.use("/quotes", quotesRouter);
router.use("/testimonials", testimonialsRouter);
router.use("/portal", portalRouter);
router.use("/services", servicesRouter);
router.use("/books", booksRouter);

export default router;
