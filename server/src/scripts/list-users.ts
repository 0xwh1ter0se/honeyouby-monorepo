import { db } from "../config/database.js";
import { users } from "../db/schema.js";

async function listUsers() {
    console.log("👥 Listing all users (JSON DUMP)...");
    try {
        const allUsers = await db.select().from(users);
        console.log(JSON.stringify(allUsers, null, 2));
    } catch (e) {
        console.error("Error listing users:", e);
    }
    process.exit(0);
}

listUsers();
