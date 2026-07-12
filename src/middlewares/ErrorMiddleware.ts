import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.error("Unhandled error:", error);

  response.status(500).json({
    success: false,
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && {
      error: error.message,
    }),
  });
};