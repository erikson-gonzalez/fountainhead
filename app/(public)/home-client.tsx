"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import type { Album, ArtistInfo, Testimonial } from "@workspace/db";
import { Button } from "@/components/ui/button";
import { ArrowRight, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { AlbumCard } from "@/components/albums/album-card";
import { useTestimonialsCarousel } from "@/hooks/use-testimonials-carousel";

const DEFAULT_HERO_TAGLINE = "Berlin-based virtuoso guitarist, producer, and mixing engineer. Pushing boundaries in modern metal.";
const DEFAULT_HERO = { prefix: "Mastering the", highlight: "Fretless", suffix: "Dimension" };
const DEFAULT_HERO_VIDEO = "https://assets.mixkit.co/videos/3587/3587-720.mp4";
const DEFAULT_TESTIMONIALS_SECTION = { title: "Industry Voices", subtitle: "What top artists and students say about working with Fountainhead." };

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return match?.[1] ?? null;
}

interface HomeClientProps {
  artistInfo: ArtistInfo | null;
  albums: Album[];
  testimonials: Testimonial[];
}

export function HomeClient({ artistInfo, albums, testimonials }: HomeClientProps) {
  const [videoState, setVideoState] = useState<"loading" | "loaded" | "error">("loading");
  const youtubeId = getYouTubeId(artistInfo?.heroVideoUrl?.trim() || "");

  const { visible, total, index: tIndex, direction: tDir, prev, next, goTo } =
    useTestimonialsCarousel(testimonials);

  // artistInfo is server-fetched: the row (data present) or null (no row yet).
  // null takes the same branch the old client took while loading (undefined).
  const heroVideoUrl =
    !artistInfo ? null : (artistInfo.heroVideoUrl?.trim() || DEFAULT_HERO_VIDEO);
  const fallbackPoster = artistInfo?.heroPosterUrl?.trim() || "/images/hero-bg.png";

  useEffect(() => {
    if (heroVideoUrl) setVideoState("loading");
  }, [heroVideoUrl]);

  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {youtubeId ? (
            <iframe
              className="absolute w-[300%] h-[300%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
              allow="autoplay; encrypted-media"
              allowFullScreen={false}
              title="Hero background"
            />
          ) : heroVideoUrl && videoState !== "error" ? (
            <video
              key={heroVideoUrl}
              autoPlay
              muted
              loop
              playsInline
              poster={fallbackPoster}
              className={`w-full h-full object-cover transition-all duration-700 ease-out ${videoState === "loading" ? "blur-2xl scale-105" : "blur-0 scale-100"}`}
              src={heroVideoUrl}
              onLoadedData={() => setVideoState("loaded")}
              onCanPlay={() => setVideoState("loaded")}
              onError={() => setVideoState("error")}
            />
          ) : (
            <img
              src={fallbackPoster}
              alt=""
              className={`w-full h-full object-cover transition-all duration-700 ease-out ${!artistInfo ? "blur-2xl scale-105" : "blur-0 scale-100"}`}
              loading="eager"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/20" />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 uppercase tracking-[0.1em] leading-tight">
              {(() => {
                const prefix = !artistInfo ? DEFAULT_HERO.prefix : (artistInfo.heroTitlePrefix?.trim() ?? "");
                const highlight = !artistInfo ? DEFAULT_HERO.highlight : (artistInfo.heroTitleHighlight?.trim() ?? "");
                const suffix = !artistInfo ? DEFAULT_HERO.suffix : (artistInfo.heroTitleSuffix?.trim() ?? "");
                return (
                  <>
                    {prefix}
                    {prefix && (highlight || suffix) && <br />}
                    {highlight && <span className="text-gradient-red">{highlight}</span>}
                    {highlight && suffix && " "}
                    {suffix}
                  </>
                );
              })()}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 font-light tracking-wide max-w-2xl mx-auto">
              {!artistInfo ? DEFAULT_HERO_TAGLINE : (artistInfo.heroTagline?.trim() ?? "")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/services">
                <Button size="lg" className="w-full sm:w-auto">
                  Hire for Production
                </Button>
              </Link>
              <Link href="/book">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-foreground border-primary/25 hover:bg-primary/10 hover:border-primary/50 hover:text-primary">
                  Book a Lesson
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED DISCOGRAPHY */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground tracking-wider mb-2">Featured Works</h2>
            <div className="h-1 w-20 bg-primary" />
          </div>
          <Link href="/discography" className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium tracking-widest uppercase text-sm">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {albums.map((album, i) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.05, 0.15) }}
            >
              <AlbumCard album={album} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-black/50 border-y border-white/5 relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl aspect-square bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground tracking-wider mb-4">{artistInfo?.testimonialsSectionTitle?.trim() || DEFAULT_TESTIMONIALS_SECTION.title}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{artistInfo?.testimonialsSectionSubtitle?.trim() || DEFAULT_TESTIMONIALS_SECTION.subtitle}</p>
          </div>

          <div className="relative">
            {/* Nav buttons */}
            <button
              onClick={prev}
              disabled={total === 0}
              className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center text-foreground hover:bg-primary/20 hover:border-primary/50 hover:text-primary transition-colors disabled:opacity-30"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              disabled={total === 0}
              className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center text-foreground hover:bg-primary/20 hover:border-primary/50 hover:text-primary transition-colors disabled:opacity-30"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Cards */}
            <div className="overflow-hidden px-2">
              <AnimatePresence mode="popLayout" initial={false} custom={tDir}>
                <motion.div
                  key={tIndex}
                  custom={tDir}
                  variants={{
                    enter: (dir: number) => ({ x: dir * 80, opacity: 0 }),
                    center: { x: 0, opacity: 1 },
                    exit: (dir: number) => ({ x: dir * -80, opacity: 0 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                  {visible.map((t, i) => (
                    <div key={`${tIndex}-${i}`} className="glass-panel p-8 relative">
                      <Quote className="w-10 h-10 text-primary/30 absolute top-6 left-6" />
                      <p className="text-foreground/75 italic mb-6 relative z-10 pt-4">&quot;{t.quote}&quot;</p>
                      <div className="flex items-center gap-4 mt-auto">
                        <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center font-display font-bold text-lg text-secondary">
                          {t.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-foreground font-bold">{t.name}</h4>
                          <p className="text-xs text-primary uppercase tracking-wider">{t.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dots */}
            {total > 3 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: total }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === tIndex ? "bg-primary w-6" : "bg-primary/20 hover:bg-primary/40"}`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
