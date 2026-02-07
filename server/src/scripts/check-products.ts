import { db } from "../config/database.js";
import { products } from "../db/schema.js";
import { count } from "drizzle-orm";

async function checkProducts() {
    try {
        const result = await db.select({ count: count() }).from(products);
        console.log("Product count:", result[0].count);

        if (Number(result[0].count) > 0) {
            const items = await db.select().from(products).limit(3);
            console.log("Sample items:", items);
        } else {
            console.log("No products found in DB.");
        }
        process.exit(0);
    } catch (e) {
        console.error("Error checking products:", e);
        process.exit(1);
    }
}

checkProducts();
