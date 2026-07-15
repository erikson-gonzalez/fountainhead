import bcrypt from "bcryptjs";
import { db, portalUsersTable, portalAccessTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const SALT_ROUNDS = 12;

async function seedPortalTestUser() {
  const email = process.env.PORTAL_EMAIL?.trim().toLowerCase();
  const password = process.env.PORTAL_PASSWORD;
  const name = process.env.PORTAL_NAME || "Test Student";

  if (!email || !password) {
    console.error("❌ PORTAL_EMAIL and PORTAL_PASSWORD are required.");
    console.error("   Example: PORTAL_EMAIL=test@test.com PORTAL_PASSWORD=your-secure-password pnpm db:seed-portal-test");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("❌ Password must be at least 8 characters.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const [existingAccess] = await db.select().from(portalAccessTable).where(eq(portalAccessTable.email, email)).limit(1);
  if (existingAccess) {
    await db.update(portalAccessTable).set({ status: "granted" }).where(eq(portalAccessTable.email, email));
    console.log(`✅ Portal access for '${email}' set to granted.`);
  } else {
    await db.insert(portalAccessTable).values({ name, email, status: "granted" });
    console.log(`✅ Portal access for '${email}' created and granted.`);
  }

  const [existingUser] = await db.select().from(portalUsersTable).where(eq(portalUsersTable.email, email)).limit(1);
  if (existingUser) {
    await db.update(portalUsersTable).set({ passwordHash }).where(eq(portalUsersTable.email, email));
    console.log(`✅ Portal user '${email}' password updated.`);
  } else {
    await db.insert(portalUsersTable).values({ email, name, passwordHash, provider: "credentials" });
    console.log(`✅ Portal user '${email}' created.`);
  }
}

seedPortalTestUser()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed:", err);
    process.exit(1);
  });
