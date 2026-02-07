import { Router, Request, Response, NextFunction } from "express";
import { blogService } from "../services/blog.service.js";
import { requireAdmin } from "../middleware/admin.js";
import { z } from "zod";

const router = Router();

const blogSchema = z.object({
    title: z.string().min(1),
    excerpt: z.string().optional(),
    content: z.string().optional(),
    image: z.string().optional(),
    isPublished: z.boolean().optional(),
});

// GET /api/blogs - List published blogs
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, limit } = req.query;
        const blogs = await blogService.getPublishedBlogs({
            page: page ? parseInt(page as string) : undefined,
            limit: limit ? parseInt(limit as string) : undefined,
        });
        res.json(blogs);
    } catch (error) {
        next(error);
    }
});

// GET /api/blogs/:slug - Get single blog
router.get("/:slug", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const blog = await blogService.getBlogBySlug(req.params.slug);
        res.json(blog);
    } catch (error) {
        next(error);
    }
});

// POST /api/blogs - Create blog (admin)
router.post("/", requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = blogSchema.parse(req.body);
        const blog = await blogService.createBlog(input);
        res.status(201).json(blog);
    } catch (error) {
        next(error);
    }
});

// PATCH /api/blogs/:id - Update blog (admin)
router.patch("/:id", requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const input = blogSchema.partial().parse(req.body);
        const blog = await blogService.updateBlog(id, input);
        res.json(blog);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/blogs/:id - Delete blog (admin)
router.delete("/:id", requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        await blogService.deleteBlog(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

// GET /api/admin/blogs - Get all blogs including drafts (admin)
router.get("/admin/all", requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const blogs = await blogService.getAllBlogs();
        res.json(blogs);
    } catch (error) {
        next(error);
    }
});

export default router;
