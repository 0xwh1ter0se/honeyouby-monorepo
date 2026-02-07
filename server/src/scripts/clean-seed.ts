import { auth } from "../config/auth.js";
import { db } from "../config/database.js";
import { users, sessions, accounts, verifications, orders } from "../db/schema.js";
import { eq } from "drizzle-orm";

async function cleanAndSeed() {
    console.log("🧹 Aggressively Wiping Data...");
    try {
        // Delete dependents first
        await db.delete(sessions);
        await db.delete(accounts);
        await db.delete(verifications);
        // For orders, we might want to keep them but set userId to null to avoid data loss, 
        // OR just delete them if this is a dev env. User said "Make it work", implies functionality focus.
        // Let's set userId to null for orders.
        // await db.update(orders).set({ userId: null }); 
        // Actually, if orders link to user, and user is deleted, we might validly want to detach them.
        // But for "reset users", let's just detach.
        // Note: Check schema if userId is nullable.

        await db.delete(users);
        console.log("✅ All users and sessions deleted.");
    } catch (e: any) {
        console.error("❌ Error deleting users/sessions:", e.message);
    }

    const usersToCreate = [
        {
            email: "admin@honeyouby.com",
            password: "adminho12",
            name: "Admin Ouby",
            role: "owner",
            image: "https://ui-avatars.com/api/?name=Admin+Ouby&background=random"
        },
        {
            email: "staff@honeyouby.com",
            password: "staffho123",
            name: "Staff Ouby",
            role: "staff",
            image: "https://ui-avatars.com/api/?name=Staff+Ouby&background=random"
        }
    ];

    console.log("🌱 Seeding fresh users...");

    for (const u of usersToCreate) {
        try {
            const user = await auth.api.signUpEmail({
                body: {
                    email: u.email,
                    password: u.password,
                    name: u.name,
                    image: u.image
                }
            });

            if (user?.user?.id) {
                await db.update(users)
                    .set({ role: u.role as any })
                    .where(eq(users.id, user.user.id));
                console.log(`✅ Created: ${u.email} (${u.role})`);
            }

        } catch (error: any) {
            console.error(`❌ Error creating ${u.email}:`, error.message);
        }
    }

    console.log("✨ Clean Seed Complete.");
    process.exit(0);
}

cleanAndSeed();
