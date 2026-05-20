import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export type JwtPayload = { sub: string; email: string };

export function signToken(payload: JwtPayload): { token: string; expiresAt: Date } {
  const token = jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn } as jwt.SignOptions);
  const decoded = jwt.decode(token) as { exp: number };
  return { token, expiresAt: new Date(decoded.exp * 1000) };
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
}
