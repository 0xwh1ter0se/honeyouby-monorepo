import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "../config/database.js";
import * as dotenv from "dotenv";

dotenv.config();

async function runMigrations() {
    console.log("🔄 Running migrations...");

    try {
        await migrate(db, { migrationsFolder: "./drizzle/migrations" });
        console.log("✅ Migrations completed successfully!");
    } catch (error) {
        console.error("❌ Migration failed:", error);
        process.exit(1);
    }

    process.exit(0);
}

runMigrations();
