import "./config/env.js";
import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import favoriteRoutes from "./routes/favorite.routes.js";
import reportRoutes from "./routes/report.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { localUploadsDir } from "./config/cloudinary.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve local upload images if running locally without Cloudinary
app.use("/uploads", express.static(localUploadsDir));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Dorm Mart API",
    mode: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// Root Info
app.get("/", (req, res) => {
  res.json({
    name: "Dorm Mart API",
    concept: "Product Discovery and Listing Platform for Dormitory Communities",
    version: "2.0.0",
    docs: "/api/health",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

export default app;
