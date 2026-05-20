import type { Request, Response, NextFunction } from "express";
import { User } from "../models/User.js";
import { forbidden, unauthenticated } from "../utils/errors.js";

export async function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) return next(unauthenticated());
  try {
    const user = await User.findById(req.user.sub);
    if (!user || user.deleted_at) return next(unauthenticated());
    if (!user.is_admin) return next(forbidden("Admin access required"));
    next();
  } catch (err) {
    next(err);
  }
}
