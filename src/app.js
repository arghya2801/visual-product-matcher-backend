import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import healthRouter from "./routes/health.route.js";
import uploadRouter from "./routes/upload.route.js";
import productsRouter from "./routes/products.route.js";
import searchRouter from "./routes/search.route.js";
import bulkUploadRouter from "./routes/bulk-upload.route.js";
import { errorHandler } from "./middleware/error.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));

  // Static UI
  app.use(express.static(path.join(__dirname, "..", "public")));

  // Routes
  app.use("/health", healthRouter);
  app.use("/api/upload", uploadRouter);
  app.use("/api/products", productsRouter);
  app.use("/api/search", searchRouter);
  app.use("/api/bulk-upload", bulkUploadRouter);

  // Error handler
  app.use(errorHandler);

  return app;
}
