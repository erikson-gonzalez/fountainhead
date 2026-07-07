import type { AdminJwtPayload } from "../middleware/admin-auth";

declare global {
  namespace Express {
    interface Request {
      admin?: AdminJwtPayload;
    }
  }
}

export {};
