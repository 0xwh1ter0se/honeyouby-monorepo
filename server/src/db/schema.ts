import {
    pgTable,
    serial,
    varchar,
    text,
    integer,
    boolean,
    timestamp,
    uuid,
    primaryKey,
    pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum("user_role", ["customer", "admin", "owner", "staff"]);
export const orderStatusEnum = pgEnum("order_status", [
    "pending",
    "paid",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
]);
export const paymentStatusEnum = pgEnum("payment_status", [
    "pending",
    "completed",
    "failed",
]);

// Users (Better Auth compatible)
export const users = pgTable("users", {
    id: text("id").primaryKey(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    emailVerified: boolean("email_verified").default(false),
    name: varchar("name", { length: 255 }),
    image: varchar("image", { length: 255 }),
    phone: varchar("phone", { length: 50 }),
    role: userRoleEnum("role").default("customer"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// Better Auth Sessions
export const sessions = pgTable("sessions", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    token: varchar("token", { length: 255 }).unique().notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// Better Auth Accounts (for OAuth)
export const accounts = pgTable("accounts", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    accountId: varchar("account_id", { length: 255 }).notNull(),
    providerId: varchar("provider_id", { length: 255 }).notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    idToken: text("id_token"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// Better Auth Verifications
export const verifications = pgTable("verifications", {
    id: text("id").primaryKey(),
    identifier: varchar("identifier", { length: 255 }).notNull(),
    value: varchar("value", { length: 255 }).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// Categories
export const categories = pgTable("categories", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).unique().notNull(),
    slug: varchar("slug", { length: 100 }).unique().notNull(),
});

// Products
export const products = pgTable("products", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).unique().notNull(),
    description: text("description"),
    price: integer("price").notNull(), // in Rupiah
    stock: integer("stock").default(0),
    image: varchar("image", { length: 255 }),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// Product-Category Junction
export const productCategories = pgTable(
    "product_categories",
    {
        productId: integer("product_id")
            .notNull()
            .references(() => products.id, { onDelete: "cascade" }),
        categoryId: integer("category_id")
            .notNull()
            .references(() => categories.id, { onDelete: "cascade" }),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.productId, t.categoryId] }),
    })
);

// Orders
export const orders = pgTable("orders", {
    id: serial("id").primaryKey(),
    userId: text("user_id").references(() => users.id),
    guestEmail: varchar("guest_email", { length: 255 }),
    guestName: varchar("guest_name", { length: 255 }),
    guestPhone: varchar("guest_phone", { length: 50 }),
    status: orderStatusEnum("status").default("pending"),
    paymentMethod: varchar("payment_method", { length: 50 }),
    paymentStatus: paymentStatusEnum("payment_status").default("pending"),
    subtotal: integer("subtotal").notNull(),
    total: integer("total").notNull(),
    notes: text("notes"),
    shippingAddress: text("shipping_address"),
    // Rating
    deliveryRating: integer("delivery_rating"),
    deliveryFeedback: text("delivery_feedback"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// Order Items
export const orderItems = pgTable("order_items", {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
        .notNull()
        .references(() => orders.id, { onDelete: "cascade" }),
    productId: integer("product_id").references(() => products.id),
    productName: varchar("product_name", { length: 255 }).notNull(),
    productPrice: integer("product_price").notNull(),
    quantity: integer("quantity").notNull(),
});

// Reviews
export const reviews = pgTable("reviews", {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
        .notNull()
        .references(() => products.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => users.id),
    guestName: varchar("guest_name", { length: 255 }),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    isApproved: boolean("is_approved").default(false),
    createdAt: timestamp("created_at").defaultNow(),
});

// Blogs
export const blogs = pgTable("blogs", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).unique().notNull(),
    excerpt: text("excerpt"),
    content: text("content"),
    image: varchar("image", { length: 255 }),
    isPublished: boolean("is_published").default(false),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// Carousels (Ads/Banners)
export const carousels = pgTable("carousels", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    image: varchar("image", { length: 255 }),
    backgroundColor: varchar("background_color", { length: 50 }),
    linkUrl: varchar("link_url", { length: 255 }),
    sortOrder: integer("sort_order").default(0),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
});

// Contact Messages
export const contactMessages = pgTable("contact_messages", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 50 }),
    message: text("message").notNull(),
    isRead: boolean("is_read").default(false),
    createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
    sessions: many(sessions),
    accounts: many(accounts),
    orders: many(orders),
    reviews: many(reviews),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
    user: one(users, {
        fields: [accounts.userId],
        references: [users.id],
    }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
    productCategories: many(productCategories),
}));

export const productsRelations = relations(products, ({ many }) => ({
    productCategories: many(productCategories),
    orderItems: many(orderItems),
    reviews: many(reviews),
}));

export const productCategoriesRelations = relations(
    productCategories,
    ({ one }) => ({
        product: one(products, {
            fields: [productCategories.productId],
            references: [products.id],
        }),
        category: one(categories, {
            fields: [productCategories.categoryId],
            references: [categories.id],
        }),
    })
);

export const ordersRelations = relations(orders, ({ one, many }) => ({
    user: one(users, {
        fields: [orders.userId],
        references: [users.id],
    }),
    items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
    order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id],
    }),
    product: one(products, {
        fields: [orderItems.productId],
        references: [products.id],
    }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
    product: one(products, {
        fields: [reviews.productId],
        references: [products.id],
    }),
    user: one(users, {
        fields: [reviews.userId],
        references: [users.id],
    }),
}));

// ============================================
// FINANCE TABLES (HO! Finance Integration)
// ============================================

// Finance Enums
export const transactionTypeEnum = pgEnum("transaction_type", ["income", "expense"]);
export const paymentMethodEnum = pgEnum("payment_method", [
    "cash",
    "qris",
    "transfer",
    "shopeepay",
    "gopay",
    "ovo",
]);
export const transactionSourceEnum = pgEnum("transaction_source", [
    "store",
    "gofood",
    "grabfood",
    "shopeefood",
    "website",
    "other",
]);

// Expense Categories
export const expenseCategories = pgTable("expense_categories", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).unique().notNull(),
    slug: varchar("slug", { length: 100 }).unique().notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow(),
});

// Cash Transactions (Daily income/expense tracking)
export const cashTransactions = pgTable("cash_transactions", {
    id: serial("id").primaryKey(),
    type: transactionTypeEnum("type").notNull(),
    amount: integer("amount").notNull(), // in Rupiah
    description: text("description"),
    paymentMethod: paymentMethodEnum("payment_method"),
    source: transactionSourceEnum("source"),
    // Link to order if this transaction is from a sale
    orderId: integer("order_id").references(() => orders.id),
    // Link to expense category if this is an expense
    expenseCategoryId: integer("expense_category_id").references(() => expenseCategories.id),
    // Who created this transaction
    createdBy: text("created_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow(),
});

// Daily Reports (End-of-day summary)
export const dailyReports = pgTable("daily_reports", {
    id: serial("id").primaryKey(),
    date: timestamp("date").unique().notNull(),
    totalIncome: integer("total_income").default(0),
    totalExpense: integer("total_expense").default(0),
    netProfit: integer("net_profit").default(0),
    orderCount: integer("order_count").default(0),
    notes: text("notes"),
    closedBy: text("closed_by").references(() => users.id),
    closedAt: timestamp("closed_at"),
    createdAt: timestamp("created_at").defaultNow(),
});

// Finance Relations
export const expenseCategoriesRelations = relations(expenseCategories, ({ many }) => ({
    cashTransactions: many(cashTransactions),
}));

export const cashTransactionsRelations = relations(cashTransactions, ({ one }) => ({
    order: one(orders, {
        fields: [cashTransactions.orderId],
        references: [orders.id],
    }),
    expenseCategory: one(expenseCategories, {
        fields: [cashTransactions.expenseCategoryId],
        references: [expenseCategories.id],
    }),
    createdByUser: one(users, {
        fields: [cashTransactions.createdBy],
        references: [users.id],
    }),
}));

export const dailyReportsRelations = relations(dailyReports, ({ one }) => ({
    closedByUser: one(users, {
        fields: [dailyReports.closedBy],
        references: [users.id],
    }),
}));
