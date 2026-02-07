import { db } from "../config/database.js";
import { contactMessages } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";
import { ApiError } from "../middleware/errorHandler.js";

export interface CreateContactInput {
    name: string;
    email?: string;
    phone?: string;
    message: string;
}

export class ContactService {
    // Submit contact message (public)
    async createMessage(input: CreateContactInput) {
        const [message] = await db
            .insert(contactMessages)
            .values({
                name: input.name,
                email: input.email,
                phone: input.phone,
                message: input.message,
            })
            .returning();

        return message;
    }

    // Get all messages (admin)
    async getAllMessages(options: { unreadOnly?: boolean }) {
        let query = db.select().from(contactMessages);

        if (options.unreadOnly) {
            query = query.where(eq(contactMessages.isRead, false)) as typeof query;
        }

        return await query.orderBy(desc(contactMessages.createdAt));
    }

    // Mark message as read (admin)
    async markAsRead(id: number) {
        const [message] = await db
            .update(contactMessages)
            .set({ isRead: true })
            .where(eq(contactMessages.id, id))
            .returning();

        if (!message) {
            throw ApiError.notFound("Message not found");
        }

        return message;
    }

    // Delete message (admin)
    async deleteMessage(id: number) {
        const [deleted] = await db
            .delete(contactMessages)
            .where(eq(contactMessages.id, id))
            .returning();

        if (!deleted) {
            throw ApiError.notFound("Message not found");
        }

        return deleted;
    }
}

export const contactService = new ContactService();
