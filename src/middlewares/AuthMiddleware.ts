import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { UserRole } from "../entities/User.js";

// Extend Express's Request type to include user information
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: UserRole;
      };
    }
  }
}

export const authenticate = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // Get the Authorization header
  const authHeader = request.headers.authorization;

  // Check if the header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    response.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
    return;
  }

  // Extract the token (remove "Bearer " prefix)
  const token = authHeader.split(" ")[1];
  // "Bearer abc123" → ["Bearer", "abc123"] → "abc123"

  try {
    // Verify the token
    const decoded = jwt.verify(token, env.jwt.accessSecret) as {
      userId: string;
      role: UserRole;
    };

    // Attach user info to the request
    request.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    // Pass control to the next function
    next();
  } catch (error) {
    response.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
    return;
  }
};
