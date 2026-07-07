import express, { type Express } from "express";
import cors from "cors";
import router from "./routes";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// 404 handler — helps debug when routes don't match
app.use("/api", (req, res) => {
  console.warn(`[API] 404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: "Not Found",
    method: req.method,
    path: req.originalUrl,
    hint: "Check that the API route exists and the request path is correct.",
  });
});

export default app;
