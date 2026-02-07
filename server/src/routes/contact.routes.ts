import { Router, Request, Response, NextFunction } from "express";
import { contactService } from "../services/contact.service.js";
import { requireAdmin } from "../middleware/admin.js";
import { z } from "zod";

const router = Router();

const contactSchema = z.object({
    name: z.string().min(1),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    message: z.string().min(1),
});

// POST /api/contact - Submit contact message
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = contactSchema.parse(req.body);
        const message = await contactService.createMessage(input);
        res.status(201).json({ success: true, id: message.id });
    } catch (error) {
        next(error);
    }
});

// GET /api/admin/contact - List all messages (admin)
router.get("/admin/all", requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { unreadOnly } = req.query;
        const messages = await contactService.getAllMessages({
            unreadOnly: unreadOnly === "true",
        });
        res.json(messages);
    } catch (error) {
        next(error);
    }
});

// PATCH /api/admin/contact/:id/read - Mark as read (admin)
router.patch("/admin/:id/read", requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const message = await contactService.markAsRead(id);
        res.json(message);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/admin/contact/:id - Delete message (admin)
router.delete("/admin/:id", requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        await contactService.deleteMessage(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default router;
