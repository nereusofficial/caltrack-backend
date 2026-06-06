import express, { Application, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import pool from "./config/db";

dotenv.config();

const app: Application = express();

// Security middleware
app.use(helmet());

// Manual CORS middleware (replaces cors package)
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;

  if (origin) {
    const normalized = origin.replace(/\/$/, "");

    const allowedPatterns = [
      /^http:\/\/localhost:\d+$/,
      /^https:\/\/caltrackv1\.vercel\.app$/,
      /^https:\/\/caltrack-frontend-[a-z0-9]+-nereusofficials-projects\.vercel\.app$/,
    ];

    if (allowedPatterns.some((p) => p.test(normalized))) {
      res.setHeader("Access-Control-Allow-Origin", normalized);
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    }
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// Request logging
app.use(morgan("dev"));

// Parse JSON requests
app.use(express.json());

// Parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "CalTrack API is running",
  });
});

// Database Test Route
app.get("/api/db-test", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.status(200).json({
      success: true,
      message: "Database connected",
      time: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: err.message,
    });
  }
});

// API Routes
app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/foods", foodRoutes);
// app.use("/api/calories", calorieRoutes);

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Handle Unknown Routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;