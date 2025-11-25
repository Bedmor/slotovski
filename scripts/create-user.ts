import { hash } from "bcryptjs";
import { db } from "../src/server/db";

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.log("Usage: npx tsx scripts/create-user.ts <email> <password>");
    process.exit(1);
  }

  const hashedPassword = await hash(password, 10);

  try {
    const user = await db.user.create({
      data: {
        email,
        name: email.split("@")[0],
        password: hashedPassword,
      },
    });
    console.log(`User created successfully: ${user.email}`);
  } catch (e) {
    console.error("Error creating user:", e);
  }
}

main();
