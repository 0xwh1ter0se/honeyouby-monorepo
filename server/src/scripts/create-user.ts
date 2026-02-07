import { db } from "../config/database.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

async function createUsers() {
    console.log("Creating/Updating Admin Users...");

    const usersToCreate = [
        {
            email: "owner@honeyouby.com",
            name: "Owner Account",
            role: "owner" as const,
            image: "https://ui-avatars.com/api/?name=Owner&background=random"
        },
        {
            email: "staff@honeyouby.com",
            name: "Staff Member",
            role: "staff" as const,
            image: "https://ui-avatars.com/api/?name=Staff&background=random"
        },
        {
            email: "admin@honeyouby.com",
            name: "Admin System",
            role: "admin" as const,
            image: "https://ui-avatars.com/api/?name=Admin&background=random"
        }
    ];

    for (const u of usersToCreate) {
        // Check if exists
        const [existing] = await db.select().from(users).where(eq(users.email, u.email));

        if (existing) {
            console.log(`User ${u.email} exists, updating role...`);
            await db.update(users).set({ role: u.role }).where(eq(users.email, u.email));
        } else {
            console.log(`Creating user ${u.email}...`);
            await db.insert(users).values({
                id: randomUUID(),
                email: u.email,
                name: u.name,
                role: u.role,
                emailVerified: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                image: u.image
            });
        }
    }

    console.log("Done! You can now login with these emails.");
    process.exit(0);
}

createUsers().catch(console.error);
