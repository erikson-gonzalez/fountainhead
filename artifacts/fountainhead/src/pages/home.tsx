import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useListAlbums, useListTestimonials } from "@workspace/api-client-react";
import { Play, Disc, ArrowRight, Quote } from "lucide-react";

export default function Home() {
  const { data: albumsData } = useListAlbums({ limit: 4, role: 'performer' });
  const { data: testimonialsData } = useListTestimonials();

  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt="Fountainhead Studio" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 uppercase tracking-[0.1em] leading-tight">
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
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-white border-white/20 hover:bg-white/10">
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
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-wider mb-2">Featured Works</h2>
            <div className="h-1 w-20 bg-primary" />
          </div>
          <Link href="/discography" className="hidden md:flex items-center gap-2 text-secondary hover:text-primary transition-colors font-medium tracking-widest uppercase text-sm">
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
              <div className="aspect-square relative mb-4 overflow-hidden bg-white/5 border border-white/10 rounded-sm">
                {album.coverUrl ? (
                  <img src={album.coverUrl} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    <Disc className="w-16 h-16" />
                  </div>
                )}
                <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                  <Play className="w-12 h-12 text-white ml-2" />
                </div>
              </div>
              <h3 className="text-white font-display text-lg font-bold truncate">{album.title}</h3>
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
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-wider mb-4">Industry Voices</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">What top artists and students say about working with Fountainhead.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData?.testimonials?.slice(0, 3).map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-panel p-8 relative"
              >
                <Quote className="w-10 h-10 text-primary/30 absolute top-6 left-6" />
                <p className="text-gray-300 italic mb-6 relative z-10 pt-4">"{t.quote}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-display font-bold text-lg text-secondary">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{t.name}</h4>
                    <p className="text-xs text-primary uppercase tracking-wider">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
