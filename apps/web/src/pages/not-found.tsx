import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Music } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Subtle vinyl groove background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-radial-gradient(
            circle at center,
            currentColor 0 1px,
            transparent 1px 12px
          )`,
        }}
      />

      <motion.div
        className="relative z-10 text-center max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Fretboard-inspired 404 */}
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-8">
          {["4", "0", "4"].map((digit, i) => (
            <motion.div
              key={digit}
              className="relative"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i, type: "spring", stiffness: 200 }}
            >
              <span className="font-display text-7xl md:text-9xl font-bold text-primary tracking-tighter block">
                {digit}
              </span>
              {/* Fret marker dot */}
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-secondary" />
            </motion.div>
          ))}
        </div>

        <motion.h1
          className="font-display text-2xl md:text-4xl font-bold text-foreground uppercase tracking-[0.2em] mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Off the fretboard
        </motion.h1>

        <motion.p
          className="text-muted-foreground text-lg md:text-xl mb-10 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          This page slipped beyond the 24th fret — it doesn&apos;t exist in this key.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-6"
        >
          <Link href="/">
            <Button size="lg" className="gap-2 group">
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Back to the main riff
            </Button>
          </Link>
          <div className="flex items-center gap-1 text-muted-foreground/30">
            <Music className="w-4 h-4" />
            <span className="text-xs tracking-[0.3em] uppercase font-display">rest in silence</span>
            <Music className="w-4 h-4" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
