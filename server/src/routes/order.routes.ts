import { Router, Request, Response, NextFunction } from "express";
import { orderService } from "../services/order.service.js";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";
import { z } from "zod";
// import { asyncHandler } from "../utils/asyncHandler.js";

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

const router = Router();

const createOrderSchema = z.object({
    items: z.array(z.object({
        productId: z.number(),
        quantity: z.number().positive(),
    })).min(1),
    paymentMethod: z.string().min(1),
    shippingAddress: z.string().optional(),
    notes: z.string().optional(),
    guestEmail: z.string().email().optional(),
    guestName: z.string().optional(),
    guestPhone: z.string().optional(),
});

// POST /api/orders - Create order (public - supports guest)
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = createOrderSchema.parse(req.body);
        const order = await orderService.createOrder(input, req.user?.id);
        res.status(201).json(order);
    } catch (error) {
        next(error);
    }
});

// GET /api/orders - Get user's orders (authenticated)
router.get("/", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await orderService.getUserOrders(req.user!.id);
        res.json(orders);
    } catch (error) {
        next(error);
    }
});

// GET /api/orders/:id - Get order details (owner or admin)
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const order = await orderService.getOrderById(
            id,
            req.user?.id,
            req.user?.role === "admin"
        );
        res.json(order);
    } catch (error) {
        next(error);
    }
});

// PATCH /api/orders/:id/status - Update order status (admin)
router.patch("/:id/status", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body;
        const order = await orderService.updateOrderStatus(id, status);
        res.json(order);
    } catch (error) {
        next(error);
    }
});

// GET /api/admin/orders - List all orders (admin)
router.get("/admin/all", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, limit, status } = req.query;
        const orders = await orderService.getAllOrders({
            page: page ? parseInt(page as string) : undefined,
            limit: limit ? parseInt(limit as string) : undefined,
            status: status as string,
        });
        res.json(orders);
    } catch (error) {
        next(error);
    }
});

// Mark order as received (Customer)
router.patch(
    "/:id/receive",
    asyncHandler(async (req, res) => {
        const orderId = parseInt(req.params.id);
        const order = await orderService.receiveOrder(orderId);
        res.json(order);
    })
);

// Rate order and products
router.post(
    "/:id/rating",
    asyncHandler(async (req, res) => {
        const orderId = parseInt(req.params.id);
        const { deliveryRating, deliveryFeedback, productRatings, userId, guestName } = req.body;
        const result = await orderService.addOrderRating(orderId, {
            deliveryRating,
            deliveryFeedback,
            productRatings,
            userId,
            guestName
        });
        res.json(result);
    })
);

export default router;
