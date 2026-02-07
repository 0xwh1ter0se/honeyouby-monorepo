import { db } from "../config/database.js";
import { sql } from "drizzle-orm";

async function nukeDb() {
    console.log("☢️ NUKING AUTH TABLES...");
    try {
        // Drop tables with CASCADE to remove dependents (sessions, accounts, foreign keys)
        await db.execute(sql`DROP TABLE IF EXISTS users CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS sessions CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS accounts CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS verifications CASCADE`);

        // Also drop other tables that might reference users if schema push fails later
        // But likely users CASCADE handled it.
        // Let's be safe and only drop auth stuff first. 
        // If orders reference users, CASCADE on users will remove the FK constraint or the rows (depending on definition, but DROP TABLE CASCADE removes the constraint).

        console.log("✅ Tables dropped.");
    } catch (e: any) {
        console.error("❌ Error dropping tables:", e.message);
    }
    process.exit(0);
}

nukeDb();
