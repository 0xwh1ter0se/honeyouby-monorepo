// Re-export all schema types for convenience
export type {
    // Inferred types from schema
} from "../db/schema.js";

// Custom types for API responses and requests
export interface ApiResponse<T = unknown> {
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ProductWithCategories {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    stock: number | null;
    image: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    category: string[];
}

export interface OrderWithItems {
    id: number;
    userId: string | null;
    guestEmail: string | null;
    guestName: string | null;
    guestPhone: string | null;
    status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | null;
    paymentMethod: string | null;
    paymentStatus: "pending" | "completed" | "failed" | null;
    subtotal: number;
    total: number;
    notes: string | null;
    shippingAddress: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    items: {
        id: number;
        productId: number | null;
        productName: string;
        productPrice: number;
        quantity: number;
    }[];
}
