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

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`🍠 HoneyOuby API server running on http://localhost:${PORT}`);
    console.log(`📚 API routes available at http://localhost:${PORT}/api`);
});

export default app;
