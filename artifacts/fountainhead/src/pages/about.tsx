import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="w-full pt-24 pb-12 px-6 md:px-12 max-w-7xl mx-auto">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32 mt-12">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative aspect-[3/4] max-w-md mx-auto lg:mx-0 w-full"
        >
          <div className="absolute inset-0 bg-primary/20 translate-x-4 translate-y-4 rounded-sm border border-primary/30" />
          <img 
            src={`${import.meta.env.BASE_URL}images/about-portrait.png`}
            alt="Tom Geldschläger" 
            className="relative z-10 w-full h-full object-cover rounded-sm shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="font-display text-5xl font-bold text-white mb-2">TOM GELDSCHLÄGER</h1>
          <h2 className="text-xl text-primary uppercase tracking-[0.3em] mb-8 font-semibold">Fountainhead</h2>
          
          <div className="space-y-6 text-muted-foreground leading-relaxed text-lg font-light">
            <p>
              Renowned worldwide for his pioneering work on the fretless guitar, Tom Geldschläger (aka Fountainhead) is a multi-instrumentalist, producer, and mixing engineer operating out of his studio in Berlin, Germany.
            </p>
            <p>
              He has contributed to critically acclaimed records by artists such as Obscura, Defeated Sanity, Ray Riendeau, and many others, bridging the gap between extreme metal, jazz fusion, and cinematic soundscapes.
            </p>
            <p>
              As an educator, Tom has conducted masterclasses across the globe and built a dedicated community of students exploring advanced guitar techniques and creative production.
            </p>
          </div>

          <div className="mt-12 flex gap-4">
            <Link href="/contact">
              <Button>Contact Tom</Button>
            </Link>
            <Link href="/discography">
              <Button variant="outline">View Discography</Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ENDORSEMENTS */}
      <section className="py-16 border-t border-white/5">
        <div className="text-center mb-12">
          <h3 className="font-display text-2xl tracking-widest text-white uppercase">Official Endorsements</h3>
          <div className="h-1 w-12 bg-secondary mx-auto mt-4" />
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale">
          {/* Replace with actual logos in production, using text for now to match aesthetic */}
          {["Aristides Guitars", "Steinberg", "Engl Amplification", "Neural DSP", "Bare Knuckle Pickups", "Elixir Strings", "MONO"].map((brand) => (
            <div key={brand} className="font-display font-bold text-xl md:text-2xl hover:text-white hover:opacity-100 transition-all cursor-default">
              {brand}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
