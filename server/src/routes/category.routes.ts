import { Router, Request, Response, NextFunction } from "express";
import { categoryService } from "../services/category.service.js";
import { requireAdmin } from "../middleware/admin.js";
import { z } from "zod";

const router = Router();

const categorySchema = z.object({
    name: z.string().min(1),
});

// GET /api/categories - List categories
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await categoryService.getCategories();
        res.json(categories);
    } catch (error) {
        next(error);
    }
});

// POST /api/categories - Create category (admin)
router.post("/", requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = categorySchema.parse(req.body);
        const category = await categoryService.createCategory(input);
        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
});

// PATCH /api/categories/:id - Update category (admin)
router.patch("/:id", requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const input = categorySchema.parse(req.body);
        const category = await categoryService.updateCategory(id, input);
        res.json(category);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/categories/:id - Delete category (admin)
router.delete("/:id", requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        await categoryService.deleteCategory(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default router;
