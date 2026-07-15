import { NextResponse, type NextRequest } from "next/server";
import { db, artistInfoTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

// PUT /api/admin/artist-info — admin (middleware-gated). Ported verbatim.
const artistInfoSchema = z.object({
  tagline: z.string().optional(),
  bio: z.string().optional(),
  heroTagline: z.string().optional(),
  heroVideoUrl: z.string().optional(),
  heroPosterUrl: z.string().optional(),
  heroTitlePrefix: z.string().optional(),
  heroTitleHighlight: z.string().optional(),
  heroTitleSuffix: z.string().optional(),
  testimonialsSectionTitle: z.string().optional(),
  testimonialsSectionSubtitle: z.string().optional(),
  aboutHeading: z.string().optional(),
  aboutSubheading: z.string().optional(),
  aboutPortraitUrl: z.string().optional(),
  endorsementsSectionTitle: z.string().optional(),
  endorsements: z.string().optional(),
  musicLinks: z.string().optional(),
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
  contactAddress: z.string().optional(),
});

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const parsed = artistInfoSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;

    const [existing] = await db.select().from(artistInfoTable).limit(1);

    // Use raw body to allow clearing fields: if key present (even ""), use it; else keep existing.
    const heroTitlePrefix =
      body && "heroTitlePrefix" in body
        ? String(body.heroTitlePrefix ?? "").trim()
        : ((existing as { heroTitlePrefix?: string })?.heroTitlePrefix ?? "");
    const heroTitleHighlight =
      body && "heroTitleHighlight" in body
        ? String(body.heroTitleHighlight ?? "").trim()
        : ((existing as { heroTitleHighlight?: string })?.heroTitleHighlight ?? "");
    const heroTitleSuffix =
      body && "heroTitleSuffix" in body
        ? String(body.heroTitleSuffix ?? "").trim()
        : ((existing as { heroTitleSuffix?: string })?.heroTitleSuffix ?? "");

    const payload = {
      tagline: data.tagline ?? existing?.tagline ?? "",
      bio: data.bio ?? existing?.bio ?? "",
      heroTagline: data.heroTagline ?? existing?.heroTagline ?? "",
      heroVideoUrl: data.heroVideoUrl ?? existing?.heroVideoUrl ?? "",
      heroPosterUrl: data.heroPosterUrl ?? existing?.heroPosterUrl ?? "",
      heroTitlePrefix,
      heroTitleHighlight,
      heroTitleSuffix,
      testimonialsSectionTitle: data.testimonialsSectionTitle ?? existing?.testimonialsSectionTitle ?? "",
      testimonialsSectionSubtitle: data.testimonialsSectionSubtitle ?? existing?.testimonialsSectionSubtitle ?? "",
      aboutHeading: data.aboutHeading ?? existing?.aboutHeading ?? "",
      aboutSubheading: data.aboutSubheading ?? existing?.aboutSubheading ?? "",
      aboutPortraitUrl: data.aboutPortraitUrl ?? existing?.aboutPortraitUrl ?? "",
      endorsementsSectionTitle: data.endorsementsSectionTitle ?? existing?.endorsementsSectionTitle ?? "Official Endorsements",
      endorsements: data.endorsements ?? existing?.endorsements ?? "",
      musicLinks: data.musicLinks ?? existing?.musicLinks ?? "",
      contactEmail: data.contactEmail ?? existing?.contactEmail ?? "",
      contactPhone: data.contactPhone ?? existing?.contactPhone ?? "",
      contactAddress: data.contactAddress ?? existing?.contactAddress ?? "",
    };

    if (existing) {
      await db.update(artistInfoTable).set({ ...payload, updatedAt: new Date() }).where(eq(artistInfoTable.id, existing.id));
    } else {
      await db.insert(artistInfoTable).values(payload);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error updating artist info:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
