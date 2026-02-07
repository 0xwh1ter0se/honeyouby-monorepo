import { Router, Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service.js";
import { z } from "zod";

const router = Router();

// Validation schema
const updateProfileSchema = z.object({
    name: z.string().min(1).optional(),
    phone: z.string().optional(),
    image: z.string().url().optional().or(z.literal("")),
});

// GET /api/user/profile - Get current user profile
router.get("/profile", async (req: Request, res: Response, next: NextFunction) => {
    try {
        // req.user is populated by authMiddleware
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const profile = await userService.getProfile(req.user.id);
        res.json(profile);
    } catch (error) {
        next(error);
    }
});

// PATCH /api/user/profile - Update current user profile
router.patch("/profile", async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const input = updateProfileSchema.parse(req.body);
        const updatedUser = await userService.updateProfile(req.user.id, input);
        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
});

export default router;
