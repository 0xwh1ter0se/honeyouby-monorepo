import { auth } from "../config/auth.js";
import { db } from "../config/database.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

async function createUsers() {
    console.log("🌱 Seeding users...");

    const usersToCreate = [
        {
            email: "admin@honeyouby.com",
            password: "adminho12",
            name: "Admin Ouby",
            role: "owner", // Using 'owner' based on Login.tsx logic
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

    for (const u of usersToCreate) {
        try {
            // Check if user exists
            const existingUser = await db.select().from(users).where(eq(users.email, u.email));

            if (existingUser.length > 0) {
                console.log(`User ${u.email} already exists. Skipping...`);
                // Optional: Update password if needed, but signUpEmail is for creation.
                // To update password, we'd need sign in then change password, or direct DB update (not recommended for hashed passwords)
                continue;
            }

            const user = await auth.api.signUpEmail({
                body: {
                    email: u.email,
                    password: u.password,
                    name: u.name,
                    image: u.image
                }
            });

            // Update role manually since signUpEmail might not set it (or we need to pass it in metadata if supported)
            // Better-auth might support additional fields in signUp, but let's force update to be sure
            if (user?.user?.id) {
                await db.update(users)
                    .set({ role: u.role as any })
                    .where(eq(users.id, user.user.id));
                console.log(`✅ Created user: ${u.email} (${u.role})`);
            } else {
                console.log(`⚠️ Failed to retrieve ID for ${u.email}`);
            }

        } catch (error: any) {
            console.error(`❌ Error creating ${u.email}:`, error.message);
        }
    }

    console.log("✨ Seeding complete!");
    process.exit(0);
}

createUsers();
