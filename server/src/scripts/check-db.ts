import { db } from "../config/database.js";
import { products } from "../db/schema.js";

async function check() {
    console.log("🔍 Checking products in DB...");
    const allProducts = await db.select().from(products);

    allProducts.forEach(p => {
        console.log(`Product: ${p.name}, Image: '${p.image}', ID: ${p.id}`);
    });

    process.exit(0);
}

check();
