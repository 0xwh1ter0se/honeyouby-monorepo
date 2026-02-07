import { db } from "../config/database.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { ApiError } from "../middleware/errorHandler.js";

export class UserService {
    // Get user profile
    async getProfile(userId: string) {
        const [user] = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                image: users.image,
                phone: users.phone,
                role: users.role,
            })
            .from(users)
            .where(eq(users.id, userId));

        if (!user) {
            throw ApiError.notFound("User not found");
        }

        return user;
    }

    // Update user profile
    async updateProfile(userId: string, data: { name?: string; phone?: string; image?: string }) {
        const [user] = await db
            .update(users)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(users.id, userId))
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                image: users.image,
                phone: users.phone,
                role: users.role,
            });

        if (!user) {
            throw ApiError.notFound("User not found");
        }

        return user;
    }
}

export const userService = new UserService();
