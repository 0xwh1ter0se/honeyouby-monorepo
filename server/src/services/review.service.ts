import { db } from "../config/database.js";
import { reviews } from "../db/schema.js";
import { eq, and, desc } from "drizzle-orm";
import { ApiError } from "../middleware/errorHandler.js";

export interface CreateReviewInput {
    rating: number;
    comment?: string;
    guestName?: string;
}

export class ReviewService {
    // Get product reviews (approved only for public)
    async getProductReviews(productId: number, includeUnapproved = false) {
        let query = db.select().from(reviews).where(eq(reviews.productId, productId));

        if (!includeUnapproved) {
            query = (query as any).where(and(eq(reviews.productId, productId), eq(reviews.isApproved, true)));
        }

        return await query.orderBy(desc(reviews.createdAt));
    }

    // Create review
    async createReview(productId: number, input: CreateReviewInput, userId?: string) {
        if (input.rating < 1 || input.rating > 5) {
            throw ApiError.badRequest("Rating must be between 1 and 5");
        }

        const [review] = await db
            .insert(reviews)
            .values({
                productId,
                userId: userId || null,
                guestName: input.guestName,
                rating: input.rating,
                comment: input.comment,
                isApproved: false, // Requires admin approval
            })
            .returning();

        return review;
    }

    // Approve review (admin)
    async approveReview(id: number) {
        const [review] = await db
            .update(reviews)
            .set({ isApproved: true })
            .where(eq(reviews.id, id))
            .returning();

        if (!review) {
            throw ApiError.notFound("Review not found");
        }

        return review;
    }

    // Delete review (admin)
    async deleteReview(id: number) {
        const [deleted] = await db
            .delete(reviews)
            .where(eq(reviews.id, id))
            .returning();

        if (!deleted) {
            throw ApiError.notFound("Review not found");
        }

        return deleted;
    }

    // Get all reviews for moderation (admin)
    async getAllReviews(options: { approved?: boolean }) {
        let query = db.select().from(reviews);

        if (options.approved !== undefined) {
            query = query.where(eq(reviews.isApproved, options.approved)) as any;
        }

        return await query.orderBy(desc(reviews.createdAt));
    }
}

export const reviewService = new ReviewService();
