import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import routes from "./routes/index.js";
import { authMiddleware } from "./middleware/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Trust Proxy (Required for Vercel/Render/Heroku)
app.set('trust proxy', 1);

// Debug Middleware (Log every request origin)
app.use((req, res, next) => {
    console.log(`[Request] ${req.method} ${req.path}`);
    console.log(`[Origin] ${req.headers.origin}`);
    console.log(`[Frontend URL Env] ${process.env.FRONTEND_URL}`);
    next();
});

// Middleware
app.use(cors({
    origin: true, // REFLECT REQUEST ORIGIN (Temp Fix for Debugging)
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
}));
app.use(express.json());

import { toNodeHandler } from "better-auth/node";
import { auth } from "./config/auth.js";

// ...

// Auth middleware (attaches user to request if authenticated)
app.use(authMiddleware);

// Better Auth Handler (Mounted directly to preserve full path)
app.all("/api/auth/*", toNodeHandler(auth));

// API Routes
app.use("/api", routes);

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

import { db } from "./config/database.js";
import { users } from "./db/schema.js";

// Debug Endpoint (Temporary)
app.get("/api/debug", async (req, res) => {
    try {
        const userCount = await db.select().from(users).limit(1);
        res.json({
            status: "connected",
            db_url_set: !!process.env.DATABASE_URL,
            db_url_prefix: process.env.DATABASE_URL?.substring(0, 15) + "...",
            user_count_check: userCount.length,
            frontend_url: process.env.FRONTEND_URL,
            better_auth_url: process.env.BETTER_AUTH_URL
        });
    } catch (error: any) {
        res.status(500).json({
            status: "error",
            message: error.message,
            stack: error.stack
        });
    }
});

// Error handler (must be last)
app.use(errorHandler);

// Start server if not running on Vercel
if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`🍠 HoneyOuby API server running on http://localhost:${PORT}`);
        console.log(`📚 API routes available at http://localhost:${PORT}/api`);
    });
}
// Vercel requires exporting the app
export default app;
