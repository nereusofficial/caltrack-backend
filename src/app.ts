import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import pool from "./config/db";
import { corsMiddleware } from "./middleware/cors.middleware";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

dotenv.config();

const app: Application = express();

// Security middleware
app.use(helmet());

// CORS
app.use(corsMiddleware);

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

// Error Handler
app.use(errorHandler);

// 404 Handler
app.use(notFoundHandler);

export default app;