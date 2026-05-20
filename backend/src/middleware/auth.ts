import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { unauthenticated } from "../utils/errors.js";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return next(unauthenticated());
  try {
    req.user = verifyToken(header.slice(7));
    next();
  } catch {
    next(unauthenticated("Invalid or expired token"));
  }
}
