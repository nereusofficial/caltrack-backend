import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export const notFoundHandler = (
  _req: Request,
  res: Response
) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
};