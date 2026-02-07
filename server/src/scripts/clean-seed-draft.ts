import { auth } from "../config/auth.js";
import { db } from "../config/database.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

async function cleanAndSeed() {
    console.log("🧹 Wiping ALL users...");
    try {
        await db.delete(users);
        console.log("✅ All users deleted.");
    } catch (e: any) {
        console.error("❌ Error deleting users:", e.message);
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
                // Manually set role because signUp might not accept it in body depending on config
                // We must use the ID from the created user
                const result = await db.update(users)
                    .set({ role: u.role as any })
                    .where(eq(users.id, user.user.id))
                // Drizzle .where(eq(users.id, ...))

                // Wait, use imports for eq
            }
        } catch (error: any) {
            console.error(`❌ Error creating ${u.email}:`, error.message);
        }
    }
}
// ... wait, I need proper imports for 'eq' in the file content above.
// I will rewrite this properly in the next tool call.
