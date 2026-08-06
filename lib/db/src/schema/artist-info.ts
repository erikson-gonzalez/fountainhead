import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const artistInfoTable = pgTable("artist_info", {
  id: serial("id").primaryKey(),
  tagline: text("tagline").notNull().default(""),
  bio: text("bio").notNull().default(""),
  heroTagline: text("hero_tagline").notNull().default(""),
  heroVideoUrl: text("hero_video_url").notNull().default(""),
  heroVideoUrlMobile: text("hero_video_url_mobile").notNull().default(""),
  heroPosterUrl: text("hero_poster_url").notNull().default(""),
  heroTitlePrefix: text("hero_title_prefix").notNull().default("Mastering the"),
  heroTitleHighlight: text("hero_title_highlight").notNull().default("Fretless"),
  heroTitleSuffix: text("hero_title_suffix").notNull().default("Dimension"),
  testimonialsSectionTitle: text("testimonials_section_title").notNull().default("Industry Voices"),
  testimonialsSectionSubtitle: text("testimonials_section_subtitle").notNull().default("What top artists and students say about working with Fountainhead."),
  aboutHeading: text("about_heading").notNull().default("TOM GELDSCHLÄGER"),
  aboutSubheading: text("about_subheading").notNull().default("Fountainhead"),
  aboutPortraitUrl: text("about_portrait_url").notNull().default(""),
  endorsements: text("endorsements").notNull().default(""),
  endorsementsSectionTitle: text("endorsements_section_title").notNull().default("Official Endorsements"),
  musicLinks: text("music_links").notNull().default(""),
  facebookUrl: text("facebook_url").notNull().default(""),
  instagramUrl: text("instagram_url").notNull().default(""),
  tiktokUrl: text("tiktok_url").notNull().default(""),
  youtubeUrl: text("youtube_url").notNull().default(""),
  bandcampUrl: text("bandcamp_url").notNull().default(""),
  merchUrl: text("merch_url").notNull().default(""),
  contactEmail: text("contact_email").notNull().default(""),
  contactPhone: text("contact_phone").notNull().default(""),
  contactAddress: text("contact_address").notNull().default(""),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ArtistInfo = typeof artistInfoTable.$inferSelect;
export type InsertArtistInfo = typeof artistInfoTable.$inferInsert;
