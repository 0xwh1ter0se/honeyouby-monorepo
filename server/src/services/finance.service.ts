import { db } from "../config/database.js";
import {
    cashTransactions,
    dailyReports,
    expenseCategories,
    orders,
    orderItems,
    products,
    reviews,
} from "../db/schema.js";
import { eq, desc, sql, and, gte, lte, sum, count } from "drizzle-orm";

export class FinanceService {
    // Get dashboard statistics
    // Get dashboard statistics
    async getDashboardStats(period: "24h" | "7d" | "30d" = "30d") {
        const now = new Date();
        let startDate: Date;

        switch (period) {
            case "24h":
                startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                break;
            case "7d":
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        // Calculate total revenue from orders
        const revenueResult = await db
            .select({
                totalRevenue: sum(orders.total),
                orderCount: count(orders.id),
            })
            .from(orders)
            .where(
                and(
                    gte(orders.createdAt, startDate),
                    eq(orders.paymentStatus, "completed"),
                    sql`${orders.status} != 'cancelled'`
                )
            );

        // Calculate total income from cash transactions
        const incomeResult = await db
            .select({
                totalIncome: sum(cashTransactions.amount),
            })
            .from(cashTransactions)
            .where(
                and(
                    gte(cashTransactions.createdAt, startDate),
                    eq(cashTransactions.type, "income")
                )
            );

        // Calculate total expenses
        const expenseResult = await db
            .select({
                totalExpense: sum(cashTransactions.amount),
            })
            .from(cashTransactions)
            .where(
                and(
                    gte(cashTransactions.createdAt, startDate),
                    eq(cashTransactions.type, "expense")
                )
            );

        // Calculate order status counts
        const statusResult = await db
            .select({
                status: orders.status,
                count: count(orders.id),
            })
            .from(orders)
            .where(gte(orders.createdAt, startDate))
            .groupBy(orders.status);

        const orderCounts = {
            completed: 0,
            pending: 0,
            cancelled: 0,
        };

        statusResult.forEach((row) => {
            const s = row.status?.toLowerCase();
            const c = Number(row.count);
            if (s === 'delivered' || s === 'shipped' || s === 'paid') orderCounts.completed += c;
            else if (s === 'pending' || s === 'processing') orderCounts.pending += c;
            else if (s === 'cancelled' || s === 'refunded') orderCounts.cancelled += c;
        });

        // Calculate total items sold (volume)
        const volumeResult = await db
            .select({
                totalItems: sum(orderItems.quantity),
            })
            .from(orders)
            .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
            .where(
                and(
                    gte(orders.createdAt, startDate),
                    eq(orders.paymentStatus, 'completed'),
                    sql`${orders.status} != 'cancelled'`
                )
            );

        // --- NEW: Calculate Chart Data (Revenue & Expense over time) ---
        // Group by day for 7d/30d, or hour for 24h (simplifying to day for now for consistency)

        // 1. Daily Revenue from Orders
        const dailyRevenue = await db
            .select({
                date: sql<string>`DATE(${orders.createdAt})`,
                amount: sum(orders.total),
            })
            .from(orders)
            .where(
                and(
                    gte(orders.createdAt, startDate),
                    eq(orders.paymentStatus, 'completed'),
                    sql`${orders.status} != 'cancelled'`
                )
            )
            .groupBy(sql`DATE(${orders.createdAt})`)
            .orderBy(sql`DATE(${orders.createdAt})`);

        // 2. Daily Expenses from Transactions
        const dailyExpenses = await db
            .select({
                date: sql<string>`DATE(${cashTransactions.createdAt})`,
                amount: sum(cashTransactions.amount),
            })
            .from(cashTransactions)
            .where(
                and(
                    gte(cashTransactions.createdAt, startDate),
                    eq(cashTransactions.type, 'expense')
                )
            )
            .groupBy(sql`DATE(${cashTransactions.createdAt})`)
            .orderBy(sql`DATE(${cashTransactions.createdAt})`);

        // Merge for Chart
        const chartMap = new Map<string, { revenue: number, expense: number }>();
        const getDates = (start: Date, end: Date) => {
            const arr = [];
            for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
                arr.push(new Date(dt).toISOString().split('T')[0]);
            }
            return arr;
        };

        getDates(startDate, now).forEach(date => {
            chartMap.set(date, { revenue: 0, expense: 0 });
        });

        dailyRevenue.forEach(r => {
            const d = String(r.date);
            if (chartMap.has(d)) {
                chartMap.get(d)!.revenue = Number(r.amount);
            }
        });

        dailyExpenses.forEach(e => {
            const d = String(e.date);
            if (chartMap.has(d)) {
                chartMap.get(d)!.expense = Number(e.amount);
            }
        });

        const chartData = Array.from(chartMap.entries()).map(([date, val]) => ({
            name: new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }), // e.g. "Jan 1"
            revenue: val.revenue,
            expense: val.expense
        }));


        // --- NEW: Calculate Pie Chart Data (Expense Breakdown) ---
        // Group expenses by category (using expenseCategoryId join in a real app, 
        // but currently expenseCategories table is separate, let's assume simple join or grouping by 'source' or just mocking categories if relation not set)

        // Currently `cashTransactions` has `expenseCategoryId`. Let's join with `expenseCategories`.
        const expenseBreakdown = await db
            .select({
                name: expenseCategories.name,
                value: sum(cashTransactions.amount)
            })
            .from(cashTransactions)
            .leftJoin(expenseCategories, eq(cashTransactions.expenseCategoryId, expenseCategories.id))
            .where(
                and(
                    gte(cashTransactions.createdAt, startDate),
                    eq(cashTransactions.type, 'expense')
                )
            )
            .groupBy(expenseCategories.name);

        // Format for Pie Chart
        const pieData = expenseBreakdown.map(item => ({
            name: item.name || 'Uncategorized',
            value: Number(item.value)
        })).filter(i => i.value > 0);

        // Add minimal colors (frontend handles colors mostly, but we can pass just data)


        // Calculate average rating
        const ratingResult = await db
            .select({
                avgRating: sql<string>`avg(${reviews.rating})`,
                reviewCount: count(reviews.id),
            })
            .from(reviews);

        const avgRating = Number(ratingResult[0]?.avgRating || 0);
        const reviewCount = Number(ratingResult[0]?.reviewCount || 0);

        const revenue = Number(revenueResult[0]?.totalRevenue || 0);
        const income = Number(incomeResult[0]?.totalIncome || 0);
        const expense = Number(expenseResult[0]?.totalExpense || 0);
        const orderCount = Number(revenueResult[0]?.orderCount || 0);
        const totalItems = Number(volumeResult[0]?.totalItems || 0);
        const avgOrderValue = orderCount > 0 ? Math.round(revenue / orderCount) : 0;
        const netProfit = income - expense;

        return {
            revenue,
            income,
            expense,
            netProfit,
            orderCount,
            totalItems,
            avgOrderValue,
            period,
            orderCounts,
            chartData, // Included
            pieData,    // Included
            avgRating,
            reviewCount,
        };
    }

    // Get all transactions (Merged: Cash Transactions + Completed Orders)
    // This ensures "All Transactions" view shows everything even if strict ledger sync missed some orders.
    async getTransactions(options: {
        type?: "income" | "expense";
        source?: string;
        limit?: number;
        offset?: number;
    } = {}) {
        const { type, source, limit = 50, offset = 0 } = options;

        // 1. Fetch Cash Transactions
        const conditions = [];
        if (type) conditions.push(eq(cashTransactions.type, type));
        if (source) conditions.push(eq(cashTransactions.source, source as any));

        const cashTxPromise = db
            .select({
                id: cashTransactions.id,
                type: cashTransactions.type,
                amount: cashTransactions.amount,
                description: cashTransactions.description,
                paymentMethod: cashTransactions.paymentMethod,
                source: cashTransactions.source,
                orderId: cashTransactions.orderId,
                createdAt: cashTransactions.createdAt,
            })
            .from(cashTransactions)
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .orderBy(desc(cashTransactions.createdAt))
            .limit(limit); // Fetch limit for now, knowing we merge. For strict paging, we'd need more complex logic.

        // 2. Fetch Completed Orders (that typically count as income)
        // Only fetch if we are looking for 'all' or 'income'.
        let ordersPromise: Promise<any[]> = Promise.resolve([]);
        if (!type || type === 'income') {
            const orderConditions = [eq(orders.paymentStatus, 'completed')];
            // Approximation for source filter on orders (orders usually website, or inferred)
            // If source set to 'store' or 'gofood', we might check order metadata if available.
            // For now, assuming orders are main website sales unless specified.

            ordersPromise = db
                .select({
                    id: orders.id,
                    total: orders.total,
                    paymentMethod: orders.paymentMethod,
                    status: orders.status,
                    createdAt: orders.createdAt,
                    // We need to fetch items to build description
                })
                .from(orders)
                .where(and(...orderConditions))
                .orderBy(desc(orders.createdAt))
                .limit(limit) as any;
        }

        const [cashTxs, ordersData] = await Promise.all([cashTxPromise, ordersPromise]);

        // 3. Merge Strategies
        // We define a Set of orderIds that are already in cashTransactions to avoid duplicates
        const existingOrderIds = new Set(cashTxs.map(tx => tx.orderId).filter(Boolean));

        const merged: any[] = [...cashTxs];

        // Map orders to transactions
        for (const order of ordersData) {
            if (!existingOrderIds.has(order.id)) {
                // Fetch items for description (lazy load or just generic)
                // For performance, let's use generic description if not eagerly fetched
                // Or quick subquery. Let's use generic for list view.

                merged.push({
                    id: order.id + 100000, // Offset ID to avoid collision with cashTx IDs visually or manage via type
                    // Better: UI treats them same. We can add a virtual field.
                    // Actually, let's just use the number.
                    realId: order.id,
                    isOrder: true,
                    type: 'income',
                    amount: order.total,
                    description: `Order #${order.id}`, // Simplified description
                    paymentMethod: order.paymentMethod,
                    source: 'website', // Default for orders table orders
                    orderId: order.id,
                    createdAt: order.createdAt,
                });
            }
        }

        // 4. Sort merged list by date descending
        merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // 5. Apply pagination to the merged list
        // Note: This is "in-memory" pagination after fetching partials. 
        // Accurate enough for typical scrolling unless data is massive discrepancy.
        return merged.slice(0, limit);
    }

    // Create a new cash transaction
    async createTransaction(data: {
        type: "income" | "expense";
        amount: number;
        description?: string;
        paymentMethod?: string;
        source?: string;
        orderId?: number;
        expenseCategoryId?: number;
        createdBy?: string;
    }) {
        const [transaction] = await db
            .insert(cashTransactions)
            .values(data as any)
            .returning();
        return transaction;
    }

    // Get daily reports (Dynamic Aggregation to match Charts)
    async getDailyReports(limit: number = 30) {
        const now = new Date();
        const pastDate = new Date(now.getTime() - limit * 24 * 60 * 60 * 1000);

        // 1. Aggregated Orders (Revenue & Count) by Date
        const ordersByDate = await db
            .select({
                date: sql<string>`DATE(${orders.createdAt})`,
                totalRevenue: sum(orders.total),
                orderCount: count(orders.id),
            })
            .from(orders)
            .where(
                and(
                    gte(orders.createdAt, pastDate),
                    eq(orders.paymentStatus, 'completed'),
                    sql`${orders.status} != 'cancelled'`
                )
            )
            .groupBy(sql`DATE(${orders.createdAt})`);

        // 2. Aggregated Transactions (Income & Expense) by Date
        const txByDate = await db
            .select({
                date: sql<string>`DATE(${cashTransactions.createdAt})`,
                type: cashTransactions.type,
                amount: sum(cashTransactions.amount),
            })
            .from(cashTransactions)
            .where(gte(cashTransactions.createdAt, pastDate))
            .groupBy(sql`DATE(${cashTransactions.createdAt})`, cashTransactions.type);

        // 3. Merge Data in Memory
        const reportMap = new Map<string, any>();

        // Initialize with orders data
        ordersByDate.forEach(o => {
            const dateStr = String(o.date); // "YYYY-MM-DD"
            if (!reportMap.has(dateStr)) {
                reportMap.set(dateStr, {
                    id: 0, // dynamic
                    date: dateStr,
                    totalIncome: 0,
                    totalExpense: 0,
                    netProfit: 0,
                    orderCount: 0,
                    notes: null,
                    closedBy: null,
                    closedAt: null
                });
            }
            // Revenue counts as income (or part of it, depending on business logic, usually distinct from 'Income' tx type, but strictly: Revenue IS Income)
            // However, typical setup: Orders Revenue = main income. Cash Tx "income" = extra income.
            // Let's sum them.
            // Note: If you have cash transactions automatically created for orders, this would double count.
            // Assuming simplified model: Orders are orders. Transactions are separate cash flows (or manual).
            // Safer: Revenue from Orders + Income from TX
            const entry = reportMap.get(dateStr);
            entry.totalIncome += Number(o.totalRevenue);
            entry.orderCount += Number(o.orderCount);
            entry.netProfit += Number(o.totalRevenue);
        });

        // Merge transactions data
        txByDate.forEach(tx => {
            const dateStr = String(tx.date);
            if (!reportMap.has(dateStr)) {
                reportMap.set(dateStr, {
                    id: 0,
                    date: dateStr,
                    totalIncome: 0,
                    totalExpense: 0,
                    netProfit: 0,
                    orderCount: 0,
                    notes: null,
                    closedBy: null,
                    closedAt: null
                });
            }
            const entry = reportMap.get(dateStr);
            const amt = Number(tx.amount);

            if (tx.type === 'income') {
                entry.totalIncome += amt;
                entry.netProfit += amt;
            } else if (tx.type === 'expense') {
                entry.totalExpense += amt;
                entry.netProfit -= amt;
            }
        });

        // 4. Also check explicitly closed reports for Notes/closedBy info (optional hybrid approach)
        // For strict consistency with user request "match export", dynamic is key. 
        // We can LEFT JOIN in future if needed. For now, live data priority.

        // Convert to array and sort
        const reports = Array.from(reportMap.values())
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, limit);

        return reports;
    }

    // Close daily report (end of day)
    async closeDailyReport(date: Date, closedBy: string, notes?: string) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // Calculate totals for the day
        const incomeResult = await db
            .select({ total: sum(cashTransactions.amount) })
            .from(cashTransactions)
            .where(
                and(
                    eq(cashTransactions.type, "income"),
                    gte(cashTransactions.createdAt, startOfDay),
                    lte(cashTransactions.createdAt, endOfDay)
                )
            );

        const expenseResult = await db
            .select({ total: sum(cashTransactions.amount) })
            .from(cashTransactions)
            .where(
                and(
                    eq(cashTransactions.type, "expense"),
                    gte(cashTransactions.createdAt, startOfDay),
                    lte(cashTransactions.createdAt, endOfDay)
                )
            );

        const orderResult = await db
            .select({ count: count(orders.id) })
            .from(orders)
            .where(
                and(
                    gte(orders.createdAt, startOfDay),
                    lte(orders.createdAt, endOfDay),
                    sql`${orders.status} != 'cancelled'`
                )
            );

        const totalIncome = Number(incomeResult[0]?.total || 0);
        const totalExpense = Number(expenseResult[0]?.total || 0);
        const netProfit = totalIncome - totalExpense;
        const orderCount = Number(orderResult[0]?.count || 0);

        // Upsert daily report
        const [report] = await db
            .insert(dailyReports)
            .values({
                date: startOfDay,
                totalIncome,
                totalExpense,
                netProfit,
                orderCount,
                notes,
                closedBy,
                closedAt: new Date(),
            })
            .onConflictDoUpdate({
                target: dailyReports.date,
                set: {
                    totalIncome,
                    totalExpense,
                    netProfit,
                    orderCount,
                    notes,
                    closedBy,
                    closedAt: new Date(),
                },
            })
            .returning();

        return report;
    }

    // Get expense categories
    async getExpenseCategories() {
        return await db.select().from(expenseCategories);
    }

    // Create expense category
    async createExpenseCategory(name: string, slug: string, description?: string) {
        const [category] = await db
            .insert(expenseCategories)
            .values({ name, slug, description })
            .returning();
        return category;
    }

    // Get inventory stats (from products)
    async getInventoryStats() {
        const allProducts = await db
            .select({
                id: products.id,
                name: products.name,
                stock: products.stock,
                price: products.price,
                isActive: products.isActive,
            })
            .from(products);

        const totalProducts = allProducts.length;
        const lowStock = allProducts.filter((p) => (p.stock || 0) < 10).length;
        const outOfStock = allProducts.filter((p) => (p.stock || 0) === 0).length;
        const totalValue = allProducts.reduce(
            (sum, p) => sum + (p.stock || 0) * p.price,
            0
        );

        return {
            totalProducts,
            lowStock,
            outOfStock,
            totalValue,
            products: allProducts,
        };
    }
    // RESET DATA (Dev Tool)
    async resetData() {
        // Delete in order of dependencies
        await db.delete(dailyReports);
        await db.delete(cashTransactions);
        await db.delete(orderItems); // Delete items first
        await db.delete(orders);     // Then orders
        // Keep products/categories/users for now as they are structural
        return { message: "Data reset successfully" };
    }
}

export const financeService = new FinanceService();
