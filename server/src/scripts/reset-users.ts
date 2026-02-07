import { auth } from "../config/auth.js";
import { db } from "../config/database.js";
import { users } from "../db/schema.js";
import { eq, inArray } from "drizzle-orm";

async function resetUsers() {
    console.log("🔄 Resetting admin and staff users...");

    const targetEmails = ["admin@honeyouby.com", "staff@honeyouby.com"];

    // 1. Delete existing users to clear old passwords
    try {
        const deleted = await db.delete(users)
            .where(inArray(users.email, targetEmails))
            .returning({ email: users.email });

        console.log(`🗑️ Deleted ${deleted.length} existing users.`);
        deleted.forEach(u => console.log(`   - ${u.email}`));
    } catch (e) {
        console.error("Error deleting users:", e);
    }

    // 2. Re-create users with correct passwords
    const usersToCreate = [
        {
            email: "admin@honeyouby.com",
            password: "adminho12", // The requested password
            name: "Admin Ouby",
            role: "owner",
            image: "https://ui-avatars.com/api/?name=Admin+Ouby&background=random"
        },
        {
            email: "staff@honeyouby.com",
            password: "staffho123", // The requested password
            name: "Staff Ouby",
            role: "staff",
            image: "https://ui-avatars.com/api/?name=Staff+Ouby&background=random"
        }
    ];

    console.log("🌱 Re-seeding users with fresh credentials...");

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
                // Force update role
                await db.update(users)
                    .set({ role: u.role as any })
                    .where(eq(users.id, user.user.id));
                console.log(`✅ Created/Reset user: ${u.email} (${u.role})`);
            } else {
                console.log(`⚠️ Failed to retrieve ID for ${u.email} (Creation might have failed silentyl)`);
            }

        } catch (error: any) {
            console.error(`❌ Error creating ${u.email}:`, error.message);
        }
    }

    console.log("✨ Reset complete! Please try logging in now.");
    process.exit(0);
}

resetUsers();
