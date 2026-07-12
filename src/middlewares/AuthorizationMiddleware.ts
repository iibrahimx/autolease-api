import { Request, Response, NextFunction } from "express";
import { UserRole } from "../entities/User.js";

export const authorize = (...allowedRoles: UserRole[]) => {
  return (request: Request, response: Response, next: NextFunction) => {
    // Check if user exists on the request
    if (!request.user) {
      response.status(401).json({
        success: false,
        message: "Access denied. Not authenticated.",
      });
      return;
    }

    // Check if the user's role is in the allowed roles
    if (!allowedRoles.includes(request.user.role)) {
      response.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions.",
      });
      return;
    }

    // User has the required role, proceed
    next();
  };
};
