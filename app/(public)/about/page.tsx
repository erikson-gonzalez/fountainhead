import { db, artistInfoTable } from "@workspace/db";
import { AboutClient } from "./about-client";

// §1 labels About "Pure Server", but it uses framer-motion entrance animations
// (client-only). Per the confirmed §7 rule: server page fetches via Drizzle and
// passes data as props; the *-client component owns the animation/markup.
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [artistInfo] = await db.select().from(artistInfoTable).limit(1);
  return <AboutClient artistInfo={artistInfo ?? null} />;
}
