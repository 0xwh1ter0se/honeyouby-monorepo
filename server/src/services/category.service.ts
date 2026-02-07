import { db } from "../config/database.js";
import { categories } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { default as slugify } from "slugify";
import { ApiError } from "../middleware/errorHandler.js";

export interface CreateCategoryInput {
    name: string;
}

export class CategoryService {
    // Get all categories
    async getCategories() {
        return await db.select().from(categories);
    }

    // Create category (admin)
    async createCategory(input: CreateCategoryInput) {
        const slug = slugify(input.name, { lower: true, strict: true });

        const [category] = await db
            .insert(categories)
            .values({
                name: input.name,
                slug,
            })
            .returning();

        return category;
    }

    // Update category (admin)
    async updateCategory(id: number, input: CreateCategoryInput) {
        const slug = slugify(input.name, { lower: true, strict: true });

        const [category] = await db
            .update(categories)
            .set({ name: input.name, slug })
            .where(eq(categories.id, id))
            .returning();

        if (!category) {
            throw ApiError.notFound("Category not found");
        }

        return category;
    }

    // Delete category (admin)
    async deleteCategory(id: number) {
        const [deleted] = await db
            .delete(categories)
            .where(eq(categories.id, id))
            .returning();

        if (!deleted) {
            throw ApiError.notFound("Category not found");
        }

        return deleted;
    }
}

export const categoryService = new CategoryService();
