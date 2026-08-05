import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { MulterError } from "multer";

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({ error: "Datos inválidos", details: err.flatten() });
    return;
  }

  if (err instanceof MulterError) {
    res.status(400).json({ error: `Error de archivo: ${err.message}` });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
}
