import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => {
  return (request: Request, response: Response, next: NextFunction) => {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      response.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
      return;
    }

    request.body = result.data;
    next();
  };
};
