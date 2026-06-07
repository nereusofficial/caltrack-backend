import { Request, Response, NextFunction } from "express";

export const corsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const origin = req.headers.origin;

  if (origin) {
    const normalized = origin.replace(/\/$/, "");

    if (
      normalized.endsWith(".vercel.app") ||
      normalized.startsWith("http://localhost")
    ) {
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
};