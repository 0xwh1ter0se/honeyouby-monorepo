import { db } from "../config/database.js";
import { carousels } from "../db/schema.js";
import { eq, asc } from "drizzle-orm";
import { ApiError } from "../middleware/errorHandler.js";

export interface CreateCarouselInput {
    title: string;
    description?: string;
    image?: string;
    backgroundColor?: string;
    linkUrl?: string;
    sortOrder?: number;
    isActive?: boolean;
}

export class CarouselService {
    // Get active carousels
    async getActiveCarousels() {
        return await db
            .select()
            .from(carousels)
            .where(eq(carousels.isActive, true))
            .orderBy(asc(carousels.sortOrder));
    }

    // Create carousel (admin)
    async createCarousel(input: CreateCarouselInput) {
        const [carousel] = await db
            .insert(carousels)
            .values({
                title: input.title,
                description: input.description,
                image: input.image,
                backgroundColor: input.backgroundColor,
                linkUrl: input.linkUrl,
                sortOrder: input.sortOrder || 0,
                isActive: input.isActive ?? true,
            })
            .returning();

        return carousel;
    }

    // Update carousel (admin)
    async updateCarousel(id: number, input: Partial<CreateCarouselInput>) {
        const [carousel] = await db
            .update(carousels)
            .set(input)
            .where(eq(carousels.id, id))
            .returning();

        if (!carousel) {
            throw ApiError.notFound("Carousel not found");
        }

        return carousel;
    }

    // Delete carousel (admin)
    async deleteCarousel(id: number) {
        const [deleted] = await db
            .delete(carousels)
            .where(eq(carousels.id, id))
            .returning();

        if (!deleted) {
            throw ApiError.notFound("Carousel not found");
        }

        return deleted;
    }

    // Get all carousels (admin)
    async getAllCarousels() {
        return await db.select().from(carousels).orderBy(asc(carousels.sortOrder));
    }
}

export const carouselService = new CarouselService();
