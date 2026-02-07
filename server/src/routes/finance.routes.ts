import { Router, Request, Response } from "express";
import { financeService } from "../services/finance.service.js";

const router = Router();

// GET /api/finance/stats - Dashboard statistics
router.get("/stats", async (req: Request, res: Response) => {
    try {
        const period = (req.query.period as "24h" | "7d" | "30d") || "30d";
        const stats = await financeService.getDashboardStats(period);
        res.json(stats);
    } catch (error) {
        console.error("Error fetching finance stats:", error);
        res.status(500).json({ error: "Failed to fetch statistics" });
    }
});

// GET /api/finance/transactions - List transactions
router.get("/transactions", async (req: Request, res: Response) => {
    try {
        const { type, source, limit, offset } = req.query;
        const transactions = await financeService.getTransactions({
            type: type as "income" | "expense" | undefined,
            source: source as string | undefined,
            limit: limit ? parseInt(limit as string) : undefined,
            offset: offset ? parseInt(offset as string) : undefined,
        });
        res.json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});

// POST /api/finance/transactions - Create transaction
router.post("/transactions", async (req: Request, res: Response) => {
    try {
        const { type, amount, description, paymentMethod, source, orderId, expenseCategoryId } = req.body;

        if (!type || !amount) {
            return res.status(400).json({ error: "Type and amount are required" });
        }

        const transaction = await financeService.createTransaction({
            type,
            amount,
            description,
            paymentMethod,
            source,
            orderId,
            expenseCategoryId,
        });
        res.status(201).json(transaction);
    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ error: "Failed to create transaction" });
    }
});

// GET /api/finance/daily-reports - List daily reports
router.get("/daily-reports", async (req: Request, res: Response) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 30;
        const reports = await financeService.getDailyReports(limit);
        res.json(reports);
    } catch (error) {
        console.error("Error fetching daily reports:", error);
        res.status(500).json({ error: "Failed to fetch daily reports" });
    }
});

// POST /api/finance/daily-reports/close - Close daily report
router.post("/daily-reports/close", async (req: Request, res: Response) => {
    try {
        const { date, notes } = req.body;
        // TODO: Get closedBy from authenticated user
        const closedBy = req.body.closedBy || null;

        const reportDate = date ? new Date(date) : new Date();
        const report = await financeService.closeDailyReport(reportDate, closedBy, notes);
        res.json(report);
    } catch (error) {
        console.error("Error closing daily report:", error);
        res.status(500).json({ error: "Failed to close daily report" });
    }
});

// GET /api/finance/expense-categories - List expense categories
router.get("/expense-categories", async (req: Request, res: Response) => {
    try {
        const categories = await financeService.getExpenseCategories();
        res.json(categories);
    } catch (error) {
        console.error("Error fetching expense categories:", error);
        res.status(500).json({ error: "Failed to fetch expense categories" });
    }
});

// POST /api/finance/expense-categories - Create expense category
router.post("/expense-categories", async (req: Request, res: Response) => {
    try {
        const { name, slug, description } = req.body;

        if (!name || !slug) {
            return res.status(400).json({ error: "Name and slug are required" });
        }

        const category = await financeService.createExpenseCategory(name, slug, description);
        res.status(201).json(category);
    } catch (error) {
        console.error("Error creating expense category:", error);
        res.status(500).json({ error: "Failed to create expense category" });
    }
});

// GET /api/finance/inventory - Inventory statistics
router.get("/inventory", async (req: Request, res: Response) => {
    try {
        const stats = await financeService.getInventoryStats();
        res.json(stats);
    } catch (error) {
        console.error("Error fetching inventory stats:", error);
        res.status(500).json({ error: "Failed to fetch inventory statistics" });
    }
});

// DELETE /api/finance/reset - Reset all transaction/order data (Dev only)
router.delete("/reset", async (req: Request, res: Response) => {
    try {
        await financeService.resetData();
        res.json({ message: "All finance and order data has been reset." });
    } catch (error) {
        console.error("Error resetting data:", error);
        res.status(500).json({ error: "Failed to reset data" });
    }
});

export default router;
