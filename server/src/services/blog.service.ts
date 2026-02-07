import { db } from "../config/database.js";
import { blogs } from "../db/schema.js";
import { eq, desc, and } from "drizzle-orm";
import _slugify from "slugify";
const slugify = _slugify as any;
import { ApiError } from "../middleware/errorHandler.js";

export interface CreateBlogInput {
    title: string;
    excerpt?: string;
    content?: string;
    image?: string;
    isPublished?: boolean;
}

export class BlogService {
    // Get published blogs
    async getPublishedBlogs(options: { page?: number; limit?: number }) {
        const { page = 1, limit = 10 } = options;
        const offset = (page - 1) * limit;

        return await db
            .select()
            .from(blogs)
            .where(eq(blogs.isPublished, true))
            .orderBy(desc(blogs.publishedAt))
            .limit(limit)
            .offset(offset);
    }

    // Get blog by slug
    async getBlogBySlug(slug: string) {
        const [blog] = await db
            .select()
            .from(blogs)
            .where(and(eq(blogs.slug, slug), eq(blogs.isPublished, true)));

        if (!blog) {
            throw ApiError.notFound("Blog not found");
        }

        return blog;
    }

    // Create blog (admin)
    async createBlog(input: CreateBlogInput) {
        const slug = slugify(input.title, { lower: true, strict: true });

        const [blog] = await db
            .insert(blogs)
            .values({
                title: input.title,
                slug,
                excerpt: input.excerpt,
                content: input.content,
                image: input.image,
                isPublished: input.isPublished || false,
                publishedAt: input.isPublished ? new Date() : null,
            })
            .returning();

        return blog;
    }

    // Update blog (admin)
    async updateBlog(id: number, input: Partial<CreateBlogInput>) {
        const updateData: Record<string, unknown> = { updatedAt: new Date() };

        if (input.title !== undefined) {
            updateData.title = input.title;
            updateData.slug = slugify(input.title, { lower: true, strict: true });
        }
        if (input.excerpt !== undefined) updateData.excerpt = input.excerpt;
        if (input.content !== undefined) updateData.content = input.content;
        if (input.image !== undefined) updateData.image = input.image;
        if (input.isPublished !== undefined) {
            updateData.isPublished = input.isPublished;
            if (input.isPublished) updateData.publishedAt = new Date();
        }

        const [blog] = await db
            .update(blogs)
            .set(updateData)
            .where(eq(blogs.id, id))
            .returning();

        if (!blog) {
            throw ApiError.notFound("Blog not found");
        }

        return blog;
    }

    // Delete blog (admin)
    async deleteBlog(id: number) {
        const [deleted] = await db
            .delete(blogs)
            .where(eq(blogs.id, id))
            .returning();

        if (!deleted) {
            throw ApiError.notFound("Blog not found");
        }

        return deleted;
    }

    // Get all blogs including drafts (admin)
    async getAllBlogs() {
        return await db.select().from(blogs).orderBy(desc(blogs.createdAt));
    }
}

export const blogService = new BlogService();
