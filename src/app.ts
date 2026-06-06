import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import pool from "./config/db";

dotenv.config();

const app: Application = express();

// Security middleware
app.use(helmet());

// Enable CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Request logging
app.use(morgan("dev"));

// Parse JSON requests
app.use(express.json());

// Parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "CalTrack API is running",
  });
});

app.get("/api/db-test", async (_req, res) => {
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
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Handle Unknown Routes
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;