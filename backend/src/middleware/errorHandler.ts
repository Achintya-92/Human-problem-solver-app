import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: { code: "VALIDATION_ERROR", message: "Invalid request", details: err.flatten() },
    });
  }

  if (typeof err === "object" && err && "statusCode" in err) {
    const statusCode = (err as any).statusCode as number;
    const message = (err as any).message ?? "Request failed";
    const code = statusCode === 404 ? "NOT_FOUND" : "CONFLICT";
    return res.status(statusCode).json({ error: { code, message } });
  }

  // eslint-disable-next-line no-console
  console.error(err);
  return res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "Something went wrong" },
  });
}

