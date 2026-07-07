import { Router, type IRouter } from "express";
import { db, artistInfoTable } from "@workspace/db";

const router: IRouter = Router();

/** Public: get artist info for the website */
router.get("/", async (_req, res) => {
  try {
    const [row] = await db.select().from(artistInfoTable).limit(1);
    if (!row) {
      return res.json({
        tagline: "",
        bio: "",
        heroTagline: "",
        heroVideoUrl: "",
        heroPosterUrl: "",
        heroTitlePrefix: "",
        heroTitleHighlight: "",
        heroTitleSuffix: "",
        testimonialsSectionTitle: "",
        testimonialsSectionSubtitle: "",
        aboutHeading: "",
        aboutSubheading: "",
        aboutPortraitUrl: "",
        endorsements: "",
        endorsementsSectionTitle: "",
        musicLinks: "",
        contactEmail: "",
        contactPhone: "",
        contactAddress: "",
      });
    }
    const r = row as Record<string, unknown>;
    console.log("[artist-info GET] heroTitlePrefix from DB:", JSON.stringify(r.heroTitlePrefix));
    const heroTitlePrefix = (r.heroTitlePrefix ?? r.hero_title_prefix ?? "")?.toString?.()?.trim() ?? "";
    const heroTitleHighlight = (r.heroTitleHighlight ?? r.hero_title_highlight ?? "")?.toString?.()?.trim() ?? "";
    const heroTitleSuffix = (r.heroTitleSuffix ?? r.hero_title_suffix ?? "")?.toString?.()?.trim() ?? "";
    return res.json({
      tagline: row.tagline,
      bio: row.bio,
      heroTagline: row.heroTagline ?? "",
      heroVideoUrl: row.heroVideoUrl,
      heroPosterUrl: row.heroPosterUrl,
      heroTitlePrefix,
      heroTitleHighlight,
      heroTitleSuffix,
      testimonialsSectionTitle: row.testimonialsSectionTitle,
      testimonialsSectionSubtitle: row.testimonialsSectionSubtitle,
      aboutHeading: row.aboutHeading,
      aboutSubheading: row.aboutSubheading,
      aboutPortraitUrl: row.aboutPortraitUrl,
      endorsements: row.endorsements,
      endorsementsSectionTitle: (row as { endorsementsSectionTitle?: string }).endorsementsSectionTitle ?? "Official Endorsements",
      musicLinks: row.musicLinks,
      contactEmail: row.contactEmail,
      contactPhone: row.contactPhone,
      contactAddress: row.contactAddress,
    });
  } catch (err) {
    console.error("Error fetching artist info:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
