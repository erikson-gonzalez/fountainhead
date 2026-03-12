import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useListAlbums, useListTestimonials } from "@workspace/api-client-react";
import { Play, Disc, ArrowRight, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const VISIBLE = 3;

export default function Home() {
  const { data: albumsData } = useListAlbums({ limit: 4, role: 'performer' });
  const { data: testimonialsData } = useListTestimonials();
  const [tIndex, setTIndex] = useState(0);
  const [tDir, setTDir] = useState(1);

  const testimonials = testimonialsData?.testimonials ?? [];
  const total = testimonials.length;

  function prevTestimonial() {
    setTDir(-1);
    setTIndex((i) => (i - 1 + total) % total);
  }
  function nextTestimonial() {
    setTDir(1);
    setTIndex((i) => (i + 1) % total);
  }

  const visible = total > 0
    ? Array.from({ length: Math.min(VISIBLE, total) }, (_, k) => testimonials[(tIndex + k) % total])
    : [];

  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster={`${import.meta.env.BASE_URL}images/hero-bg.png`}
          >
            <source src="https://assets.mixkit.co/videos/3587/3587-720.mp4" type="video/mp4" />
          </video>
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
              Mastering the <br/><span className="text-gradient-red">Fretless</span> Dimension
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 font-light tracking-wide max-w-2xl mx-auto">
              Berlin-based virtuoso guitarist, producer, and mixing engineer. Pushing boundaries in modern metal.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/quote">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {albumsData?.albums?.map((album, i) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="aspect-square relative mb-4 overflow-hidden bg-secondary/5 border border-secondary/10 rounded-sm">
                {album.coverUrl ? (
                  <img src={album.coverUrl} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-secondary/20">
                    <Disc className="w-16 h-16" />
                  </div>
                )}
                <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                  <Play className="w-12 h-12 text-primary-foreground ml-2" />
                </div>
              </div>
              <h3 className="text-foreground font-display text-lg font-bold truncate">{album.title}</h3>
              <p className="text-muted-foreground text-sm uppercase tracking-wider">{album.artist}</p>
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
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground tracking-wider mb-4">Industry Voices</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">What top artists and students say about working with Fountainhead.</p>
          </div>

          <div className="relative">
            {/* Nav buttons */}
            <button
              onClick={prevTestimonial}
              disabled={total === 0}
              className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center text-foreground hover:bg-primary/20 hover:border-primary/50 hover:text-primary transition-colors disabled:opacity-30"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextTestimonial}
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
                      <p className="text-foreground/75 italic mb-6 relative z-10 pt-4">"{t.quote}"</p>
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
            {total > VISIBLE && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: total }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setTDir(i > tIndex ? 1 : -1); setTIndex(i); }}
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
