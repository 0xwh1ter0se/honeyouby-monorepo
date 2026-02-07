import { Router, Request, Response, NextFunction } from "express";
import { reviewService } from "../services/review.service.js";
import { requireAdmin } from "../middleware/admin.js";
import { z } from "zod";

const router = Router();

const createReviewSchema = z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
    guestName: z.string().optional(),
});

// GET /api/products/:productId/reviews - Get product reviews
router.get("/products/:productId/reviews", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId = parseInt(req.params.productId);
        const reviews = await reviewService.getProductReviews(productId);
        res.json(reviews);
    } catch (error) {
        next(error);
    }
});

// POST /api/products/:productId/reviews - Create review
router.post("/products/:productId/reviews", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId = parseInt(req.params.productId);
        const input = createReviewSchema.parse(req.body);
        const review = await reviewService.createReview(productId, input, req.user?.id);
        res.status(201).json(review);
    } catch (error) {
        next(error);
    }
});

// PATCH /api/reviews/:id/approve - Approve review (admin)
router.patch("/:id/approve", requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const review = await reviewService.approveReview(id);
        res.json(review);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/reviews/:id - Delete review (admin)
router.delete("/:id", requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        await reviewService.deleteReview(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

// GET /api/admin/reviews - Get all reviews for moderation (admin)
router.get("/admin/all", requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { approved } = req.query;
        const reviews = await reviewService.getAllReviews({
            approved: approved === "true" ? true : approved === "false" ? false : undefined,
        });
        res.json(reviews);
    } catch (error) {
        next(error);
    }
});

export default router;
