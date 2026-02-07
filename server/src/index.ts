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
    origin: (origin, callback) => {
        const allowedOrigins = [
            ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : ["http://localhost:5173"]),
            "http://localhost:5174",
            "http://localhost:5175",
            "http://localhost:5176",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:5174"
        ];

        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
            callback(null, true);
        } else {
            console.log("Blocked by CORS:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
}));
app.use(express.json());

// Auth middleware (attaches user to request if authenticated)
app.use(authMiddleware);

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
