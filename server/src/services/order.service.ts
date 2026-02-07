import { db } from "../config/database.js";
import { orders, products, orderItems, reviews, cashTransactions } from "../db/schema.js";
import { eq, desc, and } from "drizzle-orm";
import { ApiError } from "../middleware/errorHandler.js";

export interface OrderItemInput {
    productId: number;
    quantity: number;
}

export interface CreateOrderInput {
    items: OrderItemInput[];
    paymentMethod: string;
    shippingAddress?: string;
    notes?: string;
    // For guest checkout
    guestEmail?: string;
    guestName?: string;
    guestPhone?: string;
    // Source for finance tracking
    source?: string;
}

export class OrderService {
    // Create new order
    async createOrder(input: CreateOrderInput, userId?: string) {
        // Fetch products to get prices and verify stock
        const productIds = input.items.map((item) => item.productId);
        const productList = await db
            .select()
            .from(products)
            .where(eq(products.isActive, true));

        const productMap = new Map(productList.map((p) => [p.id, p]));

        // Validate items and calculate totals
        let subtotal = 0;
        const orderItemsData: {
            productId: number;
            productName: string;
            productPrice: number;
            quantity: number;
        }[] = [];

        for (const item of input.items) {
            const product = productMap.get(item.productId);
            if (!product) {
                throw ApiError.badRequest(`Product ${item.productId} not found`);
            }
            if (product.stock !== null && product.stock < item.quantity) {
                throw ApiError.badRequest(`Insufficient stock for ${product.name}`);
            }

            subtotal += product.price * item.quantity;
            orderItemsData.push({
                productId: product.id,
                productName: product.name,
                productPrice: product.price,
                quantity: item.quantity,
            });
        }

        // Create order
        const [order] = await db
            .insert(orders)
            .values({
                userId: userId || null,
                guestEmail: input.guestEmail,
                guestName: input.guestName,
                guestPhone: input.guestPhone,
                paymentMethod: input.paymentMethod,
                subtotal,
                total: subtotal, // Can add shipping/tax here
                shippingAddress: input.shippingAddress,
                notes: input.notes,
            })
            .returning();

        // Create order items
        await db.insert(orderItems).values(
            orderItemsData.map((item) => ({
                orderId: order.id,
                ...item,
            }))
        );

        // Decrease stock
        for (const item of input.items) {
            const product = productMap.get(item.productId)!;
            await db
                .update(products)
                .set({ stock: (product.stock || 0) - item.quantity })
                .where(eq(products.id, item.productId));
        }

        return this.getOrderById(order.id);
    }

    // Get order by ID with AUTO-DELIVERY check
    async getOrderById(id: number, userId?: string, isAdmin?: boolean) {
        const [order] = await db.select().from(orders).where(eq(orders.id, id));

        if (!order) {
            throw ApiError.notFound("Order not found");
        }

        // AUTO-DELIVERY LOGIC: If shipped > 5 minutes ago, mark as delivered
        if (order.status === 'shipped' && order.updatedAt) {
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
            if (new Date(order.updatedAt) < fiveMinutesAgo) {
                // Auto update to delivered
                await this.updateOrderStatus(order.id, 'delivered');
                // Refresh order data
                const [updatedOrder] = await db.select().from(orders).where(eq(orders.id, id));
                Object.assign(order, updatedOrder);
            }
        }

        // Check ownership if not admin
        if (!isAdmin && userId && order.userId !== userId) {
            throw ApiError.forbidden("Access denied");
        }

        // Get order items
        const items = await db
            .select()
            .from(orderItems)
            .where(eq(orderItems.orderId, id));

        return { ...order, items };
    }

    // Customer manually receives order
    async receiveOrder(id: number) {
        const [order] = await db.select().from(orders).where(eq(orders.id, id));
        if (!order) throw ApiError.notFound("Order not found");

        if (order.status !== 'shipped' && order.status !== 'processing') {
            // Optional: Allow receiving even if still processing, but usually shipped is the prereq
            // For flexibility let's allow it if it's not pending/cancelled
        }

        return await this.updateOrderStatus(id, 'delivered');
    }

    // Add rating to order and products
    async addOrderRating(id: number, input: {
        deliveryRating: number;
        deliveryFeedback?: string;
        productRatings: { productId: number; rating: number; comment?: string }[];
        userId?: string;
        guestName?: string;
    }) {
        const [order] = await db.select().from(orders).where(eq(orders.id, id));
        if (!order) throw ApiError.notFound("Order not found");

        // Update delivery rating
        await db.update(orders)
            .set({
                deliveryRating: input.deliveryRating,
                deliveryFeedback: input.deliveryFeedback
            })
            .where(eq(orders.id, id));

        // Insert product reviews
        // Note: In real app, might want to check if user already reviewed these products for this order
        // For now, allow multiple reviews or assume frontend handles duplication prevention
        const reviewsToInsert = input.productRatings.map(r => ({
            productId: r.productId,
            userId: input.userId || null,
            guestName: input.guestName || order.guestName || "Guest",
            rating: r.rating,
            comment: r.comment,
            isApproved: true, // Auto-approve for now
            createdAt: new Date()
        }));

        if (reviewsToInsert.length > 0) {
            // Import reviews schema here to avoid circular dep issues if any, or just use commonly imported one
            // Assuming imports are fine at top level
            await db.insert(reviews).values(reviewsToInsert);
        }

        return { message: "Rating submitted successfully" };
    }

    // Get user's orders
    async getUserOrders(userId: string) {
        const userOrders = await db
            .select()
            .from(orders)
            .where(eq(orders.userId, userId))
            .orderBy(desc(orders.createdAt));

        return userOrders;
    }

    // Get all orders (admin)
    async getAllOrders(options: { page?: number; limit?: number; status?: string }) {
        const { page = 1, limit = 20, status } = options;
        const offset = (page - 1) * limit;

        let query = db.select().from(orders);

        if (status) {
            query = query.where(eq(orders.status, status as any)) as typeof query;
        }

        return await query.orderBy(desc(orders.createdAt)).limit(limit).offset(offset);
    }

    // Update order status (admin)
    async updateOrderStatus(
        id: number,
        status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled"
    ) {
        const updateData: Record<string, unknown> = {
            status,
            updatedAt: new Date(),
        };

        // If marking as paid, update payment status
        if (status === "paid") {
            updateData.paymentStatus = "completed";
        }

        const [order] = await db
            .update(orders)
            .set(updateData)
            .where(eq(orders.id, id))
            .returning();

        if (!order) {
            throw ApiError.notFound("Order not found");
        }

        // If order is marked as paid, create a cash transaction for HO! Finance
        if (status === "paid") {
            await this.createCashTransactionFromOrder(order);
        }

        return order;
    }

    // Create cash transaction from order for HO! Finance sync
    private async createCashTransactionFromOrder(order: typeof orders.$inferSelect) {
        // Get order items for description
        const items = await db
            .select()
            .from(orderItems)
            .where(eq(orderItems.orderId, order.id));

        const itemsDescription = items
            .map((i) => `${i.productName} x${i.quantity}`)
            .join(", ");

        // Map payment method to enum value
        const paymentMethodMap: Record<string, string> = {
            cash: "cash",
            qris: "qris",
            transfer: "transfer",
            shopeepay: "shopeepay",
            gopay: "gopay",
            ovo: "ovo",
        };

        // Determine source (default to website)
        const source = "website";

        await db.insert(cashTransactions).values({
            type: "income",
            amount: order.total,
            description: `Order #${order.id}: ${itemsDescription}`,
            paymentMethod: paymentMethodMap[order.paymentMethod?.toLowerCase() || "cash"] as any || "cash",
            source: source as any,
            orderId: order.id,
            createdBy: order.userId,
        });
    }
}

export const orderService = new OrderService();

