import { Router, Request, Response, NextFunction } from "express";
import { carouselService } from "../services/carousel.service.js";
import { requireAdmin } from "../middleware/admin.js";
import { z } from "zod";

const router = Router();

const carouselSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    image: z.string().optional(),
    backgroundColor: z.string().optional(),
    linkUrl: z.string().optional(),
    sortOrder: z.number().optional(),
    isActive: z.boolean().optional(),
});

// GET /api/carousels - Get active carousels
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const carousels = await carouselService.getActiveCarousels();
        res.json(carousels);
    } catch (error) {
        next(error);
    }
});

// POST /api/carousels - Create carousel (admin)
router.post("/", requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = carouselSchema.parse(req.body);
        const carousel = await carouselService.createCarousel(input);
        res.status(201).json(carousel);
    } catch (error) {
        next(error);
    }
});

// PATCH /api/carousels/:id - Update carousel (admin)
router.patch("/:id", requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const input = carouselSchema.partial().parse(req.body);
        const carousel = await carouselService.updateCarousel(id, input);
        res.json(carousel);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/carousels/:id - Delete carousel (admin)
router.delete("/:id", requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        await carouselService.deleteCarousel(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

// GET /api/admin/carousels - Get all carousels (admin)
router.get("/admin/all", requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const carousels = await carouselService.getAllCarousels();
        res.json(carousels);
    } catch (error) {
        next(error);
    }
});

export default router;
