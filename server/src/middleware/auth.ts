import { Request, Response, NextFunction } from "express";
import { auth } from "../config/auth.js";

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string | null;
                role: "customer" | "admin";
            };
        }
    }
}

// Middleware to verify session and attach user to request
export async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers as unknown as Headers,
        });

        if (session?.user) {
            req.user = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name || null,
                role: (session.user as { role?: string }).role as "customer" | "admin" || "customer",
            };
        }

        next();
    } catch (error) {
        next();
    }
}

// Middleware to require authentication
export function requireAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
    }
    next();
}
