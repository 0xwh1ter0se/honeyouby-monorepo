import { auth } from "../config/auth.js";
import { db } from "../config/database.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

// Mock request/headers not needed for internal API call if using headers correctly,
// but auth.api.signInEmail might expect context.
// Actually better-auth exposes a client for node, or we can use the internal API.

async function checkLogin() {
    console.log("🕵️ Checking login for admin@honeyouby.com...");

    try {
        // Direct DB check for user existence
        const user = await db.select().from(users).where(eq(users.email, "admin@honeyouby.com"));
        if (user.length === 0) {
            console.error("❌ User not found in database!");
            process.exit(1);
        }
        console.log("✅ User found in DB:", user[0].email, user[0].role);

        // API Sign In check requires a request context usually, 
        // but we can try to fetch the endpoint locally to simulate a client.

        const response = await fetch("http://localhost:3001/api/auth/sign-in/email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: "admin@honeyouby.com",
                password: "adminho12"
            })
        });

        if (response.ok) {
            const data = await response.json() as any;
            console.log("✅ Login SUCCESS via API!");
            console.log("   User:", data.user?.email);
            console.log("   Session Token received.");
        } else {
            const err = await response.text();
            console.error("❌ Login FAILED via API.");
            console.error("   Status:", response.status);
            console.error("   Response:", err);
        }

    } catch (e: any) {
        console.error("❌ Error during check:", e.message);
    }
    process.exit(0);
}

checkLogin();
