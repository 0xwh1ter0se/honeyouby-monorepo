import { Router, Request, Response, NextFunction } from "express";
import { productService } from "../services/product.service.js";
import { requireAdmin } from "../middleware/admin.js";
import { z } from "zod";

const router = Router();

// Validation schemas
const createProductSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    price: z.number().positive(),
    stock: z.number().int().min(0).optional(),
    image: z.string().optional(),
    categoryIds: z.array(z.number()).optional(),
});

// GET /api/products - List products
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { category, search, page, limit } = req.query;

        const products = await productService.getProducts({
            category: category as string,
            search: search as string,
            page: page ? parseInt(page as string) : undefined,
            limit: limit ? parseInt(limit as string) : undefined,
        });

        res.json(products);
    } catch (error) {
        next(error);
    }
});

// GET /api/products/:slug - Get single product
router.get("/:slug", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await productService.getProductBySlug(req.params.slug);
        res.json(product);
    } catch (error) {
        next(error);
    }
});

// POST /api/products - Create product (admin)
router.post("/", requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = createProductSchema.parse(req.body);
        const product = await productService.createProduct(input);
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
});

// PATCH /api/products/:id - Update product (admin)
router.patch("/:id", requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const input = createProductSchema.partial().parse(req.body);
        const product = await productService.updateProduct(id, input);
        res.json(product);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/products/:id - Delete product (admin)
router.delete("/:id", requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        await productService.deleteProduct(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default router;
