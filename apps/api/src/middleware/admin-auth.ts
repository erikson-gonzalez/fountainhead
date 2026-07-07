import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-in-production";

export interface AdminJwtPayload {
  username: string;
  sub: string;
  iat: number;
  exp: number;
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized", code: "NO_TOKEN" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminJwtPayload;
    (req as Request & { admin?: AdminJwtPayload }).admin = decoded;
    return next();
  } catch {
    return res.status(401).json({ error: "Unauthorized", code: "INVALID_TOKEN" });
  }
}

export function signAdminToken(username: string, id: string): string {
  return jwt.sign(
    { username, sub: id },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}
