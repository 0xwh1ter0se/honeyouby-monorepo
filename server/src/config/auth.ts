import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./database.js";
import * as schema from "../db/schema.js";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: schema.users,
            session: schema.sessions,
            account: schema.accounts,
            verification: schema.verifications,
        },
    }),
    emailAndPassword: {
        enabled: true,
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60, // 5 minutes
        },
    },
    advanced: {
        cookiePrefix: "honeyouby-auth",
        crossSubdomainCookies: {
            enabled: true
        },
        defaultCookieAttributes: {
            sameSite: "none",
            secure: true
        }
    },
    trustedOrigins: [
        "https://honeyouby-admin.vercel.app", // Admin
        "https://honeyouby.netlify.app", // Customer Web (Netlify)
        "https://honeyouby-web.vercel.app", // Customer Web (Vercel - just in case)
        process.env.FRONTEND_URL || "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176"
    ],
});
