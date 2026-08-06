import { NextResponse } from "next/server";
import { db, artistInfoTable } from "@workspace/db";

// GET /api/artist-info — public. Same payload shape as the Express route.
export async function GET() {
  try {
    const [row] = await db.select().from(artistInfoTable).limit(1);
    if (!row) {
      return NextResponse.json({
        tagline: "", bio: "", heroTagline: "", heroVideoUrl: "", heroVideoUrlMobile: "", heroPosterUrl: "",
        heroTitlePrefix: "", heroTitleHighlight: "", heroTitleSuffix: "",
        testimonialsSectionTitle: "", testimonialsSectionSubtitle: "",
        aboutHeading: "", aboutSubheading: "", aboutPortraitUrl: "",
        endorsements: "", endorsementsSectionTitle: "", musicLinks: "",
        facebookUrl: "", instagramUrl: "", tiktokUrl: "", youtubeUrl: "", bandcampUrl: "", merchUrl: "",
        contactEmail: "", contactPhone: "", contactAddress: "",
      });
    }
    return NextResponse.json({
      tagline: row.tagline,
      bio: row.bio,
      heroTagline: row.heroTagline ?? "",
      heroVideoUrl: row.heroVideoUrl,
      heroVideoUrlMobile: row.heroVideoUrlMobile ?? "",
      heroPosterUrl: row.heroPosterUrl,
      heroTitlePrefix: (row.heroTitlePrefix ?? "").trim(),
      heroTitleHighlight: (row.heroTitleHighlight ?? "").trim(),
      heroTitleSuffix: (row.heroTitleSuffix ?? "").trim(),
      testimonialsSectionTitle: row.testimonialsSectionTitle,
      testimonialsSectionSubtitle: row.testimonialsSectionSubtitle,
      aboutHeading: row.aboutHeading,
      aboutSubheading: row.aboutSubheading,
      aboutPortraitUrl: row.aboutPortraitUrl,
      endorsements: row.endorsements,
      endorsementsSectionTitle: row.endorsementsSectionTitle ?? "Official Endorsements",
      musicLinks: row.musicLinks,
      facebookUrl: row.facebookUrl ?? "",
      instagramUrl: row.instagramUrl ?? "",
      tiktokUrl: row.tiktokUrl ?? "",
      youtubeUrl: row.youtubeUrl ?? "",
      bandcampUrl: row.bandcampUrl ?? "",
      merchUrl: row.merchUrl ?? "",
      contactEmail: row.contactEmail,
      contactPhone: row.contactPhone,
      contactAddress: row.contactAddress,
    });
  } catch (err) {
    console.error("Error fetching artist info:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
