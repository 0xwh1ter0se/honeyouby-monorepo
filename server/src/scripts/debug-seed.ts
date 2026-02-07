import { auth } from "../config/auth.js";
import fs from "fs";

async function debugCreate() {
    try {
        console.log("Adding user...");
        await auth.api.signUpEmail({
            body: {
                email: "testdebug@honeyouby.com",
                password: "password123",
                name: "Debug User"
            }
        });
        console.log("Success");
    } catch (e: any) {
        console.error("Failed");
        fs.writeFileSync("seed-error.log", JSON.stringify(e, Object.getOwnPropertyNames(e), 2));
    }
    process.exit(0);
}

debugCreate();
