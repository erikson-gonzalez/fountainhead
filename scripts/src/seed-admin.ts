import bcrypt from "bcryptjs";
import { db, adminUsersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const SALT_ROUNDS = 12;

async function seedAdmin() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.error("❌ ADMIN_USERNAME and ADMIN_PASSWORD are required.");
    console.error("   Example: ADMIN_USERNAME=tom-admin ADMIN_PASSWORD=your-secure-password pnpm db:seed-admin");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("❌ Password must be at least 8 characters.");
    process.exit(1);
  }

  console.log("🔐 Creating admin credentials...");

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const [existing] = await db
    .select()
    .from(adminUsersTable)
    .where(eq(adminUsersTable.username, username))
    .limit(1);

  if (existing) {
    await db
      .update(adminUsersTable)
      .set({ passwordHash })
      .where(eq(adminUsersTable.username, username));
    console.log(`✅ Admin '${username}' password updated.`);
  } else {
    await db.insert(adminUsersTable).values({ username, passwordHash });
    console.log(`✅ Admin '${username}' created successfully.`);
  }
}

seedAdmin()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed:", err);
    process.exit(1);
  });
